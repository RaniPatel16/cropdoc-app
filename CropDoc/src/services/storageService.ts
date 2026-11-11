import AsyncStorage from "@react-native-async-storage/async-storage";

// ----------------------------------------------------
// History Record Interface
// ----------------------------------------------------
export interface HistoryRecord {
  id: string;
  imageUri: string | null;
  crop: string;
  disease: string;
  confidence: number;
  date: string;
}

// Storage Key for AsyncStorage
const STORAGE_KEY = "@cropdoc_scan_history";

// ----------------------------------------------------
// 1. Get all saved history from persistent local storage
// ----------------------------------------------------
export async function getScanHistory(): Promise<HistoryRecord[]> {
  try {
    const jsonString = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonString != null) {
      return JSON.parse(jsonString);
    }
  } catch (error) {
    console.log("Error loading scan history:", error);
  }
  return [];
}

// ----------------------------------------------------
// 2. Save a new scan record to persistent local storage
// ----------------------------------------------------
export async function saveScanRecord(
  newRecord: HistoryRecord
): Promise<HistoryRecord> {
  try {
    // Load existing history
    const currentHistory = await getScanHistory();

    // Add the new record at the start of the array (newest first)
    const updatedHistory = [newRecord, ...currentHistory];

    // Save updated array to AsyncStorage as a string
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.log("Error saving scan record:", error);
  }
  return newRecord;
}

// ----------------------------------------------------
// 3. Clear all scan history from persistent local storage
// ----------------------------------------------------
export async function clearScanHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.log("Error clearing scan history:", error);
  }
}

// ----------------------------------------------------
// Saved / Favorite Diseases Interface & Storage
// ----------------------------------------------------
export interface SavedDisease {
  id: string;
  crop: string;
  disease: string;
  symptoms: string[];
  savedAt: string;
}

const SAVED_DISEASES_KEY = "@cropdoc_saved_diseases";

export function generateSavedDiseaseId(crop: string, disease: string): string {
  return `${crop.trim().toLowerCase()}_${disease.trim().toLowerCase()}`;
}

// Get all saved favorite diseases
export async function getSavedDiseases(): Promise<SavedDisease[]> {
  try {
    const jsonString = await AsyncStorage.getItem(SAVED_DISEASES_KEY);
    if (jsonString != null) {
      return JSON.parse(jsonString);
    }
  } catch (error) {
    console.log("Error loading saved diseases:", error);
  }
  return [];
}

// Check if a specific disease is already saved
export async function isDiseaseSaved(
  crop: string,
  disease: string
): Promise<boolean> {
  if (!crop || !disease) return false;
  const targetId = generateSavedDiseaseId(crop, disease);
  const current = await getSavedDiseases();
  return current.some((item) => item.id === targetId);
}

// Save a disease to favorites (prevents duplicates)
export async function saveFavoriteDisease(
  diseaseItem: Omit<SavedDisease, "savedAt">
): Promise<boolean> {
  try {
    const current = await getSavedDiseases();
    const targetId =
      diseaseItem.id ||
      generateSavedDiseaseId(diseaseItem.crop, diseaseItem.disease);

    // Prevent duplicate entries
    if (current.some((item) => item.id === targetId)) {
      return false;
    }

    const newRecord: SavedDisease = {
      ...diseaseItem,
      id: targetId,
      savedAt: new Date().toISOString(),
    };

    const updated = [newRecord, ...current];
    await AsyncStorage.setItem(SAVED_DISEASES_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.log("Error saving favorite disease:", error);
    return false;
  }
}

// Remove a disease from favorites
export async function removeFavoriteDisease(id: string): Promise<boolean> {
  try {
    const current = await getSavedDiseases();
    const updated = current.filter((item) => item.id !== id);
    await AsyncStorage.setItem(SAVED_DISEASES_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.log("Error removing favorite disease:", error);
    return false;
  }
}

// ----------------------------------------------------
// PDF Diagnosis Reports Interface & Storage
// ----------------------------------------------------
export interface PdfReportRecord {
  id: string;
  crop: string;
  disease: string;
  confidence: number;
  isHealthy: boolean;
  date: string;
  reportData: any;
}

const PDF_REPORTS_KEY = "@cropdoc_pdf_reports";

export async function getPdfReports(): Promise<PdfReportRecord[]> {
  try {
    const jsonString = await AsyncStorage.getItem(PDF_REPORTS_KEY);
    if (jsonString != null) {
      return JSON.parse(jsonString);
    }
  } catch (error) {
    console.log("Error loading PDF reports:", error);
  }
  return [];
}

export async function savePdfReportRecord(
  record: PdfReportRecord
): Promise<void> {
  try {
    const current = await getPdfReports();
    // Prevent duplicate entries for the exact same crop & disease by replacing or keeping latest
    const filtered = current.filter((item) => item.id !== record.id);
    const updated = [record, ...filtered];
    await AsyncStorage.setItem(PDF_REPORTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.log("Error saving PDF report record:", error);
  }
}

export async function deletePdfReportRecord(id: string): Promise<void> {
  try {
    const current = await getPdfReports();
    const updated = current.filter((item) => item.id !== id);
    await AsyncStorage.setItem(PDF_REPORTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.log("Error deleting PDF report record:", error);
  }
}

