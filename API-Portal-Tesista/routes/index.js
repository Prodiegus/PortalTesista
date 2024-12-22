// routes/index.js
const express = require('express');
const create = require('./user/create');
const { read, readAll} = require('./user/read');
const { create_flow, read_flow, edit_flow } = require('./flow/manage_flow');
const { create_phase, read_phase, edit_phase } = require('./flow/manage_phase');
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

router.get('/read/work-flow/:type', async (req, res) => {
  await read_flow(req, res);
});

router.post('/edit/work-flow', async (req, res) => {
  await edit_flow(req, res);
});

router.post('/create/work-flow', async (req, res) => {
  await create_flow(req, res);
});

router.get('/read/phase/:type', async (req, res) => {
  await read_phase(req, res);
});

router.post('/edit/phase', async (req, res) => {
  await edit_phase(req, res);
});

router.post('/create/phase', async (req, res) => {
  await create_phase(req, res);
});



module.exports = router;