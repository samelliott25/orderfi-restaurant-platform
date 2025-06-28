const express = require('express');
const app = express();

app.get('/test', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const server = app.listen(5001, '0.0.0.0', () => {
  console.log('Test server running on port 5001');
});

server.on('error', (err) => {
  console.error('Test server error:', err);
});