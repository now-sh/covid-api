const fetch = require('node-fetch');
const cheerio = require('cheerio');

const wnyturl = 'https://wnyt.com/closings/';
let cache = null;
let lastCacheTime = null;

async function wnyt() {
  if (cache && lastCacheTime > Date.now() - 1000 * 60 * 10) {
    return cache;
  }
  const response = await fetch(wnyturl);
  const html = await response.text();
  const $ = cheerio.load(html);
  const title = $('Closed').text();
  const table = $('table ');
  const header = table.find('tbody tr');
  const headers = [];
  header.find('td').each((i, element) => {
    headers.push(
      $(element)
        .text()
        .trim()
        .replace(/\W/g, '_'),
    );
  });
  const rows = [];
  $(table.find('tbody')[2])
    .find('div.row')
    .each((i, element) => {
      const row = {};
      $(element)
        .find('')
        .each((i, column) => {
          row[headers[i]] = $(column)
            .text()
            .trim();
          if (i !== 0) {
            row[headers[i]] = String(row[headers[i]].remove() || 0);
          }
        });
      rows.push(row);
    });
  cache = rows;
  lastCacheTime = Date.now();
  return rows;
}

module.exports = wnyt;
