import fs from 'fs';
import { parse } from 'csv-parse';
import Sitemapper from 'sitemapper';
import Excel from 'exceljs';

const sitemap = await new Sitemapper()
  .fetch('https://www.petplace.com/sitemap.xml');

const getSlug = (url) => {
  let { pathname } = url;
  if (pathname.endsWith('.aspx')) {
    pathname = pathname.replace(/\/page\d+\.aspx/, '');
  }
  pathname = pathname.replace(/\/(\d+|feed)\/?$/, '');
  try {
    return pathname.endsWith('/')
      ? pathname.split('/').splice(-2, 1)[0]
      : pathname.split('/').pop();
  } catch (err) {
    return null;
  }
};

const workbook = new Excel.Workbook();
await workbook.xlsx.readFile('./redirects.xlsx');
const worksheet = workbook.getWorksheet(1);

fs.createReadStream('./Table.csv')
  .pipe(parse({ delimiter: ',' }))
  .on('data', (r) => {
    let url;
    try {
      url = new URL(r[0]);
    } catch (err) {
      return;
    }

    const slug = getSlug(url);

    const articleUrl = sitemap.sites.find((link) => link.endsWith(`/${slug}`));
    if (articleUrl) {
      worksheet.addRow([url.pathname, new URL(articleUrl).pathname]);
    }
  })
  .on('end', async () => {
    await workbook.xlsx.writeFile('redirects.xlsx');
  });
