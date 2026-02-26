const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

const API_KEY = "pokeprice_free_2aeea2582995971bab40fead2d3fc6645d131c9d2a9b0ecc";

app.get("/price", async (req, res) => {
  try {
    const name = req.query.name;

    const response = await fetch(
      `https://www.pokemonpricetracker.com/api/v1/price?name=${encodeURIComponent(name)}`,
      {
        headers: { "x-api-key": API_KEY }
      }
    );

    const data = await response.json();

    const rate = 0.79;

    res.json({
      raw: data?.prices?.raw ? (data.prices.raw * rate).toFixed(2) : null,
      psa9: data?.prices?.psa9 ? (data.prices.psa9 * rate).toFixed(2) : null,
      psa10: data?.prices?.psa10 ? (data.prices.psa10 * rate).toFixed(2) : null
    });

  } catch (err) {
    res.json({ error: "failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
