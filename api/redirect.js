import mongoose from "mongoose";
import ShortUrl from "../models/model";
require("dotenv").config();
export default async (req, res) => {
  await mongoose.connect(process.env.DB, {
    dbName: "lenk-cf",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  let send = await req.url.substr(1);
  var result;
  result = await ShortUrl.findOne({ shortId: send }).exec();

  if ((await result) == null) {
    await res.redirect("/404");
  } else {
    let url = await result.url;
    if (url.substr(0, 4) != "http"  ) {
      url = "https://" + url;
    }
    await res.redirect(url);
  }
};
