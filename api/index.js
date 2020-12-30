process.env.TZ = 'America/New_York';

const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const datetime = require('node-datetime');

const dttoday = datetime.create();
const dtyester = datetime.create();
dtyester.offsetInDays(-1);
const yesterday = dtyester.format('Y-m-d');
const today = dttoday.format('Y-m-d');
const curtime = dttoday.format('H:M');

const dotenv = require('dotenv').config();

const app = express();

const fetch = require('node-fetch');

const myHeaders = require('./inc/headers');
const middlewares = require('./inc/middlewares');

const traffic = require('./endpoints/traffic');
const arcgis = require('./endpoints/arcgis');
const global = require('./endpoints/global');
const nys = require('./endpoints/nys');
const wnyt = require('./endpoints/wnyt');

app.use(morgan('common'));
app.use(helmet());
app.use(cors());

app.get('/', cors(), (req, res) => {
  try {
    res.sendFile(path.join(`${__dirname}/default.html`));
  } catch (error) {
    res.send('An error has occurred');
  }
});

app.get('/api', cors(), (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    res.send(
      JSON.stringify({
        Greetings: ' 🥞 🐛 💜 Welcome to my API Server 💜 🐛 🥞 ',
        Version: process.env.VERSION,
        TimeZone: process.env.TZ,
        Yesterday: yesterday,
        Today: today,
        Time: curtime,
      }),
    );
  } catch (error) {
    res.send('An error has occurred');
  }
});

app.get('/api/v1', cors(), async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    res.send(
      JSON.stringify({
        endpoints: 'version, arcgis, global, usa',
        usa: 'nys',
        closings: 'closings',
      }),
    );
  } catch (error) {
    res.send('An error has occurred');
  }
});

app.get('/api/v1/version', cors(), async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    res.send(
      JSON.stringify({
        Greetings: ' 🥞 🐛 💜 Welcome to my API Server 💜 🐛 🥞 ',
        Version: process.env.VERSION,
        TimeZone: process.env.TZ,
        Yesterday: yesterday,
        Today: today,
        Time: curtime,
      }),
    );
  } catch (error) {
    res.send('An error has occurred');
  }
});

app.get('/api/v1/arcgis', cors(), async (req, res) => {
  const arcgis = await global();
  res.setHeader('Content-Type', 'application/json');
  try {
    res.send(
      JSON.stringify({
        arcgis,
      }),
    );
  } catch (error) {
    res.send('An error has occurred');
  }
});

app.get('/api/v1/global', cors(), async (req, res) => {
  const globalapi = await global();
  res.setHeader('Content-Type', 'application/json');
  try {
    res.send(
      JSON.stringify({
        global: globalapi,
      }),
    );
  } catch (error) {
    res.send('An error has occurred');
  }
});

const nysurl = `https://health.data.ny.gov/resource/xdss-u53e.json?test_date=${yesterday}T00:00:00.000`;
app.get('/api/v1/usa', cors(), async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    res.send(
      JSON.stringify({
        states: [`nys: ${nysurl}`],
      }),
    );
  } catch (error) {
    res.send('An error has occurred');
  }
});

app.get('/api/v1/usa/nys', cors(), async (req, res) => {
  try {
    const usanys = await nys();
    res.setHeader('Content-Type', 'application/json');
    res.shift;
    res.send(
      JSON.stringify({
        nys: usanys,
      }),
    );
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/api/v1/closings', cors(), async (req, res) => {
  const wnytClosed = await wnyt();
  try {
    res.setHeader('Content-Type', 'application/json');
    res.send(
      JSON.stringify({
        Closed: wnytClosed,
      }),
    );
  } catch (err) {
    res.send('An error has occurred');
  }
});

app.get('/api/v1/traffic', cors(), async (req, res) => {
  const trafficAlert = await traffic();
  try {
    res.setHeader('Content-Type', 'application/json');
    res.send(
      JSON.stringify({
        traffic: trafficAlert,
      }),
    );
  } catch (err) {
    res.send('An error has occurred');
  }
});

app.get('/api/v1/blogs/jason', cors(), async (req, res) => {
  const response = await fetch(
    'https://api.github.com/repos/malaks-us/jason/contents/_posts', {
      headers: {
        myHeaders,
      },
    },
  );
  try {
    const json = await response.json();
    res.setHeader('Content-Type', 'application/json');
    res.send(json);
  } catch (err) {
    res.send('An error has occurred');
  }
});

app.get('/api/v1/git', cors(), async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    res.send(
      JSON.stringify({
        jason: '/api/v1/git/jason',
      }),
    );
  } catch (error) {
    res.send('An error has occurred');
  }
});

app.get('/api/v1/git/jason', cors(), async (req, res) => {
  const response = await fetch('https://api.github.com/users/casjay', {
    headers: {
      myHeaders,
    },
  });
  try {
    const json = await response.json();
    res.setHeader('Content-Type', 'application/json');
    res.send(json);
  } catch (error) {
    res.send('An error has occurred');
  }
});

app.get('/api/v1/git/user/:id', cors(), async (req, res) => {
  const response = await fetch(`https://api.github.com/users/${req.params.id}`, {
    headers: {
      myHeaders,
    },
  });
  try {
    const json = await response.json();
    res.setHeader('Content-Type', 'application/json');
    res.send(json);
  } catch (error) {
    res.send('An error has occurred');
  }
});

app.get('/api/v1/git/org/:id', cors(), async (req, res) => {
  const response = await fetch(`https://api.github.com/orgs/${req.params.id}`, {
    headers: {
      myHeaders,
    },
  });
  try {
    const json = await response.json();
    res.setHeader('Content-Type', 'application/json');
    res.send(json);
  } catch (error) {
    res.send('An error has occurred');
  }
});

app.get('/api/v1/reddit/:id', cors(), async (req, res) => {
  const response = await fetch(`https://www.reddit.com/r/${req.params.id}/.json?sort=new&limit=500`);
  res.setHeader('Content-Type', 'application/json');
  try {
    const json = await response.json();
    this.json = json.data.children;
    this.json.shift;
    this.json.shift;
    this.json.shift;
    res.send(
      JSON.stringify({
        reddit: this.json,
      }),
    );
  } catch (error) {
    res.send('An error has occurred');
  }
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 2000;
const hostname = process.env.HOSTNAME;

app.listen(port, () => console.log(`${hostname}:${port}`));
