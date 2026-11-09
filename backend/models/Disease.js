
const mongoose = require("mongoose");

const diseaseSchema = new mongoose.Schema(
  {
    diseaseId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Supports any agricultural crop name
    crop: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    symptoms: {
      type: [String],
      default: [],
    },

    causes: {
      type: [String],
      default: [],
    },

    conditions: {
      type: [String],
      default: [],
    },

    prevention: {
      type: [String],
      default: [],
    },

    treatment: {
      type: [String],
      default: [],
    },

    sources: [
      {
        organization: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          default: "",
        },
      },
    ],

    verificationStatus: {
      type: String,
      enum: ["draft", "verified"],
      default: "draft",
    },

    safetyNote: {
      type: String,
      default:
        "Confirm disease identification and follow local agricultural expert advice before applying any treatment.",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate disease records for the same crop and disease (case-insensitive)
diseaseSchema.index(
  { crop: 1, name: 1 },
  {
    unique: true,
    collation: { locale: "en", strength: 2 },
  }
);

// Search diseases by crop
diseaseSchema.index({ crop: 1 });

// Search by disease name
diseaseSchema.index({ name: 1 });

module.exports = mongoose.model("Disease", diseaseSchema);
