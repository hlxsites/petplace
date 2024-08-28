import fs from 'fs';

const targetDirectory = process.argv[2] || '.';
const site = process.env.CI ? 'www.petplace.com' : 'main--petplace--hlxsites.hlx.page';

// fetch ads json file as api, and output result
const api = new URL(`https://${site}/ads-txt-file.json`);
const response = await fetch(api);
const result = await response.json();

const targetFile = `${targetDirectory}/ads-new.txt`;
console.log(`Writing ads file to ${targetFile}`);
fs.writeFileSync(targetFile, result.data[0].script);
