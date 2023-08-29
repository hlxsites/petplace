import { Feed } from 'feed';
import fs from 'fs';

const targetDirectory = process.argv[2];
const limit = 1000;

function sanitize(str) {
  return str
    .replaceAll('&amp;', '&')
    .replaceAll('\x92', '\'')
    .replaceAll('\x97', '—')
}
async function fetchArticles() {
  let offset = 0;
  const allPosts = [];

  while (true) {
    const api = new URL('https://www.petplace.com/article/query-index.json?sheet=article');
    api.searchParams.append('offset', JSON.stringify(offset));
    api.searchParams.append('limit', limit);
    const response = await fetch(api);
    const result = await response.json();

    allPosts.push(...result.data);

    if (result.offset + result.limit < result.total) {
      // there are more pages
      offset = result.offset + result.limit;
    } else {
      break;
    }
  }
  return allPosts;
}

async function main() {
  const articles = await fetchArticles();
  const newestPost = Math.max(...articles.map((article) => article.date));
  const feed = new Feed({
    title: `PetPlace.com articles`,
    id: 'petplace.com',
    link: `https://www.petplace.com/rss.xml`,
    updated: new Date(newestPost * 1000),
    generator: 'News feed generator (GitHub action)',
    language: 'en',
    copyright: `All rights reserved ${new Date().getFullYear()},  Independence America Holdings Corp.`,
  });

  articles.forEach((article) => {
    feed.addItem({
      id: `https://www.petplace.com${article.path}`,
      title: sanitize(article.title),
      description: sanitize(article.description),
      link: `https://www.petplace.com${article.path}`,
      author: [{
        name: article.author,
      }],
      date: article.date ? new Date(article.date * 1000) : '',
      image: `https://www.petplace.com${article.image.replace(/\?.*/, '')}`,
      category: article['category name'] ? [{name: article['category name'] }] : ''
    })
  });

  if (!fs.existsSync(targetDirectory)) {
    fs.mkdirSync(targetDirectory);
  }

  fs.writeFileSync(`${targetDirectory}/atom.xml`, feed.atom1());
  fs.writeFileSync(`${targetDirectory}/rss.xml`, feed.rss2());
}

main()
  .catch((e) => console.error(e));