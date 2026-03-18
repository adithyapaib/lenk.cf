const connectToDatabase = require('./_lib/db');
const ShortUrl = require('../models/model');
const { cacheGet, cacheSet } = require('./_lib/cache');
require('dotenv').config();

const URL_TTL      = 60 * 60 * 24 * 7;  // 7 days  (url → shortId)
const REDIRECT_TTL = 60 * 60 * 24 * 30; // 30 days (shortId → url)

function makeId(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = async (req, res) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  try {
    // Extract URL after /p/
    const parts = req.url.split('/p/');
    if (parts.length < 2) {
      return res.status(400).json({ error: 'No URL provided' });
    }
    let finalURL = decodeURIComponent(parts[1]);

    // Validate URL
    try {
      new URL(finalURL);
    } catch (_) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // Check cache for existing URL → shortId
    const cachedShortId = await cacheGet(`url:${finalURL}`);
    if (cachedShortId) {
      console.log(`[p.js] Cache HIT: ${finalURL}`);
      return res.json(cachedShortId);
    }

    await connectToDatabase();

    // Check if URL already exists in DB
    const existing = await ShortUrl.findOne({ url: finalURL });
    if (existing) {
      await cacheSet(`url:${finalURL}`, existing.shortId, URL_TTL);
      await cacheSet(`shortid:${existing.shortId}`, finalURL, REDIRECT_TTL);
      return res.json(existing.shortId);
    }

    // Generate unique shortId
    let shortId = makeId(3);
    let collision = await ShortUrl.findOne({ shortId });
    if (collision) {
      shortId = makeId(5);
    }

    const shortUrl = new ShortUrl({ url: finalURL, shortId });
    const saved = await shortUrl.save();

    // Populate both cache directions
    await cacheSet(`url:${saved.url}`, saved.shortId, URL_TTL);
    await cacheSet(`shortid:${saved.shortId}`, saved.url, REDIRECT_TTL);
    console.log(`[p.js] Saved & cached: ${saved.shortId}`);

    return res.json(saved.shortId);
  } catch (err) {
    console.error('p.js error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
