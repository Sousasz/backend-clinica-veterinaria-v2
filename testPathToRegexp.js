const { parse } = require('path-to-regexp');
try {
  console.log('Parsing *');
  console.log(parse('*'));
} catch (err) {
  console.error('Error parsing *', err && err.stack ? err.stack : err);
}
try {
  console.log('Parsing /');
  console.log(parse('/'));
} catch (err) {
  console.error('Error parsing /', err && err.stack ? err.stack : err);
}
try {
  console.log('Parsing :id');
  console.log(parse('/:id'));
} catch (err) {
  console.error('Error parsing :id', err && err.stack ? err.stack : err);
}
