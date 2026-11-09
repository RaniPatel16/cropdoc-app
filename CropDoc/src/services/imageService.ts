
import * as FileSystem from "expo-file-system/legacy";
import { API_CONFIG } from "./apiConfig";

// Upload image to our backend and get diagnosis
export async function analyzeLeafImage(
  imageUri: string,
  crop: string
) {
  if (!imageUri) {
    throw new Error("Please select an image.");
  }

  const response = await FileSystem.uploadAsync(
    `${API_CONFIG.baseURL}/api/diagnose`,
    imageUri,
    {
      httpMethod: "POST",
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: "image",
      mimeType: "image/jpeg",
      parameters: {
        crop: crop,
      },
    }
  );

  const data = JSON.parse(response.body);

  if (response.status < 200 || response.status >= 300) {
    throw new Error(data.message || "Image upload failed.");
  }

  if (!data.success) {
    throw new Error(data.message || "Analysis failed.");
  }

  return data;
}
