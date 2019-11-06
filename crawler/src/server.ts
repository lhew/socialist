import fetch from 'node-fetch';
const cheerio = require('cheerio');
const port = 3333;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const getItems = async url => {
  const response = await fetch(url);
  const body = await response.text();
  const $ = cheerio.load(body);
  return $("script[type='application/ld+json']").html();
};

app.post('/', async function(req, res) {
  const result = await getItems(req.body.url);
  res.send(result);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
