import fs from 'fs';
import { getLocaleForUrl } from './utils.js';

const hlx = false; // change this to true for local testing

const targetDirectory = process.argv[2] || '.';
const locale = getLocaleForUrl(process.argv[3]);
const site = hlx ? 'main--petplace--hlxsites.hlx.page' : 'www.petplace.com'

const root = locale === 'en-US' ? '' : `/${locale.toLowerCase()}`;
const api = new URL(`https://${site}${root}/ads-txt-file.json`);
const response = await fetch(api);
const result = await response.json();

const targetFile = `${targetDirectory}/ads-new.txt`;
console.log(`Writing ads file to ${targetFile}`);
fs.writeFileSync(targetFile, result.data[0].script);
