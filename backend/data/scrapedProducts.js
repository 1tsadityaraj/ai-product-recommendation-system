import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "scrapedProducts.json");

const products = JSON.parse(fs.readFileSync(filePath, "utf-8"));

export default products;
