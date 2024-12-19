// routes/index.js
const express = require('express');
const create = require('./user/create');
const { read, readAll} = require('./user/read');

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

module.exports = router;