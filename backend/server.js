require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const { GoogleGenAI } = require("@google/genai");
const Disease = require("./models/Disease");

const app = express();
const PORT = process.env.PORT || 5000;

const MONGODB_URI = process.env.MONGODB_URI;

// Cached MongoDB Connection for Serverless Execution
let cachedDbConnection = null;

async function connectToDatabase() {
  if (cachedDbConnection && mongoose.connection.readyState === 1) {
    return cachedDbConnection;
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing in environment variables.");
  }

  if (!cachedDbConnection) {
    cachedDbConnection = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
      bufferCommands: false, // Avoid buffering queries while disconnected in serverless
    });
  }

  try {
    await cachedDbConnection;
    return cachedDbConnection;
  } catch (error) {
    cachedDbConnection = null;
    throw error;
  }
}

// Gemini configuration
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })
  : null;

const MODELS = [
  process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
  "gemini-2.5-flash",
].filter((model, index, arr) => arr.indexOf(model) === index);

// Middleware
app.use(cors());
app.use(express.json());

// Image upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only JPG and PNG images are allowed.")
      );
    }

    cb(null, true);
  },
});

// Normalize crop names without restricting supported crops
function normalizeCrop(crop) {
  if (!crop || typeof crop !== "string") {
    return null;
  }

  return crop.trim();
}

// Escape special characters before using a name in a regular expression
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Extract useful error status
function getErrorStatus(error) {
  return Number(
    error.status ||
    error.statusCode ||
    error.code
  );
}

// Call Gemini
async function askGemini(imageBase64, mimeType, prompt) {
  if (!ai) {
    const error = new Error("Gemini API key is missing.");
    error.status = 500;
    throw error;
  }

  let lastError;

  for (const model of MODELS) {
    try {
      console.log("Trying Gemini model:", model);

      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: imageBase64,
                },
              },
              {
                text: prompt,
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
        },
      });

      if (!response.text) {
        throw new Error("Gemini returned an empty response.");
      }

      const result = JSON.parse(response.text);

      console.log("Gemini analysis successful:", model);

      return result;
    } catch (error) {
      lastError = error;

      const status = getErrorStatus(error);

      console.error(
        `Gemini error (${model}):`,
        error.message
      );

      const retryable =
        [429, 500, 502, 503, 504].includes(status) ||
        /UNAVAILABLE|RESOURCE_EXHAUSTED|HIGH DEMAND/i.test(
          error.message || ""
        );

      if (!retryable) {
        throw error;
      }

      console.log("Checking fallback model...");
    }
  }

  throw lastError || new Error("All Gemini models failed.");
}

// Backend health check
app.get("/", async (req, res) => {
  let dbStatus = "disconnected";

  if (mongoose.connection.readyState === 1) {
    dbStatus = "connected";
  } else if (MONGODB_URI) {
    try {
      await connectToDatabase();
      dbStatus = "connected";
    } catch (e) {
      dbStatus = "disconnected";
    }
  }

  res.json({
    success: true,
    message: "CropDoc Backend is running!",
    mongodb: dbStatus,
  });
});

// Get disease information from MongoDB
app.get("/api/diseases/:crop/:disease", async (req, res) => {
  try {
    const crop = normalizeCrop(req.params.crop);
    const diseaseName = req.params.disease?.trim();

    if (!crop) {
      return res.status(400).json({
        success: false,
        message: "Crop name is required.",
      });
    }

    if (!diseaseName) {
      return res.status(400).json({
        success: false,
        message: "Disease name is required.",
      });
    }

    // Connect to database on demand
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error("MongoDB on-demand connection error:", dbError.message);
      return res.status(503).json({
        success: false,
        message: "Database service is temporarily unavailable.",
      });
    }

    const escapedCrop = escapeRegex(crop);
    const escapedDisease = escapeRegex(diseaseName);

    // Case-insensitive lookup matching crop and disease name (with or without crop prefix)
    const disease = await Disease.findOne({
      crop: {
        $regex: `^${escapedCrop}$`,
        $options: "i",
      },
      name: {
        $regex: `^(${escapedCrop}\\s+)?${escapedDisease}$|^${escapedDisease}$`,
        $options: "i",
      },
    }).lean();

    if (!disease) {
      return res.status(404).json({
        success: false,
        message:
          "Verified information for this disease is not available in the CropDoc database yet.",
      });
    }

    return res.json({
      success: true,
      disease,
    });
  } catch (error) {
    console.error("Disease lookup error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve disease information.",
    });
  }
});

