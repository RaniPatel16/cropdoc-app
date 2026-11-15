import { Platform } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import { API_CONFIG } from "./apiConfig";

// Helper to convert base64/dataURI to a proper Blob on Web
function dataURItoBlob(dataURI: string): Blob {
  const split = dataURI.split(",");
  const byteString = atob(split[1]);
  const mimeString = split[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

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

    let blob: Blob;

    if (imageUri.startsWith("data:")) {
      blob = dataURItoBlob(imageUri);
    } else {
      const imageResponse = await fetch(imageUri);
      blob = await imageResponse.blob();
    }

    // Ensure the blob has jpeg mime type so backend multer accepts it
    const file = new File([blob], "leaf_upload.jpg", {
      type: blob.type || "image/jpeg",
    });

    formData.append("image", file);

    const response = await fetch(`${API_CONFIG.baseURL}/api/diagnose`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json().catch(() => ({}));

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
