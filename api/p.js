import  mongoose  from "mongoose";
require('dotenv').config();
import ShortUrl from "../models/model";
function makeid(r){for(var a=[],n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",o=n.length,t=0;t<r;t++)a.push(n.charAt(Math.floor(Math.random()*o)));return a.join("")}
export default async(req, res)=> {
    await mongoose.connect(process.env.DB, {dbName: 'lenk-cf',useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true,})
   var finalURL = decodeURIComponent( await req.url.substr(3));
   let urlExists = await ShortUrl.findOne({url : finalURL});
   if(urlExists)
  await res.json(urlExists.shortId)
  else
  {
    let shortId = makeid(3);
    let idExists = await ShortUrl.findOne({shortId : shortId});
    if(idExists)
    shortId = makeid(4);
    let shortUrl = await new ShortUrl({ url: finalURL, shortId: shortId })
    let result = await shortUrl.save()
   await res.json(result.shortId);
  }
  }
