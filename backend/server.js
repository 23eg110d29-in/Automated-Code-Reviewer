const path = require('path');
const dotenv = require('dotenv');

const envPaths = [
  path.resolve(__dirname, '.env'),
  path.resolve(__dirname, '..', '.env'),
];
for (const envPath of envPaths) {
  const result = dotenv.config({ path: envPath });
  if (!result.error) break;
}

if (process.env.LANGCHAIN_API_KEY && !process.env.LANGSMITH_API_KEY) {
  process.env.LANGSMITH_API_KEY = process.env.LANGCHAIN_API_KEY;
}
if (process.env.LANGCHAIN_TRACING_V2 && !process.env.LANGSMITH_TRACING) {
  process.env.LANGSMITH_TRACING = process.env.LANGCHAIN_TRACING_V2;
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { disconnectDB } = require('./config/db');
const { startServer, shutdownServer } = require('./config/startServer');

const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json({ limit: '5mb' }));

const isLocalDevOrigin = (origin) =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || '');

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      const clientUrl = process.env.CLIENT_URL;
      if (!clientUrl || clientUrl === '*') return callback(null, true);
      if (origin === clientUrl || isLocalDevOrigin(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.get('/', (req, res) => res.send({ status: 'ok', port: process.env.ACTUAL_PORT || process.env.PORT }));
app.use(errorHandler);

let isShuttingDown = false;

const gracefulShutdown = async (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  try {
    await shutdownServer(signal);
    await disconnectDB();
  } catch (err) {
    console.error('Shutdown error:', err);
  } finally {
    if (signal === 'SIGUSR2') {
      process.kill(process.pid, 'SIGUSR2');
      return;
    }
    process.exit(0);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.once('SIGUSR2', () => gracefulShutdown('SIGUSR2'));

const boot = async () => {
  try {
    await connectDB();
    await startServer(app);
  } catch (err) {
    console.error('Failed to start backend:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  boot();
}

module.exports = app;
