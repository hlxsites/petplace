import { Feed } from 'feed';
import fs from 'fs';
import { fetchArticles, getLocaleForUrl } from './utils.js';

const targetDirectory = process.argv[2];
const locale = getLocaleForUrl(process.argv[3]);
const fileSuffix = locale === 'en-US' ? '' : `.${locale.toLowerCase()}`;
const contentBasePath = locale === 'en-US' ? '' : `/${locale.toLowerCase()}`;

function sanitize(str) {
  return str
    .replaceAll('&amp;', '&#x26;')
    .replaceAll('&', '&#x26;')
    .replaceAll('&amp;#x26;', '&#x26;')
    .replaceAll('<', '&#x3C;')
    .replaceAll('\x91', '&#x27;') // single quote (opening)
    .replaceAll('\x92', '&#x27;') // single quote (closing)
    .replaceAll('\x93', '&#x22;') // double quote (opening)
    .replaceAll('\x94', '&#x22;') // double quote (closing)
    .replaceAll('\x96', '&#x2013;') // ndash
    .replaceAll('\x97', '&#x2014;') // mdash
    .replaceAll('\x98', '&#x7e;') // tilda symbole
    .replaceAll('\x99', '&#x2122;'); // TM symbol
}

async function main() {
  const articles = await fetchArticles(locale);
  const newestPost = Math.max(...articles.map((article) => article.date));
  const feed = new Feed({
    title: `PetPlace.com articles`,
    id: `https://www.petplace.com${contentBasePath}`,
    link: `https://www.petplace.com${contentBasePath}`,
    updated: new Date(newestPost * 1000),
    generator: 'News feed generator (GitHub action)',
    language: locale,
    copyright: `All rights reserved ${new Date().getFullYear()},  Independence America Holdings Corp.`,
    feedLinks: {
      atom: `https://www.petplace.com/atom${fileSuffix}.xml`,
      rss: `https://www.petplace.com/rss${fileSuffix}.xml`
    },
  });

  articles.forEach((article) => {
    feed.addItem({
      id: `https://www.petplace.com${contentBasePath}${article.path}`,
      title: sanitize(article.title),
      description: sanitize(article.description),
      link: `https://www.petplace.com${contentBasePath}${article.path}`,
      author: article.author
        ? [{ name: article.author }]
        : '',
      date: article.date ? new Date(article.date * 1000) : '',
      image: `https://www.petplace.com${contentBasePath}${article.image.replace(/\?.*/, '')}`,
      category: article['category name']
        ? [{ name: sanitize(article['category name']), term: article.category }]
        : ''
    })
  });

  if (!fs.existsSync(targetDirectory)) {
    fs.mkdirSync(targetDirectory);
  }

  fs.writeFileSync(`${targetDirectory}/atom${fileSuffix}.xml`, feed.atom1());
  fs.writeFileSync(`${targetDirectory}/rss${fileSuffix}.xml`, feed.rss2());
}

main()
  .catch((e) => console.error(e));