// Main diagnosis API
app.post(
  "/api/diagnose",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({
          success: false,
          message: "Gemini API key is missing in backend .env.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a leaf image.",
        });
      }

      // Crop selection is optional.
      // Gemini will identify the crop from the image.
      const selectedCrop = normalizeCrop(req.body.crop);

      const imageBase64 = req.file.buffer.toString("base64");
      const mimeType = req.file.mimetype;

      const prompt = `
You are CropDoc, an expert agricultural crop disease image analysis assistant.

Analyze the uploaded leaf image and identify the agricultural crop and any visible disease symptoms.

AGRICULTURAL SCOPE:
Identify agricultural crops including:
- Tomato, Chilli, Potato, Brinjal, Okra, Onion, Garlic, Cucumber
- Wheat, Rice, Maize, Cotton, Groundnut, Soybean, Sugarcane
- Mango, Banana, Grapes, Citrus, Papaya, Watermelon
- Any other agricultural crop (not limited to this list)

USER SELECTED CROP HINT:
${selectedCrop || "Not specified. Identify the crop automatically from the image."}

DIAGNOSIS INSTRUCTIONS & RULES:
1. Determine whether the image contains a recognizable plant or crop leaf.
   - If the image is not a recognizable plant or leaf (e.g. person, animal, object, room), set diagnosisStatus to "not_a_leaf", isPlantLeaf to false, crop to null, disease to null, confidence to 0.
   - If the image shows a non-agricultural plant (e.g. houseplant, ornamental plant, wild weed), set diagnosisStatus to "non_agricultural_plant", isPlantLeaf to true.
2. Crop Identification:
   - Identify the crop based on visible leaf morphology (shape, veins, margin, texture).
   - If a user hint was provided, examine the leaf independently; do not blindly trust the hint if the image shows a different crop.
3. Disease Diagnosis:
   - Carefully inspect foliage for visible symptoms:
     * Spots, flecks, lesions (e.g. Purple Blotch, Stemphylium Blight on onion/garlic, leaf spots)
     * Leaf tip drying, dieback, blights, or necrosis
     * Chlorosis, yellowing, silver streaks, or pest feeding marks (e.g. thrips)
     * Powdery/fuzzy fungal growth, downy mildew, rust pustules
     * Leaf curling, twisting, wrinkling, or mosaic patterns
     * Water-soaked patches, wilting, or rotting
   - Do not miss or overlook visible foliage lesions or tip blight. If there is visible disease evidence, identify the disease and set diagnosisStatus to "identified".
   - If the image is blurry, too dark, obstructed, or symptoms are insufficient for a reliable diagnosis: set diagnosisStatus to "uncertain", disease to null, and explain in message why it is uncertain and advise capturing a clearer photo. Do not invent a disease.
   - If the leaf is genuinely healthy with no disease symptoms: set diagnosisStatus to "healthy", disease to "Healthy". For healthy plants, describe observed visual characteristics (e.g. upright green foliage, absence of lesions) under symptoms.
   - If a disease is detected based on visual evidence: set diagnosisStatus to "identified", disease to the common disease name (e.g. "Purple Blotch", "Downy Mildew", "Early Blight", "Rust", etc.).
4. Detailed Agricultural Information:
   - Provide simple, clear, practical agricultural information understandable to farmers and students.
   - description: Brief description of the disease or health status.
   - symptoms: List of visible symptoms observed on the leaf.
   - possibleCauses: List of potential pathogens or causes.
   - conditions: Environmental conditions favoring disease development.
   - prevention: Practical prevention and cultural practices.
   - treatment: Safe management recommendations (pruning infected leaves, improving aeration, sanitation).
   - Do NOT invent chemical pesticide names, specific chemical doses, brands, or fake URLs.
   - If verified chemical treatment is unavailable, state to consult a local agricultural extension expert.
5. Confidence:
   - Estimated diagnostic confidence (0 to 100) as an AI estimate, not a calibrated certainty.

Return JSON adhering to this exact format:
{
  "isPlantLeaf": true,
  "crop": "Potato",
  "disease": "Early Blight",
  "diagnosisStatus": "identified",
  "confidence": 85,
  "description": "A common fungal disease causing concentric ring spots on older foliage.",
  "symptoms": ["Dark brown spots with concentric rings", "Yellowing around lesions"],
  "possibleCauses": ["Alternaria solani fungal pathogen", "Prolonged leaf wetness"],
  "conditions": ["Warm temperatures (24-29°C) and high humidity or wet foliage"],
  "prevention": ["Practice crop rotation with non-solanaceous crops", "Avoid overhead irrigation", "Maintain proper plant spacing"],
  "treatment": ["Remove and safely destroy severely infected leaves", "Improve airflow between plants", "Consult local agricultural extension for approved treatments"],
  "message": "Symptoms are consistent with early blight fungal infection."
}

Allowed diagnosisStatus values:
- identified
- uncertain
- healthy
- not_a_leaf
- non_agricultural_plant

Return JSON only.
`;

      const diagnosis = await askGemini(
        imageBase64,
        mimeType,
        prompt
      );

      // Validate Gemini response
      if (typeof diagnosis.isPlantLeaf !== "boolean") {
        throw new Error("Invalid Gemini diagnosis response.");
      }

      // Reject non-leaf images
      if (!diagnosis.isPlantLeaf || diagnosis.diagnosisStatus === "not_a_leaf") {
        return res.json({
          success: true,
          result: {
            isPlantLeaf: false,
            crop: null,
            disease: null,
            confidence: 0,
            description: "",
            symptoms: [],
            possibleCauses: [],
            conditions: [],
            prevention: [],
            treatment: [],
            diagnosisStatus: "not_a_leaf",
            message:
              diagnosis.message ||
              "Please upload a clear agricultural crop leaf image.",
          },
        });
      }

      const detectedCrop =
        typeof diagnosis.crop === "string"
          ? diagnosis.crop.trim()
          : null;

      const description =
        typeof diagnosis.description === "string"
          ? diagnosis.description.trim()
          : "";

      const symptoms = Array.isArray(diagnosis.symptoms)
        ? diagnosis.symptoms.filter(
            (item) => typeof item === "string"
          )
        : [];

      const possibleCauses = Array.isArray(diagnosis.possibleCauses)
        ? diagnosis.possibleCauses.filter(
            (item) => typeof item === "string"
          )
        : [];

      const conditions = Array.isArray(diagnosis.conditions)
        ? diagnosis.conditions.filter(
            (item) => typeof item === "string"
          )
        : [];

      const prevention = Array.isArray(diagnosis.prevention)
        ? diagnosis.prevention.filter(
            (item) => typeof item === "string"
          )
        : [];

      const treatment = Array.isArray(diagnosis.treatment)
        ? diagnosis.treatment.filter(
            (item) => typeof item === "string"
          )
        : [];

      // Handle non-agricultural plants
      if (
        diagnosis.diagnosisStatus === "non_agricultural_plant"
      ) {
        return res.json({
          success: true,
          result: {
            isPlantLeaf: true,
            crop: detectedCrop || "Non-Agricultural Plant",
            disease: null,
            confidence: 0,
            description,
            symptoms,
            possibleCauses: [],
            conditions: [],
            prevention: [],
            treatment: [],
            diagnosisStatus: "non_agricultural_plant",
            message:
              diagnosis.message ||
              "This plant may be outside CropDoc's agricultural scope.",
          },
        });
      }

      const status = diagnosis.diagnosisStatus;

      // Handle uncertain, missing crop, or invalid diagnosis
      if (
        status === "uncertain" ||
        !detectedCrop ||
        !["identified", "healthy"].includes(status) ||
        (status === "identified" && !diagnosis.disease)
      ) {
        return res.json({
          success: true,
          result: {
            isPlantLeaf: true,
            crop: detectedCrop || null,
            disease: null,
            confidence: 0,
            description,
            symptoms,
            possibleCauses,
            conditions,
            prevention,
            treatment,
            diagnosisStatus: "uncertain",
            message:
              diagnosis.message ||
              "The symptoms or image are not clear enough for a reliable diagnosis. Please upload a clearer image.",
          },
        });
      }

      const confidence = Number(diagnosis.confidence);

      // Return diagnosis
      return res.json({
        success: true,
        result: {
          isPlantLeaf: true,
          crop: detectedCrop,
          disease:
            status === "healthy"
              ? "Healthy"
              : String(diagnosis.disease).trim(),
          confidence: Number.isFinite(confidence)
            ? Math.max(0, Math.min(100, Math.round(confidence)))
            : 0,
          description,
          symptoms,
          possibleCauses,
          conditions,
          prevention,
          treatment,
          diagnosisStatus: status,
          message:
            diagnosis.message || "Image analysis completed.",
        },
      });
    } catch (error) {
      console.error("Diagnosis error:", error);

      const status = getErrorStatus(error);

      if (
        status === 429 ||
        /RESOURCE_EXHAUSTED|QUOTA/i.test(error.message || "")
      ) {
        return res.status(429).json({
          success: false,
          message:
            "Gemini free-tier quota may have been reached. Please try again later or check your Google AI Studio usage limits.",
        });
      }

      if (
        [500, 502, 503, 504].includes(status) ||
        /UNAVAILABLE|HIGH DEMAND/i.test(error.message || "")
      ) {
        return res.status(503).json({
          success: false,
          message:
            "The AI service is temporarily unavailable. Please try again later.",
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Image analysis failed. Please try another image.",
      });
    }
  }
);

// Upload and server errors
app.use((error, req, res, next) => {
  console.error("Upload/server error:", error);

  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "Image must be smaller than 5 MB."
          : "Image upload failed.",
    });
  }

  return res.status(400).json({
    success: false,
    message: error.message || "Image upload failed.",
  });
});

// Start local HTTP server when executed directly (node server.js / npm start)
if (require.main === module) {
  async function startLocalServer() {
    try {
      console.log("Connecting to MongoDB Atlas locally...");
      await connectToDatabase();
      console.log("MongoDB Atlas connected successfully!");

      app.listen(PORT, "0.0.0.0", () => {
        console.log(`CropDoc backend running on port ${PORT}`);
      });
    } catch (error) {
      console.error("MongoDB local connection failed:", error.message);
      // Start the server anyway so AI diagnosis routes remain reachable
      app.listen(PORT, "0.0.0.0", () => {
        console.log(
          `CropDoc backend running on port ${PORT} (without persistent MongoDB)`
        );
      });
    }
  }

  startLocalServer();
}

// Export Express app and helper for Vercel and tests
module.exports = { app, connectToDatabase };
