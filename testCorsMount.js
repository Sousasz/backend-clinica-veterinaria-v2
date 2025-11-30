const express = require('express');
const cors = require('cors');

const app = express();
const corsOptions = {
  origin: [
    'https://joyce-veterinaria.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
};

try {
  app.use(cors(corsOptions));
  console.log('app.use(cors) OK');
} catch (err) {
  console.error('app.use(cors) ERR', err.stack || err);
}

try {
  app.options('*/', cors(corsOptions));
  console.log('app.options(cors) OK');
} catch (err) {
  console.error('app.options(cors) ERR', err.stack || err);
}

console.log('done');
