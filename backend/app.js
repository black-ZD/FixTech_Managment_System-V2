const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

app.set('trust proxy', 1);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3002',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiLimiter);

// Routes
app.use('/api/requests', require('./routes/requests'));
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/products',  require('./routes/products'));
app.use('/api/sales',     require('./routes/sales'));
app.use('/api/expenses',  require('./routes/expenses'));
app.use('/api/staff',     require('./routes/staff'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/reports',   require('./routes/reports'));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', version: '2.0.0', ts: new Date() }));

// 404
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

module.exports = app;
