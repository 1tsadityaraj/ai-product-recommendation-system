// Advanced AI helper functions for natural language processing

// Synonym mapping for better intent detection
export const categorySynonyms = {
  gaming: ["gaming", "game", "gamer", "gpu", "graphics", "rgb", "esports", "streaming"],
  coding: ["coding", "code", "developer", "development", "programming", "programmer", "software", "tech", "technical", "workstation"],
  student: ["student", "study", "college", "school", "university", "education", "learning", "academic", "campus"],
  office: ["office", "work", "business", "corporate", "professional", "enterprise", "workplace", "meetings"]
};

// Feature keywords mapping
export const featureKeywords = {
  performance: {
    high: ["high performance", "powerful", "fast", "speed", "quick", "strong", "performance", "powerhouse"],
    very_high: ["very high", "extreme", "top", "best performance", "maximum"],
    medium: ["medium", "moderate", "average"],
    low: ["basic", "low"]
  },
  battery: {
    excellent: ["long battery", "battery life", "all day", "long lasting", "endurance"],
    good: ["good battery", "decent battery"],
    medium: ["average battery", "medium battery"]
  },
  weight: {
    very_light: ["lightweight", "light weight", "thin", "slim", "portable", "compact", "ultrabook"],
    light: ["light", "portable", "easy to carry"],
    heavy: ["heavy", "powerful", "workstation"]
  },
  display: {
    high: ["good display", "high resolution", "hd", "full hd", "clear screen"],
    very_high: ["4k", "uhd", "retina", "premium display"],
    medium: ["decent display", "ok screen"]
  },
  budget: {
    affordable: ["budget", "cheap", "affordable", "economical", "low price", "inexpensive"],
    expensive: ["premium", "expensive", "high end", "top end"]
  }
};

// Extract budget from query
export function extractBudget(query) {
  // Match patterns like "under 50000", "below 50k", "upto ₹60,000", "50000-60000", "around 50000"
  const patterns = [
    /(?:under|below|upto|up to|maximum|max|less than|at most)\s*[₹]?\s*(\d{1,2}(?:,\d{3})*(?:k|K)?)/i,
    /[₹]?\s*(\d{1,2}(?:,\d{3})*(?:k|K)?)\s*(?:and below|or less|maximum|max)/i,
    /(\d{1,2}(?:,\d{3})*)\s*-\s*(\d{1,2}(?:,\d{3})*)/, // Range
    /around\s*[₹]?\s*(\d{1,2}(?:,\d{3})*(?:k|K)?)/i,
    /[₹]?\s*(\d{1,2}(?:,\d{3})*(?:k|K)?)/ // Any number
  ];

  for (const pattern of patterns) {
    const match = query.match(pattern);
    if (match) {
      if (match[2]) {
        // Range detected
        const min = parseNumber(match[1]);
        const max = parseNumber(match[2]);
        return { min, max, type: "range" };
      } else {
        const amount = parseNumber(match[1]);
        return { min: 0, max: amount, type: "max" };
      }
    }
  }
  return null;
}

// Parse number with k/K suffix and commas
function parseNumber(str) {
  const cleaned = str.replace(/,/g, '').replace(/[₹]/g, '');
  const num = parseInt(cleaned, 10);
  if (cleaned.toLowerCase().endsWith('k')) {
    return num * 1000;
  }
  return num;
}

// Detect category from query using synonyms
export function detectCategory(query) {
  const lowerQuery = query.toLowerCase();
  const categoryScores = {};

  for (const [category, synonyms] of Object.entries(categorySynonyms)) {
    let score = 0;
    for (const synonym of synonyms) {
      if (lowerQuery.includes(synonym)) {
        score += 1;
        // Exact match gets higher score
        const regex = new RegExp(`\\b${synonym}\\b`, 'i');
        if (regex.test(lowerQuery)) {
          score += 2;
        }
      }
    }
    if (score > 0) {
      categoryScores[category] = score;
    }
  }

  // Return category with highest score
  const sorted = Object.entries(categoryScores).sort((a, b) => b[1] - a[1]);
  return sorted.length > 0 ? sorted[0][0] : null;
}

