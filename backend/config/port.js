const net = require('net');
const { execSync } = require('child_process');

const DEFAULT_PORT = 5001;
const MAX_PORT_ATTEMPTS = Number(process.env.PORT_RETRY_LIMIT) || 10;

const isPortAvailable = (port) =>
  new Promise((resolve) => {
    const tester = net
      .createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        tester.close(() => resolve(true));
      })
      .listen(port, '0.0.0.0');
  });

const logPortOwner = (port) => {
  try {
    if (process.platform === 'win32') {
      const output = execSync(`netstat -ano | findstr :${port}`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      });
      if (output.trim()) {
        console.warn(`Port ${port} appears in use:\n${output.trim()}`);
        console.warn(`Kill on Windows: taskkill /PID <PID> /F`);
      }
      return;
    }
    const output = execSync(`lsof -i :${port}`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    if (output.trim()) {
      console.warn(`Port ${port} appears in use:\n${output.trim()}`);
      console.warn('Kill on Mac/Linux: kill -9 <PID>');
    }
  } catch {
    // Process lookup is best-effort only.
  }
};

const resolvePreferredPort = () => {
  const parsed = Number.parseInt(process.env.PORT, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_PORT;
};

const findAvailablePort = async (startPort) => {
  let port = startPort;
  for (let attempt = 0; attempt < MAX_PORT_ATTEMPTS; attempt += 1) {
    if (await isPortAvailable(port)) return port;
    logPortOwner(port);
    console.warn(`Port ${port} is busy, trying ${port + 1}...`);
    port += 1;
  }
  throw new Error(
    `No free port found between ${startPort} and ${startPort + MAX_PORT_ATTEMPTS - 1}`
  );
};

module.exports = {
  DEFAULT_PORT,
  MAX_PORT_ATTEMPTS,
  isPortAvailable,
  logPortOwner,
  resolvePreferredPort,
  findAvailablePort,
};
