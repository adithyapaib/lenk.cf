const connectToDatabase = require('./_lib/db');
const ShortUrl = require('../models/model');
const { cacheSet } = require('./_lib/cache');
require('dotenv').config();

const URL_TTL      = 60 * 60 * 24 * 7;  // 7 days
const REDIRECT_TTL = 60 * 60 * 24 * 30; // 30 days

function parseLegacyGetPayload(reqUrl) {
  const parts = reqUrl.split('/custom/');
  if (parts.length < 2 || !parts[1]) {
    return null;
  }

  const rawPayload = parts[1];
  const encodedDelimiter = '%3A%3A%3A69';

  if (rawPayload.includes(encodedDelimiter)) {
    const [encodedUrl, customId] = rawPayload.split(encodedDelimiter);
    return {
      url: decodeURIComponent(encodedUrl),
      shortId: customId,
    };
  }

  const decodedPayload = decodeURIComponent(rawPayload);
  const legacyDelimiter = ':::69';
  const delimiterIndex = decodedPayload.indexOf(legacyDelimiter);
  if (delimiterIndex === -1) {
    return null;
  }

  return {
    url: decodedPayload.slice(0, delimiterIndex),
    shortId: decodedPayload.slice(delimiterIndex + legacyDelimiter.length),
  };
}

async function createCustomShortLink(url, customId) {
  await connectToDatabase();

  if (!url || !customId) {
    return {
      status: 400,
      payload: { error: 'Missing url or shortId' },
    };
  }

  if (!/^[a-zA-Z0-9\-_]+$/.test(customId)) {
    return {
      status: 400,
      payload: { error: 'shortId must be alphanumeric with hyphens/underscores only' },
    };
  }

  try {
    new URL(url);
  } catch (_) {
    return {
      status: 400,
      payload: { error: 'Invalid Target URL' },
    };
  }

  const exists = await ShortUrl.findOne({ shortId: customId }).exec();
  if (exists) {
    return {
      status: 200,
      payload: 0,
    };
  }

  const shortUrl = new ShortUrl({ url, shortId: customId });
  const saved = await shortUrl.save();

  await cacheSet(`url:${url}`, saved.shortId, URL_TTL);
  await cacheSet(`shortid:${saved.shortId}`, url, REDIRECT_TTL);
  console.log(`[custom.js] Saved & cached: ${saved.shortId}`);

  return {
    status: 200,
    payload: saved.shortId,
  };
}

module.exports = async (req, res) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  try {
    if (req.method === 'POST') {
      const { url, shortId } = req.body || {};
      const result = await createCustomShortLink(url, shortId);
      return res.status(result.status).json(result.payload);
    }

    if (req.method === 'GET') {
      const payload = parseLegacyGetPayload(req.url);
      if (!payload) {
        return res.status(400).json({
          error: 'Invalid legacy custom format. Use /custom/<url>%3A%3A%3A69<custom_shortID> or POST /custom',
        });
      }

      const result = await createCustomShortLink(payload.url, payload.shortId);
      return res.status(result.status).json(result.payload);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('custom.js error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
