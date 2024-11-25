// server.js
const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

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
app.use('/api', routes);

// Leer los certificados SSL
const options = {
  key: fs.readFileSync('/etc/ssl/certs/selfsigned.key'),
  cert: fs.readFileSync('/etc/ssl/certs/selfsigned.crt')
};

// Iniciar el servidor HTTPS
https.createServer(options, app).listen(port, () => {
  console.log(`Servidor escuchando en https://localhost:${port}`);
});