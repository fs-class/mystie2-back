// functions/server.js

const express = require('express');
const serverless = require('serverless-http');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Netlify Serverless Function!');
});

module.exports.handler = serverless(app);
