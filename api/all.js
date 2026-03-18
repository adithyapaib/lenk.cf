const connectToDatabase = require('./_lib/db');
const ShortUrl = require('../models/model');
const { cacheGet, cacheSet } = require('./_lib/cache');
require('dotenv').config();

const ALL_TTL = 30; // 30 seconds — list changes frequently

module.exports = async (req, res) => {
  console.log('[all.js] Request received:', req.method, req.url);
  try {
    const cached = await cacheGet('all');
    if (cached) {
      console.log('[all.js] Cache HIT');
      return res.json(JSON.parse(cached));
    }

    console.log('[all.js] Connecting to database...');
    await connectToDatabase();
    console.log('[all.js] Connected. Fetching all documents...');
    const all = await ShortUrl.find({});
    console.log(`[all.js] Found ${all.length} document(s).`);
    const result = [{ numberOfShortURLS: all.length }, ...all];

    await cacheSet('all', JSON.stringify(result), ALL_TTL);
    console.log(`[all.js] Cached for ${ALL_TTL}s. Sending response.`);
    res.json(result);
  } catch (err) {
    console.error('[all.js] Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
