import mongoose from "mongoose";
require("dotenv").config();
import ShortUrl from "../models/model";
function digits_count(n) { var count = 0; if (n >= 1) ++count; while (n / 10 >= 1) { n /= 10; ++count; } return count; }
export default async (req, res) => {
  await mongoose.connect(process.env.DB, {
    dbName: "lenk-cf",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  let longURL = decodeURIComponent(await req.url.substr(8));
  let customIdLength = parseInt(longURL.split("_", 3)[0]);
  console.log(customIdLength);
  let digiLen = digits_count(customIdLength);
  let customId = longURL.substring(digiLen + 1, digiLen + 1 + customIdLength);
  let URL = longURL.substring(digiLen + 1 + customIdLength);
  console.log(URL);
  let urlExists = await ShortUrl.findOne({ shortId: customId }).exec();
  if (await urlExists) {
    await res.json(0);
  } else {
    let shortUrl = await new ShortUrl({ url: URL, shortId: customId });
    let result = await shortUrl.save();
    await res.json(customId);
  }
};
