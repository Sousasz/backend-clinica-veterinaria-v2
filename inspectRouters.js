const path = require('path');
const express = require('express');

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
    console.log('Inspecting', m);
    const router = require(m);
    if (!router || !router.stack) {
      console.log('  Not a router or no stack');
      return;
    }
    router.stack.forEach((layer, i) => {
      const route = layer.route;
      if (route) {
        const methods = Object.keys(route.methods).join(',');
        console.log(`  [${i}] path: ${route.path} methods: ${methods}`);
      } else if (layer.name === 'router') {
        console.log(`  [${i}] nested router - regexp: ${layer.regexp}`);
      } else {
        console.log(`  [${i}] layer name: ${layer.name} regexp: ${layer.regexp}`);
      }
    });
  } catch (err) {
    console.error('ERROR inspecting', m, err && err.stack ? err.stack : err);
  }
});
