const fetch = require('node-fetch');

fetch('http://localhost:3000/api/health')
  .then(res => res.json())
  .then(data => {
    if (data.status !== 'ok') throw new Error('Health check failed');
    console.log('✅ Health check passed');
  })
  .catch(err => { console.error(err); process.exit(1); }); 