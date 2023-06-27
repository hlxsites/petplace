import fetch from 'node-fetch';
import bulkOperation from './utils.js';

const FRANKLIN_ADMIN_API = 'https://admin.hlx.page/';
const orgRepoRef = '/hlxsites/petplace/main';

const op = process.argv[2];

await bulkOperation(process.argv[3], async ({ pathname }) => {
  try {
    const response = await fetch(`${FRANKLIN_ADMIN_API}${op}${orgRepoRef}${pathname.replace(/\/$/, '')}`, {
      method: 'POST',
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      },
    });
    if (!response.ok) {
      console.log(pathname, response.status);
    }
    process.stdout.write('.');
  } catch (err) {
    console.log(pathname, err.message);
  }
});
