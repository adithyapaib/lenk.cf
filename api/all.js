import  mongoose  from "mongoose";
import ShortUrl from "../models/model";
import util from 'util';
require('util.promisify').shim();
require('dotenv').config()

export default async (req, res ) =>
{
  console.log("No data in redis");
    await mongoose.connect(process.env.DB, {
        dbName: 'lenk-cf',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    let all = await ShortUrl.find({});
    all.unshift({numberOfShortURLS: all.length});
    res.json(all)
     
    
}
