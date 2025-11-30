const modules = [
  './routes/auth',
  './routes/services',
  './api/chat/index.js',
  './routes/pets',
  './routes/medicines',
  './routes/vaccines',
  './routes/rating',
  './routes/appointments',
  './routes/user',
  './routes/animals',
];

modules.forEach(m => {
  try {
    console.log('Requiring', m);
    require(m);
    console.log('OK', m);
  } catch (err) {
    console.error('ERROR requiring', m, err && err.stack ? err.stack : err);
  }
});
