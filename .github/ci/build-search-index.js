import fetch from 'node-fetch';
import fs from 'fs';
import elasticlunr from 'elasticlunr';

const resp = await fetch('https://www.petplace.com/article/query-index.json?sheet=article&limit=15000');
const json = await resp.json();

const idx = elasticlunr(function () {
  this.setRef('path');
  this.addField('title');
  this.addField('description');
  this.addField('category name');
  this.addField('author');

  json.data.forEach((doc) => this.addDoc(doc));
});

const targetDirectory = process.argv[2];
const targetFile = `${targetDirectory}/search-index.json`;
fs.writeFileSync(targetFile, JSON.stringify(idx));
