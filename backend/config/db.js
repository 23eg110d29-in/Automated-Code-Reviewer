const mongoose = require('mongoose');

let memoryServer;

const getUri = () =>
  process.env.MONGO_URI ||
  process.env.MONGO_URL ||
  process.env.MONOGO_URL ||
  process.env.MONGODB_URI;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB already connected');
    return;
  }

  const atlasUri = getUri();
  const options = {
    dbName: process.env.MONGO_DB_NAME || 'automated-code-reviewer',
    serverSelectionTimeoutMS: 10000,
  };

  if (atlasUri && process.env.USE_MEMORY_DB !== 'true') {
    try {
      await mongoose.connect(atlasUri, options);
      console.log('MongoDB connected (Atlas)');
      return;
    } catch (err) {
      console.warn('Atlas MongoDB unavailable:', err.message);
      if (process.env.NODE_ENV === 'production') throw err;
    }
  }

  const { MongoMemoryServer } = require('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create();
  const memoryUri = memoryServer.getUri();
  await mongoose.connect(memoryUri, { dbName: options.dbName });
  console.log('MongoDB connected (in-memory dev database)');
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

module.exports = connectDB;
module.exports.disconnectDB = disconnectDB;
