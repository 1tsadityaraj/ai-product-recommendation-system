import products from "../data/products.js";

export const getRecommendations = (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ message: "Query is required" });
  }

  const q = query.toLowerCase();

  // 1️⃣ Extract budget
  const budgetMatch = q.match(/\d+/);
  const budget = budgetMatch ? Number(budgetMatch[0]) : null;

  // 2️⃣ Detect intent category
  let intentCategory = null;
  const categories = ["gaming", "coding", "student", "office"];

  for (const cat of categories) {
    if (q.includes(cat)) {
      intentCategory = cat;
      break;
    }
  }

  // 3️⃣ Budget filter (hard filter)
  let filtered = budget
    ? products.filter(p => p.price <= budget)
    : [...products];

  // 4️⃣ Score products
  let scored = filtered.map(p => {
    let score = p.rating;

    if (intentCategory && p.category === intentCategory) {
      score += 5; // strong intent boost
    }

    p.tags.forEach(tag => {
      if (q.includes(tag)) score += 1;
    });

    return { ...p, score };
  });

  // 5️⃣ Sort by score
  scored.sort((a, b) => b.score - a.score);

  // 6️⃣ ENSURE DIVERSITY (key fix 🔥)
  const finalResults = [];
  const usedCategories = new Set();

  for (const product of scored) {
    if (!usedCategories.has(product.category)) {
      finalResults.push(product);
      usedCategories.add(product.category);
    }
    if (finalResults.length === 3) break;
  }

  // 7️⃣ Fallback (if <3 results)
  if (finalResults.length < 3) {
    for (const product of scored) {
      if (!finalResults.includes(product)) {
        finalResults.push(product);
      }
      if (finalResults.length === 3) break;
    }
  }

  res.json(finalResults);
};
