const fetch = require('node-fetch');
const cheerio = require('cheerio');

const arcgisurl = 'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/1/query?f=json&where=Confirmed%20%3E%200&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Confirmed%20desc%2CCountry_Region%20asc%2CProvince_State%20asc&resultOffset=0&resultRecordCount=1000&cacheHint=false%27';
const cache = null;
const lastCacheTime = null;

async function arcgis() {
  if (cache && lastCacheTime > Date.now() - 1000 * 60 * 10) {
    return cache;
  }

  const elements = {
    yourLocation: document.querySelector('#your-location'),
    closestLocation: document.querySelector('#closest-location'),
    distance: document.querySelector('#distance'),
    confirmed: document.querySelector('#confirmed'),
    deaths: document.querySelector('#deaths'),
    recovered: document.querySelector('#recovered'),
    updated: document.querySelector('#updated'),
    locationButton: document.querySelector('#locationButton'),
    refreshButton: document.querySelector('#refreshButton'),
    lastDataRequest: document.querySelector('#lastDataRequest'),
    locationError: document.querySelector('#locationError'),
    casesError: document.querySelector('#casesError'),
    active: document.querySelector('#active'),
  };

  function getData() {
    const cacheDiff = Date.now() - localStorage.cacheTime;
    elements.lastDataRequest.textContent = new Date(+localStorage.cacheTime).toLocaleString();
    if (localStorage.cacheTime && cacheDiff < maxDiffMs && localStorage.cacheData) return Promise.resolve(JSON.parse(localStorage.cacheData));
    return fetch(arcgisurl)
      .then((response) => response.json())
      .then((json) => {
        localStorage.cacheData = JSON.stringify(json.features);
        localStorage.cacheTime = Date.now();
        elements.lastDataRequest.textContent = new Date(+localStorage.cacheTime).toLocaleString();
        return json.features;
      }).catch(() => []);
  }
}

module.exports = arcgis;
