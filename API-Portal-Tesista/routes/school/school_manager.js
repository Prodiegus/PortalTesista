const {runParametrizedQuery, runQuery, beginTransaction, rollbackTransaction, commitTransaction} = require('../utils/query');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

async function getSchools() {
    const query = 'SELECT nombre FROM escuela';
    return await runQuery(query);
}

module.exports = {
    getSchools
};