// Extract features from query
export function extractFeatures(query) {
  const lowerQuery = query.toLowerCase();
  const features = {};

  // Check each feature category
  for (const [featureType, levels] of Object.entries(featureKeywords)) {
    if (featureType === "budget") continue; // Budget is handled separately

    for (const [level, keywords] of Object.entries(levels)) {
      for (const keyword of keywords) {
        if (lowerQuery.includes(keyword)) {
          features[featureType] = level;
          break;
        }
      }
      if (features[featureType]) break;
    }
  }

  return features;
}

// Calculate relevance score for a product
export function calculateRelevanceScore(product, query, detectedCategory, budget, extractedFeatures) {
  let score = 0;
  const lowerQuery = query.toLowerCase();

  // Base rating score (0-5)
  score += product.rating * 2;

  // Category match (0-10 points)
  if (detectedCategory && product.category === detectedCategory) {
    score += 10;
  }

  // Tag matching (0-5 points)
  let tagMatches = 0;
  product.tags.forEach(tag => {
    if (lowerQuery.includes(tag.toLowerCase())) {
      tagMatches += 1;
    }
  });
  score += tagMatches * 1.5;

  // Name matching (0-8 points)
  const nameWords = product.name.toLowerCase().split(' ');
  nameWords.forEach(word => {
    if (lowerQuery.includes(word)) {
      score += 4;
    }
  });

  // Budget scoring (0-10 points)
  if (budget) {
    if (budget.type === "range") {
      if (product.price >= budget.min && product.price <= budget.max) {
        score += 10; // Perfect match
      } else if (product.price < budget.max) {
        score += 5; // Within upper limit
      }
    } else {
      const priceRatio = product.price / budget.max;
      if (priceRatio <= 0.8) {
        score += 10; // Well within budget
      } else if (priceRatio <= 1.0) {
        score += 8; // Within budget
      } else if (priceRatio <= 1.2) {
        score += 3; // Slightly over
      }
    }
  }

  // Feature matching (0-15 points)
  if (product.features) {
    let featureScore = 0;
    for (const [featureType, requestedLevel] of Object.entries(extractedFeatures)) {
      if (product.features[featureType] === requestedLevel) {
        featureScore += 5;
      } else {
        // Partial match scoring
        const featureHierarchy = {
          performance: ["low", "medium", "high", "very_high"],
          battery: ["medium", "good", "excellent"],
          weight: ["heavy", "medium", "light", "very_light"],
          display: ["medium", "high", "very_high"]
        };
        
        const hierarchy = featureHierarchy[featureType];
        if (hierarchy) {
          const requestedIdx = hierarchy.indexOf(requestedLevel);
          const productIdx = hierarchy.indexOf(product.features[featureType]);
          if (requestedIdx >= 0 && productIdx >= 0) {
            const diff = Math.abs(requestedIdx - productIdx);
            featureScore += Math.max(0, 5 - diff * 2);
          }
        }
      }
    }
    score += featureScore;
  }

  return score;
}

// Generate explanation for recommendation
export function generateExplanation(product, query, detectedCategory, budget) {
  const reasons = [];

  if (detectedCategory && product.category === detectedCategory) {
    reasons.push(`Perfect for ${detectedCategory} needs`);
  }

  if (budget && product.price <= budget.max) {
    if (budget.type === "range") {
      reasons.push(`Within your budget range (₹${budget.min.toLocaleString()} - ₹${budget.max.toLocaleString()})`);
    } else {
      reasons.push(`Within your budget of ₹${budget.max.toLocaleString()}`);
    }
  }

  if (product.rating >= 4.5) {
    reasons.push("Highly rated by users");
  }

  if (product.features?.battery === "excellent") {
    reasons.push("Excellent battery life");
  }

  if (product.features?.weight === "very_light" || product.features?.weight === "light") {
    reasons.push("Lightweight and portable");
  }

  if (product.features?.performance === "high" || product.features?.performance === "very_high") {
    reasons.push("High performance");
  }

  return reasons.length > 0 ? reasons.join(". ") + "." : "A great match based on your preferences.";
}
