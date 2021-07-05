import mongoose from "mongoose";
require("dotenv").config();
import ShortUrl from "../models/model";
function makeid(r) {
  for (
    var a = [],
      n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
      o = n.length,
      t = 0;
    t < r;
    t++
  )
    a.push(n.charAt(Math.floor(Math.random() * o)));
  return a.join("");
}
export default async (req, res) => {
  await mongoose.connect(process.env.DB, {
    dbName: "lenk-cf",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  var finalURL = decodeURIComponent(await req.url.substr(3));
  let r =
    /^(?:(?:https?|http|www):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (r.test(finalURL)) {
    let urlExists = await ShortUrl.findOne({ url: finalURL });
    if (urlExists) await res.json(urlExists.shortId);
    else {
      let shortId = makeid(3);
      let idExists = await ShortUrl.findOne({ shortId: shortId });
      if (idExists) shortId = makeid(4);
      let shortUrl = await new ShortUrl({ url: finalURL, shortId: shortId });
      let result = await shortUrl.save();
      await res.json(result.shortId);
    }
  }
  else
  {
    res.json("Invalid URL")
  }
};
