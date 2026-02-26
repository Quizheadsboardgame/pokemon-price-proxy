const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

const API_KEY = "pokeprice_free_2aeea2582995971bab40fead2d3fc6645d131c9d2a9b0ecc";

app.get("/price", async (req, res) => {
  try {
    const name = req.query.name;
    if (!name) {
      return res.json({ error: "missing name" });
    }

    const url =
      `https://www.pokemonpricetracker.com/api/v1/price?name=${encodeURIComponent(name)}`;

    console.log("Fetching:", url);

    const response = await fetch(url, {
      headers: { "x-api-key": API_KEY }
    });

    const text = await response.text();

    // 👇 log raw response (VERY IMPORTANT)
    console.log("API response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.json({ error: "invalid json from api", raw: text });
    }

    const rate = 0.79;

    res.json({
      raw: data?.prices?.raw ? (data.prices.raw * rate).toFixed(2) : null,
      psa9: data?.prices?.psa9 ? (data.prices.psa9 * rate).toFixed(2) : null,
      psa10: data?.prices?.psa10 ? (data.prices.psa10 * rate).toFixed(2) : null
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.json({ error: "failed", message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
