import { Platform } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import { API_CONFIG } from "./apiConfig";

// Upload image to backend and get diagnosis across Android, iOS and Web
export async function analyzeLeafImage(
  imageUri: string,
  crop: string
) {
  if (!imageUri) {
    throw new Error("Please select an image.");
  }

  // 1. Web Platform Implementation (standard fetch + FormData)
  if (Platform.OS === "web") {
    const formData = new FormData();
    formData.append("crop", crop || "");

    // Fetch the local blob/object URL to create a standard File/Blob
    const imageResponse = await fetch(imageUri);
    const blob = await imageResponse.blob();
    formData.append("image", blob, "leaf_upload.jpg");

    const response = await fetch(`${API_CONFIG.baseURL}/api/diagnose`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Analysis failed.");
    }

    return data;
  }

  // 2. Native Mobile Platform Implementation (Android & iOS via FileSystem)
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
