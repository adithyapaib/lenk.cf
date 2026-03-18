const redis = require('redis');
const { promisify } = require('util');

let client = null;

function getRedisClient() {
  if (client) return client;
  client = redis.createClient(process.env.REDIS_URL || 'redis://127.0.0.1:6379');
  client.on('error', (err) => console.error('Redis Client Error', err));
  // Promisify the methods we need (redis v3 is callback-based)
  client.getAsync    = promisify(client.get).bind(client);
  client.setAsync    = promisify(client.set).bind(client);
  client.incrAsync   = promisify(client.incr).bind(client);
  client.expireAsync = promisify(client.expire).bind(client);
  client.delAsync    = promisify(client.del).bind(client);
  return client;
}

async function checkRateLimit(ip, limit = 100, windowSec = 3600) {
  const c = getRedisClient();
  const key = `rate:${ip}`;
  const count = await c.incrAsync(key);
  if (count === 1) {
    await c.expireAsync(key, windowSec);
  }
  return count <= limit;
}

module.exports = { getRedisClient, checkRateLimit };
