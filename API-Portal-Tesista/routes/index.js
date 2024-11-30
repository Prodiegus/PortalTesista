// routes/index.js
const express = require('express');
const create = require('./user/create');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('API de Portal Tesista');
});

router.post('/create', async (req, res) => {
  await create(req, res); 
});

module.exports = router;