// ----------------------------------------------------
// CropDoc Disease Database
// ----------------------------------------------------
// Stores disease information mapped by: crop + disease
// Each record contains symptoms, treatments, and prevention.
// ----------------------------------------------------

export interface DiseaseInfo {
  crop: string;
  disease: string;
  emoji: string;
  symptoms: string[];
  organicTreatment: string[];
  chemicalTreatment: string[];
  prevention: string[];
}

// Simple lookup database organized by crop + disease
export const DISEASE_DATABASE: Record<string, DiseaseInfo> = {
  // 1. Tomato - Early Blight
  "tomato:early blight": {
    crop: "Tomato",
    disease: "Early Blight",
    emoji: "🍅",
    symptoms: [
      "Small dark brown to black spots with concentric rings (target board pattern) on older leaves",
      "Yellowing of leaf tissue surrounding the dark lesions",
      "Lower leaves gradually dry up, turn brown, and drop prematurely",
      "Dark sunken lesions appearing on stems near soil level",
    ],
    organicTreatment: [
      "Prune and safely destroy lower infected leaves immediately (do not compost)",
      "Spray cold-pressed Neem oil (2 to 3 ml per litre of water) every 7-10 days",
      "Apply copper hydroxide or Bordeaux mixture as an organic foliar spray",
      "Spray fermented bio-fertilizer or compost tea to build leaf surface immunity",
    ],
    chemicalTreatment: [
      "Apply Mancozeb 75% WP fungicide @ 2g per litre of water",
      "Spray Chlorothalonil 75% WP if leaf spotting spreads rapidly",
      "Use Azoxystrobin 23% SC for systematic control in persistent infections",
    ],
    prevention: [
      "Maintain 45-60 cm spacing between plants for adequate ventilation",
      "Use drip irrigation or water at the base to keep foliage dry",
      "Rotate crops with non-solanaceous crops for at least 2 to 3 years",
      "Apply clean straw mulch around plants to prevent soil spores from splashing onto leaves",
    ],
  },

  // 2. Tomato - Late Blight
  "tomato:late blight": {
    crop: "Tomato",
    disease: "Late Blight",
    emoji: "🍅",
    symptoms: [
      "Large, irregular water-soaked spots on leaves that turn dark brown or purplish",
      "White fuzzy fungal growth visible on the undersides of leaves during humid weather",
      "Entire vines and foliage collapse rapidly in cool, wet conditions",
      "Brown greasy-looking firm rot patches developing on green and ripe fruits",
    ],
    organicTreatment: [
      "Remove and safely burn or bury heavily infected plants immediately",
      "Spray copper sulfate / Bordeaux mixture at first sign of humid rainy conditions",
      "Prune dense side branches to increase airflow and accelerate leaf drying",
    ],
    chemicalTreatment: [
      "Spray Metalaxyl 8% + Mancozeb 64% WP @ 2.5g per litre of water",
      "Apply Dimethomorph 50% WP during early stages of infection",
      "Use Cymoxanil 8% + Mancozeb 64% WP for fast systemic protection",
    ],
    prevention: [
      "Avoid planting tomatoes near potato fields (both share late blight pathogens)",
      "Select certified blight-resistant tomato varieties",
      "Ensure well-drained field beds and avoid overhead sprinkler watering",
      "Destroy volunteer tomato and potato plants before every planting season",
    ],
  },

  // 3. Potato - Late Blight
  "potato:late blight": {
    crop: "Potato",
    disease: "Late Blight",
    emoji: "🥔",
    symptoms: [
      "Water-soaked lesions appearing at leaf margins and tips",
      "Rapid browning and shriveling of foliage, accompanied by a distinctive rotting smell",
      "Delicate white mildew layer on leaf undersides in wet mornings",
      "Brownish-purple discoloration on potato tuber skin with internal rust-colored rot",
    ],
    organicTreatment: [
      "Cut and discard infected foliage (haulm cutting) 10-14 days before harvest",
      "Apply copper octanoate or copper oxychloride organic spray",
      "Ensure high soil ridges (earthing up) to protect underground tubers from spores",
    ],
    chemicalTreatment: [
      "Apply Cymoxanil + Mancozeb @ 2g per litre of water upon initial spotting",
      "Spray Propamocarb hydrochloride or Fenamidone for active leaf infections",
      "Rotate chemical modes of action to prevent fungal resistance",
    ],
    prevention: [
      "Plant only certified disease-free seed tubers",
      "Ensure proper ridge height to shield tubers from surface runoff spores",
      "Never leave infected tubers or cull piles near the cultivation area",
      "Store harvested potatoes in a dry, well-ventilated, cool space",
    ],
  },

  // 4. Chilli - Leaf Curl
  "chilli:leaf curl": {
    crop: "Chilli",
    disease: "Leaf Curl",
    emoji: "🌶️",
    symptoms: [
      "Upward curling, puckering, and wrinkling of young leaves",
      "Severe thickening of leaf veins with chlorosis (yellowing)",
      "Drastic stunting of plant growth with shortened internodes (bushy appearance)",
      "Poor flower set and deformed, small, non-viable chilli pods",
    ],
    organicTreatment: [
      "Install yellow sticky insect traps (15-20 traps per acre) to trap whitefly vectors",
      "Spray Neem Seed Kernel Extract (NSKE 5%) or 10,000 ppm Neem oil regularly",
      "Spray mild insecticidal soap solution to dislodge whiteflies and thrips",
      "Rogue out and destroy severely curled stunted plants early in the season",
    ],
    chemicalTreatment: [
      "Spray Imidacloprid 17.8% SL @ 0.5 ml per litre to control vector whiteflies",
      "Apply Diafenthiuron 50% WP @ 1g per litre for combined thrips/whitefly control",
      "Spray Acetamiprid 20% SP during early vegetative stage",
    ],
    prevention: [
      "Raise nursery seedlings under 40-mesh insect-proof nylon nets",
      "Plant barrier border crops like 2-3 rows of maize or sorghum around the chilli field",
      "Keep field borders clean and free of weeds (weeds act as alternate hosts for whiteflies)",
      "Avoid excess nitrogen fertilizer which attracts sap-sucking insects",
    ],
  },

  // 5. Rice - Blast Disease
  "rice:blast": {
    crop: "Rice",
    disease: "Blast Disease",
    emoji: "🌾",
    symptoms: [
      "Spindle-shaped or eye-shaped lesions with grey/white centers and brownish borders on leaves",
      "Neck rot causing panicles to fall over and turn completely white (chaffy grains)",
      "Lesions enlarge rapidly and coalesce, causing entire leaves to dry out",
    ],
    organicTreatment: [
      "Apply Pseudomonas fluorescens bio-fungicide @ 10g per litre as foliar spray",
      "Treat seeds with Trichoderma viride before sowing",
      "Maintain proper water level in the paddy field to reduce plant moisture stress",
    ],
    chemicalTreatment: [
      "Spray Tricyclazole 75% WP @ 0.6g per litre of water at first symptom",
      "Apply Isoprothiolane 40% EC @ 1.5 ml per litre",
      "Spray Azoxystrobin + Difenoconazole for broad-spectrum panicle blast protection",
    ],
    prevention: [
      "Avoid excessive doses of chemical nitrogen fertilizer",
      "Split nitrogen application into 3-4 balanced doses",
      "Use blast-resistant rice cultivars suitable for your agro-climatic zone",
    ],
  },

  // 6. Marigold - Alternaria Leaf Spot & Blight
  "marigold:alternaria leaf spot & blight": {
    crop: "Marigold",
    disease: "Alternaria Leaf Spot & Blight",
    emoji: "🌼",
    symptoms: [
      "Small circular brown to black spots with yellow margins on leaves",
      "Inflorescence blight causing whole flower blossoms to rot and wither",
      "Premature withering and dropping of lower foliage in dense plantings",
    ],
    organicTreatment: [
      "Prune and destroy infected flower heads and lower spotted leaves (deadheading)",
      "Spray cold-pressed Neem oil (3 ml per litre of water) every 7-10 days",
      "Spray Trichoderma harzianum or Pseudomonas fluorescens bio-fungicide",
    ],
    chemicalTreatment: [
      "Spray Mancozeb 75% WP @ 2g per litre of water at initial symptom stage",
      "Apply Difenoconazole 25% EC @ 0.5 ml per litre for systemic control",
      "Use Iprodione 50% WP during rainy, humid weather",
    ],
    prevention: [
      "Water at the base of plants; avoid wetting leaves and flower petals",
      "Maintain 35-45 cm plant spacing for adequate air circulation and sunlight",
      "Remove old, spent flower blooms regularly to prevent fungal buildup",
    ],
  },

  // 7. General Flowering Plants
  "flower:alternaria leaf spot & blight": {
    crop: "Marigold / Flower",
    disease: "Alternaria Leaf Spot & Blight",
    emoji: "🌸",
    symptoms: [
      "Brown necrotic spots appearing on leaves and flower petals",
      "Premature flower dropping and yellowing of foliage",
      "Dark lesions spreading along stems and flower buds",
    ],
    organicTreatment: [
      "Remove and discard severely affected flowers and spotted leaves",
      "Apply organic neem oil spray (3 ml per litre) in early morning",
      "Improve airflow and reduce plant overcrowding",
    ],
    chemicalTreatment: [
      "Apply protective Mancozeb 75% WP @ 2g per litre of water",
      "Spray broad-spectrum copper fungicide or Difenoconazole",
    ],
    prevention: [
      "Keep foliage and petals dry during watering",
      "Provide 6-8 hours of direct sunlight daily",
      "Ensure well-drained fertile soil with organic matter",
    ],
  },
};

