import fs from 'fs';

const targetDirectory = process.argv[2] || '.';
const site = process.env.CI ? 'www.petplace.com' : 'main--petplace--hlxsites.hlx.page';

// fetch ads json file as api, and output result
const api = new URL(`https://${site}/ads-txt-file.json`);
const response = await fetch(api);
const result = await response.json();

const txtAdsFile = `${targetDirectory}/ads.txt`;

// initial creation of the ads file if it doesn't exist
if (!fs.existsSync(txtAdsFile)) {
  console.log(`Creating ads file to ${txtAdsFile}`);
  fs.writeFileSync(txtAdsFile, result.data[0].script);
}

const txtAdsFileData = fs.readFileSync(txtAdsFile,  { encoding: 'utf8', flag: 'r' });
const dateFromFile = txtAdsFileData.match(/\d{2}-\d{2}-\d{4}/) || [];

// only updates if the time stamps don't match
if (result.data[0].stamp !== dateFromFile[0]) {
  console.log("Update for ads file and DB");
  fs.writeFileSync(txtAdsFile, result.data[0].script);
} else {
  console.log("Skipping ads file and DB update. Timestamp hasn't changed.");
}
