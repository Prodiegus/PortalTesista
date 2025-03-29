const {runParametrizedQuery, runQuery, beginTransaction, rollbackTransaction, commitTransaction} = require('../utils/query');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

async function getSchools(req, res) {
    try {
        const query = `SELECT nombre FROM escuela`;
        const result = await runQuery(query);
        res.status(200).send(result);
    } catch (error) {
        console.error('Error al consultar escuelas:', error);
        res.status(500).send('Error al consultar escuelas');
    }
}

module.exports = {
    getSchools
};