// ----------------------------------------------------
// Helper function to get disease information
// Matches based on: CROP + DISEASE
// ----------------------------------------------------
export function getDiseaseDetails(
  cropName: string | null | undefined,
  diseaseName: string | null | undefined
): DiseaseInfo {
  const safeCrop = (cropName || "Tomato").trim();
  const safeDisease = (diseaseName || "Early Blight").trim();
  const lookupKey = `${safeCrop.toLowerCase()}:${safeDisease.toLowerCase()}`;

  // 1. Direct match in database
  if (DISEASE_DATABASE[lookupKey]) {
    return DISEASE_DATABASE[lookupKey];
  }

  // 2. Fallback: match by crop name if disease varies
  for (const key of Object.keys(DISEASE_DATABASE)) {
    if (key.startsWith(`${safeCrop.toLowerCase()}:`)) {
      return {
        ...DISEASE_DATABASE[key],
        disease: safeDisease,
      };
    }
  }

  // 3. General fallback for recognized crops with general leaf spot
  return {
    crop: safeCrop,
    disease: safeDisease,
    emoji: "🌿",
    symptoms: [
      "Visible discoloration or abnormal brown/yellow spotting on leaf surface",
      "Localized lesions affecting photosynthetic leaf tissue",
      "Mild wilting or yellowing of foliage in affected branches",
    ],
    organicTreatment: [
      "Isolate or prune visibly damaged leaves to stop spread to healthy branches",
      "Apply botanical neem oil spray (3 ml per litre) in the early morning or evening",
      "Improve soil aeration and add well-rotted organic compost to support root health",
    ],
    chemicalTreatment: [
      "Consult your local agricultural extension officer for specific crop recommendations",
      "Apply broad-spectrum protective copper-based or Mancozeb fungicide if leaf spot spreads",
    ],
    prevention: [
      "Ensure proper sunlight, ventilation, and adequate row-to-row spacing",
      "Avoid watering from overhead; keep foliage as dry as possible",
      "Sanitize pruning tools with 70% alcohol between plants",
      "Inspect plants regularly every 3-4 days to catch symptoms early",
    ],
  };
}
