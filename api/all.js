import  mongoose  from "mongoose";
import ShortUrl from "../models/model";
require('dotenv').config()
export default async (req, res ) =>
{
    await mongoose.connect(process.env.DB, {
        dbName: 'lenk-cf',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    const filter = {};
    const all = await ShortUrl.find(filter);
    all.unshift({numberOfShortURLS: all.length})
     res.json(all)
    
}