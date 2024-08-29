import fs from 'fs';

const targetDirectory = process.argv[2] || '.';
const site = process.env.CI ? 'www.petplace.com' : 'main--petplace--hlxsites.hlx.page';

// fetch ads json file as api, and output result
const api = new URL(`https://${site}/ads-txt-file.json`);
const response = await fetch(api);
const result = await response.json();

const dbAdsFile = `${targetDirectory}/ads-txt.db`;
const txtAdsFile = `${targetDirectory}/ads.txt`;

// using DB file to check for published date
if (!fs.existsSync(dbAdsFile)) {
  console.log(`Creating ads db to ${dbAdsFile}`);
  fs.writeFileSync(dbAdsFile, JSON.stringify(result.data[0]));
}

// initial creation of the ads file if it doesn't exist
if (!fs.existsSync(txtAdsFile)) {
  console.log(`Creating ads file to ${txtAdsFile}`);
  fs.writeFileSync(txtAdsFile, result.data[0].script);
}

const dbAdsFileData = fs.readFileSync(dbAdsFile, 'utf8');
const dateFromFile = JSON.parse(dbAdsFileData).stamp;

// only updates if the time stamps don't match
if (result.data[0].stamp !== dateFromFile) {
  console.log(`Update for ads file and DB`);
  fs.writeFileSync(txtAdsFile, result.data[0].script);
  fs.writeFileSync(dbAdsFile, JSON.stringify(result.data[0]));
}
