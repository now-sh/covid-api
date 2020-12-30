const fetch = require('node-fetch');
const cheerio = require('cheerio');
const datetime = require('node-datetime');

var dt = datetime.create();
dt.offsetInDays(-1);
var yesterday = dt.format('Y-m-d');

const nysurl = 'https://health.data.ny.gov/resource/xdss-u53e.json?test_date=' + yesterday + 'T00:00:00.000';
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
