const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'routes');
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));

files.forEach(file => {
  const full = path.join(routesDir, file);
  try {
    console.log('Requiring', full);
    require(full);
    console.log('OK', file);
  } catch (err) {
    console.error('ERROR requiring', file, err && err.stack ? err.stack : err);
  }
});
