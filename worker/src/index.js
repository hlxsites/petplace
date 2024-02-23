/* eslint-disable import/no-unresolved */
import { env } from 'fastly:env';
import { SimpleCache } from 'fastly:cache';
import { SecretStore } from 'fastly:secret-store';

const VALID_HOSTS = [
  /^localhost$/, // local dev
  /--petplace--hlxsites\.hlx\.(page|live)$/, // EDS URLs
  /^www.petplace.com$/, // prod host
];

function badRequest() {
  return new Response('Bad Request', {
    status: 400,
  });
}

async function getNewsletterToken() {
  const secrets = new SecretStore('services_secrets');
  const authBackend = await secrets.get('newsletter_auth_backend');
  const clientId = await secrets.get('newsletter_client_id');
  const clientSecret = await secrets.get('newsletter_client_secret');
  const body = {
    grant_type: 'client_credentials',
    client_id: clientId.plaintext(),
    client_secret: clientSecret.plaintext(),
  };
  const backendResponse = await fetch(`https://${authBackend.plaintext()}/v2/token`, {
    backend: 'auth',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const json = await backendResponse.json();
  return json.access_token;
}

async function handleRequest(event) {
  const req = event.request;

  // Reject invalid origins
  if (!req.headers.has('origin')) {
    return badRequest();
  }

  const originUrl = new URL(req.headers.get('origin'));
  if (!VALID_HOSTS.some((host) => originUrl.hostname.match(host))) {
    return badRequest();
  }

  const url = new URL(req.url);
  if (url.pathname === '/services/newsletter' && req.method === 'POST') {
    const accessToken = env('FASTLY_HOSTNAME') === 'localhost'
      ? await getNewsletterToken()
      : SimpleCache.getOrSet('newsletter-token', async () => ({
        value: await getNewsletterToken(),
        ttl: 3600,
      }));
    const secrets = new SecretStore('services_secrets');
    const restBackend = await secrets.get('newsletter_rest_backend');
    const backendRequest = new Request(`https://${restBackend.plaintext()}/interaction/v1/events`, req);
    const backendResponse = await fetch(backendRequest, {
      backend: 'newsletter',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    backendResponse.headers.append('Access-Control-Allow-Origin', originUrl.origin);
    return backendResponse;
  }

  return badRequest();
}

// eslint-disable-next-line no-restricted-globals
addEventListener('fetch', (event) => event.respondWith(handleRequest(event)));
