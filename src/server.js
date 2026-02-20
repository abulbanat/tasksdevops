const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (_req, res) => {
  const payload = {
    status: 'ok',
    service: 'otrabotka-app',
    timestamp: new Date().toISOString()
  };

  console.log(JSON.stringify({ level: 'info', message: 'Root endpoint hit', ...payload }));
  res.json(payload);
});

app.get('/health', (_req, res) => {
  res.status(200).send('healthy');
});

app.listen(port, () => {
  console.log(JSON.stringify({ level: 'info', message: `Server started on port ${port}` }));
});
