import  mongoose  from "mongoose"
require('dotenv').config()
import ShortUrl from "../models/model";
function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
  charactersLength)));
   }
   return result.join('');
  }
 
export default async(req, res)=> {
    await mongoose.connect(process.env.DB, {
        dbName: 'lenk-cf',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
   let encoded = await req.url.substr(3);
   let decoded = decodeURI(encoded);
   let URL = decoded;
   console.log("P.JS URL is"+ URL)
   var FinalURL ;
   var ht;
   if ( URL.indexOf("https") == 0 )
   ht= "https://"
   else
   ht="http://"
   URL = URL.split(":/").pop();
   if(URL[0]=='/')
    URL =URL.substr(1);
    FinalURL = ht+URL
    console.log("Final url is " + FinalURL);
   let urlExists = await ShortUrl.findOne({url : FinalURL});
   if(urlExists)
  await res.json(urlExists.shortId)
  else
  {
    let shortId = makeid(3);
    let idExists = await ShortUrl.findOne({shortId : shortId});
    if(idExists)
    shortId = makeid(4);
    let shortUrl = await new ShortUrl({ url: FinalURL, shortId: shortId })
    let result = await shortUrl.save()
   await res.json(result.shortId);
  }
  
   
  }