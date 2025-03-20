const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const config = require('./config');
const app = express();
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

// Configurar winston para guardar logs en archivos separados por día
const logDirectory = './logs';
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new DailyRotateFile({
            filename: `${logDirectory}/%DATE%-results.log`,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Sobrescribir los métodos de console para usar winston
console.log = (...args) => logger.info(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));
console.error = (...args) => logger.error(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));
console.warn = (...args) => logger.warn(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));
console.info = (...args) => logger.info(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));
console.debug = (...args) => logger.debug(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));

// Middleware para registrar todas las solicitudes
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// configurar cors
app.use('/read/topic', cors({
  origin: '*', // Permitir todas las solicitudes
  methods: ['GET'],
  allowedHeaders: ['Origin', 'Content-Type', 'Accept']
}));

app.use(cors({
  origin: [
    'https://34.176.220.92', 
    'https://localhost:4200',
    'https://portaltesista.me',
    'https://portaltesista.ovniscorp.tech',
    'https://181.163.68.173:4200',
    'http://192.168.1.86:4200',
    'http://localhost:4200',
    'http://181.163.68.173:4200',
    'https://181.163.68.173',
    'http://192.168.1.86',
    'http://localhost',
    'http://181.163.68.173',
  ],
  //origin: ['*'],
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