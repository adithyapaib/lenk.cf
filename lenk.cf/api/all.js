import  mongoose  from "mongoose";
import ShortUrl from "../models/model";
import redis from "redis";
import util from 'util';
require('util.promisify').shim();
require('dotenv').config()
const client = redis.createClient({
    host: process.env.REDISHOST,
    port: "12891",
    password: process.env.REDISPASSWORD,
  });
  client.on("error", (err) => {
    console.log("Error " + err);
  });
export default async (req, res ) =>
{
    
  client.get = util.promisify(client.get);
  client.set = util.promisify(client.set);
  const isPresentInRedis = await client.get("redisdata");
  if (isPresentInRedis) {
    res.json(JSON.parse(isPresentInRedis));
    console.log("Redis Data");
    return;
  }
  console.log("No data in redis");
    await mongoose.connect(process.env.DB, {
        dbName: 'lenk-cf',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    const filter = {};
    const all = await ShortUrl.find(filter);
    all.unshift({numberOfShortURLS: all.length});
    res.json(all)
    let r = await client.set("redisdata", JSON.stringify(all), "EX", 360);
     
    
}
