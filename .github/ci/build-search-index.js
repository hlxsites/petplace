import fs from 'fs';
import elasticlunr from 'elasticlunr';
import { fetchArticles } from './utils.js';

const targetDirectory = process.argv[2];
const locale = getLocaleForUrl(process.argv[3]);
const fileSuffix = locale === 'en-US' ? '' : `.${locale.toLowerCase()}`;

const articles = await fetchArticles(locale);

function minimizeIndexedData(doc) {
  if (doc.title === doc.description) {
    delete doc.description;
  }
  doc.image = doc.image.replace(/\?.*/, '');
  delete doc['category name'];
  delete doc['category slug'];
  delete doc.imageAlt;
  delete doc.lastModified;
  delete doc.tags;
  delete doc.type;
  return doc;
}

// Pre-build the search index from the returned articles
const idx = elasticlunr(function () {
  this.setRef('path');
  this.addField('title');
  this.addField('description');
  this.addField('category');
  this.addField('author');

  articles.forEach((doc) => this.addDoc(minimizeIndexedData(doc)));
});

// Save the search index to a static file in the repository
const targetFile = `${targetDirectory}/search-index${fileSuffix}.db`;
fs.writeFileSync(targetFile, JSON.stringify(idx));
