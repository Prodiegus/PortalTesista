// server.js
const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const config = require('./config'); // Importar configuración
const app = express();

// Configurar CORS
app.use(cors({
  //origin: ['https://34.176.220.92', 'https://localhost:4200'],
  origin: ['*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));

// Middleware para parsear JSON
app.use(express.json());

// Importar rutas
const routes = require('./routes');
app.use('/', routes);

// Leer los certificados SSL
const options = {
  key: fs.readFileSync(config.sslKeyPath),
  cert: fs.readFileSync(config.sslCertPath)
};

https.createServer(options, app).listen(config.port, config.host, () => {
  console.log(`Server is running on https://${config.host}:${config.port}`);
});