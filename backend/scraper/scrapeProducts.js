import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const URL =
  "https://webscraper.io/test-sites/e-commerce/static/computers/laptops";

const USD_TO_INR = 83;

async function scrapeProducts() {
  try {
    const { data } = await axios.get(URL);
    const $ = cheerio.load(data);

    const products = [];

    $(".thumbnail").each((_, el) => {
      const name = $(el).find(".title").text().trim();
      const priceText = $(el)
        .find(".price")
        .text()
        .replace("$", "")
        .trim();

      if (!name || !priceText) return;

      const price = Math.round(Number(priceText) * USD_TO_INR);

      products.push({
        name,
        price,
        currency: "INR",
        rating: 4,
        category: "laptop",
        source: "web-scraped",
        scrapedAt: new Date().toISOString(),
      });
    });

    const dataDir = path.join(__dirname, "../data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    fs.writeFileSync(
      path.join(dataDir, "scrapedProducts.json"),
      JSON.stringify(products, null, 2)
    );

    console.log("✅ Products scraped & saved successfully");
  } catch (err) {
    console.error("❌ Scraping failed:", err.message);
  }
}

scrapeProducts();

