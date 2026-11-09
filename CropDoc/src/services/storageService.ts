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

