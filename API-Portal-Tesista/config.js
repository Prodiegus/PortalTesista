// config.js
require('dotenv').config();

const config = {
  dev: {
    sslKeyPath: './certs/selfsigned.key',
    sslCertPath: './certs/selfsigned.crt',
    port: 3000,
    host: 'localhost'
  },
  prod: {
    sslKeyPath: process.env.SSL_KEY_PATH,
    sslCertPath: process.env.SSL_CERT_PATH,
    port: process.env.PORT || 3000,
    host: process.env.HOST || '129.212.132.100'
  }
};

const env = process.env.NODE_ENV || 'dev';
module.exports = config[env];