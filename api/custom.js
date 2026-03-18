const connectToDatabase = require('./_lib/db');
const ShortUrl = require('../models/model');
const { cacheSet } = require('./_lib/cache');
require('dotenv').config();

const URL_TTL      = 60 * 60 * 24 * 7;  // 7 days
const REDIRECT_TTL = 60 * 60 * 24 * 30; // 30 days

module.exports = async (req, res) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    await connectToDatabase();

    const { url, shortId: customId } = req.body || {};
    if (!url || !customId) {
      return res.status(400).json({ error: 'Missing url or shortId in request body' });
    }

    // Validate alias characters
    if (!/^[a-zA-Z0-9\-_]+$/.test(customId)) {
      return res.status(400).json({ error: 'shortId must be alphanumeric with hyphens/underscores only' });
    }

    // Validate target URL
    try {
      new URL(url);
    } catch (_) {
      return res.status(400).json({ error: 'Invalid Target URL' });
    }

    const exists = await ShortUrl.findOne({ shortId: customId }).exec();
    if (exists) {
      return res.json(0); // conflict indicator
    }

    const shortUrl = new ShortUrl({ url, shortId: customId });
    const saved = await shortUrl.save();

    // Cache both directions
    await cacheSet(`url:${url}`, saved.shortId, URL_TTL);
    await cacheSet(`shortid:${saved.shortId}`, url, REDIRECT_TTL);
    console.log(`[custom.js] Saved & cached: ${saved.shortId}`);

    return res.json(saved.shortId);
  } catch (err) {
    console.error('custom.js error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
