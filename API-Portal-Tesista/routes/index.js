// routes/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('API de Portal Tesista');
});

module.exports = router;