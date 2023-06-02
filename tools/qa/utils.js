import fs from 'fs';
import { parse } from 'csv-parse';

async function readCSV(csvPath) {
  const urls = [];
  return new Promise((resolve) => {
    fs.createReadStream(csvPath)
      .pipe(parse({ delimiter: ',', from_line: 2 }))
      .on('data', (row) => {
        const [url] = row;
        urls.push(url);
      })
      .on('end', () => resolve(urls));
  });
}
export default async function bulkOperation(csvPath, fn, options = {}) {
  const urls = await readCSV(csvPath);
  return urls.reduce(async (promise, urlString, i) => {
    const results = await promise;
    const url = new URL(urlString);
    try {
      const result = await fn(url);
      if (result) {
        results.push(result);
      }

      if (options.logProgress) {
        process.stdout.write(result ? '●' : '○');
        if (i && (i + 1) % 100 === 0) {
          // eslint-disable-next-line no-console
          console.log(`${i + 1} / ${urls.length}`);
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }

    // Sleep for 1s before continuing
    await new Promise((resolve) => { setTimeout(resolve, options.sleep || 500); });
    return results;
  }, Promise.resolve([]));
}
