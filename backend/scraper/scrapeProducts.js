import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const URL =
  "https://webscraper.io/test-sites/e-commerce/static/computers/laptops";

async function scrapeProducts() {
  const { data } = await axios.get(URL);
  const $ = cheerio.load(data);

  const products = [];

  $(".thumbnail").each((_, el) => {
    const name = $(el).find(".title").text().trim();
    const priceText = $(el).find(".price").text().replace("$", "");
    const price = Number(priceText) * 1000;

    products.push({
      name,
      price,
      rating: 4,
      category: "laptop",
      source: "web-scraped",
    });
  });

  fs.writeFileSync(
    "./data/scrapedProducts.json",
    JSON.stringify(products, null, 2)
  );

  console.log("✅ Products scraped & saved successfully");
}

scrapeProducts();
