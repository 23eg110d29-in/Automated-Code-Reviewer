const { logPortOwner, resolvePreferredPort, findAvailablePort } = require('./port');

let activeServer = null;

const closeActiveServer = () =>
  new Promise((resolve) => {
    if (!activeServer) return resolve();
    activeServer.close(() => {
      activeServer = null;
      resolve();
    });
  });

const startServer = async (app) => {
  await closeActiveServer();

  const preferredPort = resolvePreferredPort();
  let port = await findAvailablePort(preferredPort);

  return new Promise((resolve, reject) => {
    const tryListen = (candidatePort, attempt = 0) => {
      const server = app.listen(candidatePort);

      server.on('listening', () => {
        activeServer = server;
        process.env.ACTUAL_PORT = String(candidatePort);
        console.log(`Server running on port ${candidatePort}`);
        if (candidatePort !== preferredPort) {
          console.warn(
            `Preferred port ${preferredPort} was unavailable. Using ${candidatePort} instead.`
          );
        }
        resolve({ server, port: candidatePort });
      });

      server.on('error', (error) => {
        server.close();

        if (error.code === 'EADDRINUSE') {
          logPortOwner(candidatePort);
          const nextPort = candidatePort + 1;
          if (attempt >= 9) {
            return reject(
              new Error(`Could not bind a port starting from ${preferredPort}`)
            );
          }
          console.warn(`Port ${candidatePort} already in use, trying ${nextPort}...`);
          return tryListen(nextPort, attempt + 1);
        }

        return reject(error);
      });
    };

    tryListen(port);
  });
};

const shutdownServer = async (signal = 'shutdown') => {
  console.log(`${signal}: closing HTTP server...`);
  await closeActiveServer();
};

module.exports = {
  startServer,
  shutdownServer,
  closeActiveServer,
};
