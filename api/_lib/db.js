const mongoose = require('mongoose');
require('dotenv').config();

let cachedConnection = null;

async function connectToDatabase() {
  // Re-use existing connection (Vercel serverless warm starts)
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  if (!process.env.DB) {
    throw new Error('DB environment variable not set. Add it to .env or Vercel project settings.');
  }

  // NOTE: useNewUrlParser / useUnifiedTopology were removed in mongoose 6+.
  // dbName can be embedded in the URI string instead.
  cachedConnection = await mongoose.connect(process.env.DB, {
    dbName: 'lenk-cf',
  });

  return cachedConnection;
}

module.exports = connectToDatabase;
