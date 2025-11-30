const express = require('express');
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const chatRoutes = require('./api/chat/index.js');
const petRoutes = require('./routes/pets');
const medicineRoutes = require('./routes/medicines');
const vaccineRoutes = require('./routes/vaccines');
const ratingRoutes = require('./routes/rating');
const appointmentRoutes = require('./routes/appointments');
const userRoutes = require('./routes/user');
const animalRoutes = require('./routes/animals');

const app = express();

const mounts = [
  ['/api/chat', chatRoutes],
  ['/api/user', userRoutes],
  ['/api/auth', authRoutes],
  ['/api/services', serviceRoutes],
  ['/api/pets', petRoutes],
  ['/api/medicines', medicineRoutes],
  ['/api/vaccines', vaccineRoutes],
  ['/api/ratings', ratingRoutes],
  ['/api/appointments', appointmentRoutes],
  ['/api/animals', animalRoutes],
];

mounts.forEach(([path, router]) => {
  try {
    console.log('Mounting', path);
    app.use(path, router);
    console.log('Mounted', path);
  } catch (err) {
    console.error('Error mounting', path, err && err.stack ? err.stack : err);
  }
});

console.log('Done mounting test');
