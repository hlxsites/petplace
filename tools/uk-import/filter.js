import fs from 'fs';
import csv from 'csv-parser';
import { PublicClientApplication, LogLevel } from '@azure/msal-node';

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
 */
const msalConfig = {
  auth: {
    clientId: 'a5047ece-6169-4aa9-91ed-7f3324c632d0',
    authority: 'https://login.microsoftonline.com/fa7b1b5a-7b34-4387-94ae-d2c178decee1',
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message) {
        console.log(message);
      },
      piiLoggingEnabled: false,
    },
  },
};

// Customer details for sharepoint API
const domain = 'adobe.sharepoint.com';
const domainId = 'fac8f079-f817-4127-be6b-700b19217904';
const siteId = 'b1df5119-9614-4126-8064-ab9bd8cef865';
const rootPath = '/sites/petplace';
const baseUri = `https://graph.microsoft.com/v1.0/sites/${domain},${domainId},${siteId}/drive/root:${rootPath}`;

const headers = new Headers();
headers.append('Accept', 'application/json');
headers.append('Content-Type', 'application/json');

/**
* Initialize a public client application. For more information, visit:
* https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-public-client-application.md
*/
const pca = new PublicClientApplication(msalConfig);

const deviceCodeRequest = {
  deviceCodeCallback: (response) => (console.log(response.message)),
  scopes: ['user.read'],
  timeout: 60,
};

let accessToken;
try {
  accessToken = await fs.promises.readFile('.token');

  headers.append('Authorization', `Bearer ${accessToken}`);

  await fetch(baseUri, { headers });
  // file written successfully
} catch (err) {
  const tokenResponse = await pca.acquireTokenByDeviceCode(deviceCodeRequest);
  accessToken = tokenResponse.accessToken;
  await fs.promises.writeFile('.token', accessToken);

  headers.append('Authorization', `Bearer ${accessToken}`);
}

const oldRoot = '/';
const newRoot = '/en-gb/';

async function ensureParentFolder(path) {
  const parentPath = path.split('/').slice(0, -1).join('/');
  if (parentPath) {
    await ensureParentFolder(parentPath);
  }
  let res = await fetch(`${baseUri}${parentPath}`, { headers });
  if (!res.ok) {
    res = await fetch(`${baseUri}${parentPath}:/children`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name: path.split('/').pop(), folder: {} }),
    });
    console.log('📁', '[CREATED]', parentPath, res.ok);
  }
  return res.json();
}

function printProgress(i, total) {
  if (i % 100 === 0) {
    console.log('️️ℹ️', '[STATUS]', i, '/', total, `(${Math.round((i / total) * 100)}%)`);
  }
}

const results = [];
fs.createReadStream('data.csv')
  .pipe(csv())
  // Extracting path from url
  .on('data', (data) => {
    const { pathname } = new URL(Object.entries(data)[0][1]);
    const path = `${pathname.endsWith('/') ? `${pathname}index` : pathname}.docx`;
    results.push(path);
  })
  // Get download URL for each file
  .on('end', async () => {
    const files = results;
    for (let i = 0; i < files.length; i += 1) {
      const path = files[i];
      const newPath = path.replace(oldRoot, newRoot);
      try {
        // eslint-disable-next-line no-await-in-loop
        let res = await fetch(`${baseUri}${newPath}`, { headers });
        if (res.ok) {
          console.log('✓', '[EXISTS]', newPath);
          printProgress(i, files.length);
          // eslint-disable-next-line no-continue
          continue;
        }
        // eslint-disable-next-line no-await-in-loop
        res = await fetch(`${baseUri}${path}`, { headers });
        if (!res.ok) {
          console.log('🔎', '[MISSED]', newPath, res.status);
          printProgress(i, files.length);
          // eslint-disable-next-line no-continue
          continue;
        }

        // eslint-disable-next-line no-await-in-loop
        const parentFolder = await ensureParentFolder(`${newPath}`);
        // eslint-disable-next-line no-await-in-loop
        res = await fetch(`${baseUri}${path}:/copy?@microsoft.graph.conflictBehavior=fail`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            parentReference: {
              driveId: parentFolder.parentReference.driveId,
              id: parentFolder.id,
            },
          }),
        });
        if (!res.ok) {
          console.error('❌', '[FAILED]', newPath, res.status, res.statusText);
        } else {
          console.log('✅', '[COPIED]', newPath);
          // eslint-disable-next-line no-await-in-loop
          await new Promise((resolve) => { setTimeout(resolve, 1000); });
        }
      } catch (err) {
        console.error('🚫', '[ERROR]', newPath, err);
      }
      printProgress(i, files.length);
    }
  });
