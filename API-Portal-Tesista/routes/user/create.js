const getToken = require('../utils/getToken');
const axios = require('axios');

async function create(req, res) {
    try {
        const token = await getToken();
        console.log('Token:', token);
        res.status(200).send('Token: ' + token);
    } catch (error) {
        console.error('Error fetching token:', error);
        res.status(500).send('Error fetching token');
    }
}

module.exports = create;