const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const cheerio = require("cheerio");

const app = express();
app.use(cors());

app.get("/price", async (req, res) => {
  try {
    const name = req.query.name;
    if (!name) return res.json({ error: "missing name" });

    // Convert card name to PriceCharting search URL
    const searchUrl = `https://www.pricecharting.com/search-products?type=pokemon&query=${encodeURIComponent(name)}`;

    const response = await fetch(searchUrl);
    const html = await response.text();

    const $ = cheerio.load(html);

    // Pick the first search result
    const row = $("table tbody tr").first();

    if (!row) return res.json({ error: "card not found" });

    const rawText = row.find("td:nth-child(3)").text().trim().replace("$","").replace(",","");
    const psa9Text = row.find("td:nth-child(4)").text().trim().replace("$","").replace(",","");
    const psa10Text = row.find("td:nth-child(5)").text().trim().replace("$","").replace(",","");

    // Convert USD → GBP roughly
    const rate = 0.79;

    res.json({
      raw: rawText ? (parseFloat(rawText)*rate).toFixed(2) : null,
      psa9: psa9Text ? (parseFloat(psa9Text)*rate).toFixed(2) : null,
      psa10: psa10Text ? (parseFloat(psa10Text)*rate).toFixed(2) : null
    });

  } catch (err) {
    console.error(err);
    res.json({ error: "failed", message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
