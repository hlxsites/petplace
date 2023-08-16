import fetch from 'node-fetch';
import fs from 'fs';
import lunr from 'lunr';

const resp = await fetch('https://www.petplace.com/article/query-index.json?sheet=article&limit=15000');
const json = await resp.json();

const idx = lunr(function () {
  this.ref('path');
  this.field('title');
  this.field('description');
  this.field('author');
  this.field('category name');

  json.data.forEach((doc) => this.add(doc));
});

const targetDirectory = process.argv[2];
const targetFile = `${targetDirectory}/search-index.json`;
fs.writeFileSync(targetFile, JSON.stringify(idx));
