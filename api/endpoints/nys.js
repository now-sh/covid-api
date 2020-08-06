const fetch = require('node-fetch');
const cheerio = require('cheerio');

const nysurl = 'https://health.data.ny.gov/resource/xdss-u53e.json';
const cache = null;
const lastCacheTime = null;

async function nys() {
  if (cache && lastCacheTime > Date.now() - 1000 * 60 * 10) {
    return cache;
  }

  return fetch(nysurl)
    .then((response) => response.json())
    .then((json) => json).catch(() => []);
}

module.exports = nys;
