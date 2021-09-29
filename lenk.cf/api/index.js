import mongoose from "mongoose";
require("dotenv").config();
export default async (req, res) => {
  let uri = process.env.DB;
  var connect = "offline";
  await mongoose
    .connect(uri, {
      dbName: "lenk-cf",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((connect = "online"));
  var response = {
    server: connect,
    end_points: [
      { "/": "index.html" },
      {
        "/p/<url>":
          "Creates a new shortID for the url sent or returns a new shortID.",
      },
      {"/custom/<url>%3A%3A%3A69<custom_shortID>": "Creates a custom route for the slug sent make sure the fetch request has %3A%3A%3A69 seperated by a custom ID"},
      {"example for custom ID": "/custom/https://google.com%3A%3A%3A69google"},
      {"/css": "styles.css"},
      {"/.*": "redirect.js this file checks if shortID is present in DB and redirects to the destination. Else redirects to /404"},
      {"/404": "error page if shortID dosent exists in database"},
      {"/api": "this page"},
      {"/all": "all.js dispalys all documents in database"},
    ],
    source: "https://github.com/adithyapaib/lenk.cf",
    fast_domains: ["https://4543.ml", "https://lenk.cf"],
    slow_domains: ["http://www.urml.ml", "http://nani.cf"],
    credits:{"Adithya Pai B ❤️" : "https://adithyapai.com"}
  };
  await res.json(response);
};
