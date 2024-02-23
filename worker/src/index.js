/* eslint-disable import/no-unresolved */
import { SimpleCache } from 'fastly:cache';
import { SecretStore } from 'fastly:secret-store';

function badRequest() {
  return new Response('Bad Request', {
    status: 400,
  });
}
async function getNewsletterToken() {
  const secrets = new SecretStore('services_secrets');
  const clientId = await secrets.get('newsletter_client_id');
  const clientSecret = await secrets.get('newsletter_client_secret');
  const backendResponse = await fetch('/interaction/v1/requestToken', {
    backend: 'newsletter',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      clientId: clientId.plaintext(),
      clientSecret: clientSecret.plaintext(),
    }),
  });
  const json = await backendResponse.json();
  return json.accessToken;
}

async function handleRequest(event) {
  const req = event.request;

  // Reject invalid origins
  if (!req.headers.has('origin')) {
    return badRequest();
  }

  const originUrl = new URL(req.headers.get('origin'));
  if (![
    /^localhost$/, // local dev
    /--petplace--hlxsites\.hlx\.(page|live)$/, // EDS URLs
    /^www.petplace.com$/, // prod host
  ].some((allowedHost) => originUrl.hostname.match(allowedHost))) {
    return badRequest();
  }

  const url = new URL(req.url);
  if (url.pathname === '/services/newsletter' && req.method === 'POST') {
    const accessToken = SimpleCache.getOrSet('newsletter-token', async () => ({
      value: await getNewsletterToken(),
      ttl: 3600,
    }));
    const backendRequest = new Request('/interaction/v1/events', req);
    const backendResponse = await fetch(backendRequest, {
      backend: 'newsletter',
      headers: {
        Authorrization: `Bearer ${accessToken}`,
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
