// routes/index.js
const express = require('express');
const create = require('./user/create');
const { read, readAll} = require('./user/read');
const disable = require('./user/disable');
const enable = require('./user/enable');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('API de Portal Tesista');
});

router.post('/create/user', async (req, res) => {
  await create(req, res); 
});

router.get('/read/user', async (req, res) => {
  await read(req, res); 
});

router.get('/read/allUser/:escuela', async (req, res) => {
  await readAll(req, res); 
});

router.post('/disable/user', async (req, res) => {
  await disable(req, res); 
});

router.post('/enable/user', async (req, res) => {
  await enable(req, res); 
});

module.exports = router;