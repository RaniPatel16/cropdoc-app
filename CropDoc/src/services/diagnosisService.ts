
import { analyzeLeafImage } from "./imageService";

export interface DiagnosisResult {
  isPlantLeaf: boolean;
  crop: string | null;
  disease: string | null;
  confidence: number;
  description?: string;
  symptoms: string[];
  possibleCauses: string[];
  conditions?: string[];
  prevention?: string[];
  treatment?: string[];
  diagnosisStatus: string;
  message: string;
}

// Accept any non-empty agricultural crop name.
// Gemini is responsible for identifying the crop.
export function isRecognizedCrop(
  cropName?: string | null
): boolean {
  return (
    typeof cropName === "string" &&
    cropName.trim().length > 0
  );
}

// Analyze a crop leaf using the backend
export async function analyzeLeafWithAI(
  imageUri: string,
  selectedCropHint?: string,
  forceIsPlantLeaf?: boolean
): Promise<DiagnosisResult> {
  if (forceIsPlantLeaf === false) {
    return {
      isPlantLeaf: false,
      crop: null,
      disease: null,
      confidence: 0,
      symptoms: [],
      possibleCauses: [],
      diagnosisStatus: "not_a_leaf",
      message: "Please upload a clear agricultural crop leaf image.",
    };
  }

  if (!imageUri) {
    throw new Error("Please select a leaf image.");
  }

  const response = await analyzeLeafImage(
    imageUri,
    selectedCropHint?.trim() || ""
  );

  if (!response.success || !response.result) {
    throw new Error(
      response.message || "Disease analysis failed."
    );
  }

  const result = response.result;

  return {
    isPlantLeaf: result.isPlantLeaf === true,
    crop: result.crop ?? null,
    disease: result.disease ?? null,
    confidence: Number(result.confidence) || 0,
    description: result.description || "",
    symptoms: Array.isArray(result.symptoms)
      ? result.symptoms
      : [],
    possibleCauses: Array.isArray(result.possibleCauses)
      ? result.possibleCauses
      : [],
    conditions: Array.isArray(result.conditions)
      ? result.conditions
      : [],
    prevention: Array.isArray(result.prevention)
      ? result.prevention
      : [],
    treatment: Array.isArray(result.treatment)
      ? result.treatment
      : [],
    diagnosisStatus: result.diagnosisStatus || "uncertain",
    message: result.message || "",
  };
}
