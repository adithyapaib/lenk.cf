const connectToDatabase = require('./_lib/db');
const ShortUrl = require('../models/model');
const { cacheGet, cacheSet } = require('./_lib/cache');
require('dotenv').config();

const REDIRECT_TTL = 60 * 60 * 24 * 30; // 30 days

module.exports = async (req, res) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');

  try {
    // Extract shortId from URL path (e.g., /abc)
    const shortId = req.url.split('/').pop();
    if (!shortId || shortId === 'favicon.ico') {
      return res.status(404).end();
    }

    // Check Redis cache first
    const cached = await cacheGet(`shortid:${shortId}`);
    if (cached) {
      console.log(`[redirect] Cache HIT: ${shortId}`);
      return res.redirect(301, cached);
    }

    await connectToDatabase();
    const result = await ShortUrl.findOne({ shortId }).exec();
    if (!result) {
      return res.redirect('/404');
    }

    let targetUrl = result.url;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    // Cache for 30 days
    await cacheSet(`shortid:${shortId}`, targetUrl, REDIRECT_TTL);
    console.log(`[redirect] Cache MISS: ${shortId} — cached for ${REDIRECT_TTL}s`);

    return res.redirect(301, targetUrl);
  } catch (err) {
    console.error('redirect.js error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
