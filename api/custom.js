import mongoose from "mongoose";
require("dotenv").config();
import ShortUrl from "../models/model";
export default async (req, res) => {
  await mongoose.connect(process.env.DB, {
    dbName: "lenk-cf",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  let encoded = await req.url.substr(3);
  let URL = decodeURI(encoded);
  var FinalURL;
  var ht;
  if (URL.indexOf("https") == 0) ht = "https://";
  else ht = "http://";
  URL = URL.split(":/").pop();
  if (URL[0] == "/") URL = URL.substr(1);
  FinalURL = ht + URL;
  let splitedID;
  splitedID = URL.split("%3A%3A%3A69").pop();
  console.log(splitedID);
  splitedID = splitedID.split("&").shift();
  console.log(splitedID);
  // A slug %3A%3A%3A69 is added in ordered to split the url from the custom short ID
  FinalURL = FinalURL.split("%3A%3A%3A69").shift();
  let urlExists = await ShortUrl.findOne({ shortId: splitedID }).exec(); //Check if custom shortID already exists in Database
  if (await urlExists) {
    //If the custom ID is NOT unique which means there already EXISTS a shortId with the sent SHORTID
    await res.json(false); //The shortID and url has confilicts and cant be stored to Database
  } else {
    //If the custom ID is unique then the shortID is registered with urm and true is returned
    let shortUrl = await new ShortUrl({ url: FinalURL, shortId: splitedID });
    let result = await shortUrl.save();
    await res.json(true); //The shortID and url is successfully stored into database
  }
};
