const connectToDatabase = require('./_lib/db');
require('dotenv').config();

module.exports = async (req, res) => {
  let connect = 'offline';
  try {
    await connectToDatabase();
    connect = 'online';
  } catch (_) {}
  const response = {
    server: connect,
    end_points: [
      { "/": "index.html" },
      {
        "/p/<url>":
          "Creates a new shortID for the url sent or returns a new shortID.",
      },
      {"POST /custom": "body: { url, shortId }. Creates a custom short link."},
      {"GET /custom/<url>%3A%3A%3A69<custom_shortID>": "Legacy custom-link endpoint. Creates a custom short link."},
      {"example for custom ID": "POST /custom  body: { url: 'https://google.com', shortId: 'google' }"},
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
  res.json(response);
};
