const { getRedisClient } = require('./rate-limit');

async function cacheGet(key) {
  try {
    const c = getRedisClient();
    return await c.getAsync(key);
  } catch (err) {
    console.error('[cache] GET error:', err);
    return null;
  }
}

async function cacheSet(key, value, ttlSeconds) {
  try {
    const c = getRedisClient();
    // redis v3: set(key, value, 'EX', ttl)
    await c.setAsync(key, value, 'EX', ttlSeconds);
  } catch (err) {
    console.error('[cache] SET error:', err);
  }
}

async function cacheDel(key) {
  try {
    const c = getRedisClient();
    await c.delAsync(key);
  } catch (err) {
    console.error('[cache] DEL error:', err);
  }
}

module.exports = { cacheGet, cacheSet, cacheDel };
