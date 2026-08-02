require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Request logging
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'workwave-amplify-backend', timestamp: new Date().toISOString() });
});

// Chat route
const chatRouter = require('./routes/chat');
app.use('/api/chat', chatRouter);

// Poll route
const pollRouter = require('./routes/poll');
app.use('/api/poll', pollRouter);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`WorkWave Amplify backend running on port ${PORT}`);
});