const app = require('../backend/server.js');
const connectDB = require('../backend/config/db.js');

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
