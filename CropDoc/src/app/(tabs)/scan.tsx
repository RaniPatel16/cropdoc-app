
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  Alert,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";

import { analyzeLeafImage } from "../../services/imageService";
import {
  saveScanRecord,
  HistoryRecord,
} from "../../services/storageService";

const crops = [
  "Tomato",
  "Chilli",
  "Potato",
  "Brinjal",
  "Okra",
  "Onion",
  "Garlic",
  "Cucumber",
  "Wheat",
  "Rice",
  "Maize",
  "Cotton",
  "Groundnut",
  "Soybean",
  "Sugarcane",
  "Mango",
  "Banana",
  "Grapes",
  "Citrus",
  "Papaya",
  "Watermelon",
  "Other",
];

export default function ScanScreen() {
  const router = useRouter();
  const cameraRef = useRef<any>(null);

  const [image, setImage] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [customCrop, setCustomCrop] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);

  const [permission, requestPermission] = useCameraPermissions();

  const updateZoomFromTouch = (locationX: number) => {
    if (trackWidth > 0) {
      const ratio = Math.max(0, Math.min(1, locationX / trackWidth));
      setZoom(+ratio.toFixed(2));
    }
  };

  // Prepare image as JPEG
  const prepareImage = async (uri: string) => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [],
      {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    return result.uri;
  };

  // Open camera
  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();

      if (!result.granted) {
        Alert.alert(
          "Permission required",
          "Please allow camera access."
        );
        return;
      }
    }

    setShowCamera(true);
  };

  // Capture photo
  const capturePhoto = async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.8,
      });

      if (photo?.uri) {
        const jpegUri = await prepareImage(photo.uri);
        setImage(jpegUri);
        setShowCamera(false);
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Could not capture photo.");
    }
  };

  // Select image from gallery
  const chooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        const jpegUri = await prepareImage(result.assets[0].uri);
        setImage(jpegUri);
      } catch (error) {
        console.error("Image preparation error:", error);
        Alert.alert("Error", "Could not prepare this image.");
      }
    }
  };

  // Analyze leaf image
  const handleAnalyze = async () => {
    if (!image) {
      Alert.alert("Error", "Please select an image.");
      return;
    }

    // Crop selection is optional.
    // Gemini will identify the crop from the image.
    const crop =
      selectedCrop === "Other"
        ? customCrop.trim()
        : selectedCrop.trim();

    setLoading(true);

    try {
      const response = await analyzeLeafImage(image, crop);

      if (!response.success || !response.result) {
        throw new Error(
          response.message || "Invalid response from server."
        );
      }

      const diagnosis = response.result;

      if (typeof diagnosis.isPlantLeaf !== "boolean") {
        throw new Error("Invalid diagnosis response from server.");
      }

      const detectedCrop = diagnosis.crop || "";
      const detectedDisease = diagnosis.disease || "";
      const confidence = Number(diagnosis.confidence) || 0;

      const symptoms = Array.isArray(diagnosis.symptoms)
        ? diagnosis.symptoms.filter(
            (item: unknown) => typeof item === "string"
          )
        : [];

      const possibleCauses = Array.isArray(diagnosis.possibleCauses)
        ? diagnosis.possibleCauses.filter(
            (item: unknown) => typeof item === "string"
          )
        : [];

      const diagnosisStatus =
        diagnosis.diagnosisStatus || "uncertain";

      // Save valid leaf diagnosis in scan history
      if (
        diagnosis.isPlantLeaf &&
        detectedCrop &&
        detectedDisease
      ) {
        const record: HistoryRecord = {
          id: Date.now().toString(),
          imageUri: image,
          crop: detectedCrop,
          disease: detectedDisease,
          confidence,
          date: new Date().toISOString(),
        };

        await saveScanRecord(record);
      }

      // Navigate to result screen with ALL diagnosis details
      router.push({
        pathname: "/result",
        params: {
          imageUri: image,
          isPlantLeaf: String(diagnosis.isPlantLeaf),
          crop: detectedCrop,
          disease: detectedDisease,
          confidence: String(confidence),
          selectedCrop: crop,
          description: diagnosis.description || "",
          symptoms: JSON.stringify(symptoms),
          possibleCauses: JSON.stringify(possibleCauses),
          conditions: JSON.stringify(
            Array.isArray(diagnosis.conditions) ? diagnosis.conditions : []
          ),
          prevention: JSON.stringify(
            Array.isArray(diagnosis.prevention) ? diagnosis.prevention : []
          ),
          treatment: JSON.stringify(
            Array.isArray(diagnosis.treatment) ? diagnosis.treatment : []
          ),
          diagnosisStatus,
          message: diagnosis.message || "",
        },
      });
    } catch (error: any) {
      console.error("Analysis error:", error);

      Alert.alert(
        "Analysis Failed",
        error.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  // Camera screen
  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          zoom={zoom}
        />

        <View style={styles.zoomContainer}>
          <TouchableOpacity
            style={styles.zoomBtn}
            onPress={() =>
              setZoom((prev) => Math.max(0, +(prev - 0.1).toFixed(2)))
            }
            activeOpacity={0.7}
          >
            <Text style={styles.zoomBtnText}>−</Text>
          </TouchableOpacity>

          <View
            style={styles.zoomTrack}
            onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
            onStartShouldSetResponder={() => true}
            onResponderGrant={(e) =>
              updateZoomFromTouch(e.nativeEvent.locationX)
            }
            onResponderMove={(e) =>
              updateZoomFromTouch(e.nativeEvent.locationX)
            }
          >
            <View style={styles.zoomTrackBg} />
            <View style={[styles.zoomFill, { width: `${zoom * 100}%` }]} />
            <View
              style={[
                styles.zoomThumb,
                { left: `${Math.min(94, Math.max(0, zoom * 100 - 3))}%` },
              ]}
            />
          </View>

          <TouchableOpacity
            style={styles.zoomBtn}
            onPress={() =>
              setZoom((prev) => Math.min(1, +(prev + 0.1).toFixed(2)))
            }
            activeOpacity={0.7}
          >
            <Text style={styles.zoomBtnText}>+</Text>
          </TouchableOpacity>

          <Text style={styles.zoomText}>{`${(1 + zoom * 3).toFixed(1)}x`}</Text>
        </View>

        <Button
          title="Capture Photo"
          onPress={capturePhoto}
        />

        <Button
          title="Cancel"
          onPress={() => setShowCamera(false)}
        />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>CropDoc - Scan Leaf</Text>

      <Text style={styles.description}>
        Capture or select a crop leaf photo to identify its
        crop and possible diseases using AI.
      </Text>

      <Button
        title="Take Photo"
        onPress={openCamera}
      />

      <View style={styles.buttonSpacing}>
        <Button
          title="Choose from Gallery"
          onPress={chooseImage}
        />
      </View>

      {image && (
        <View>
          <Image
            source={{ uri: image }}
            style={styles.preview}
          />

          <Button
            title="Remove Image"
            onPress={() => setImage(null)}
          />
        </View>
      )}

      <Text style={styles.heading}>
        Select Crop (Optional)
      </Text>

      <Text style={styles.hint}>
        You can select a crop as a hint, or leave it empty
        and let AI identify the crop automatically.
      </Text>

      <View style={styles.cropContainer}>
        {crops.map((crop) => (
          <Text
            key={crop}
            onPress={() => {
              setSelectedCrop(
                selectedCrop === crop ? "" : crop
              );
            }}
            style={[
              styles.cropButton,
              selectedCrop === crop && styles.selectedCrop,
            ]}
          >
            {selectedCrop === crop ? "✓ " : ""}
            {crop}
          </Text>
        ))}
      </View>

      {selectedCrop === "Other" && (
        <TextInput
          style={styles.input}
          placeholder="Enter crop name"
          value={customCrop}
          onChangeText={setCustomCrop}
        />
      )}

      <View style={styles.analyzeButton}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="green"
            />
            <Text style={styles.loadingText}>
              Analyzing your crop leaf...
            </Text>
          </View>
        ) : (
          <Button
            title="Analyze Leaf"
            onPress={handleAnalyze}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5FAF5",
    flexGrow: 1,
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1B5E20",
  },

  description: {
    fontSize: 15,
    marginBottom: 20,
    color: "#555",
    lineHeight: 22,
  },

  buttonSpacing: {
    marginTop: 12,
  },

  heading: {
    fontSize: 19,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 8,
  },

  hint: {
    fontSize: 13,
    color: "#666",
    marginBottom: 14,
    lineHeight: 19,
  },

  preview: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    marginTop: 20,
    marginBottom: 12,
    borderRadius: 12,
  },

  cropContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  cropButton: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#E8F5E9",
    overflow: "hidden",
  },

  selectedCrop: {
    backgroundColor: "#2E7D32",
    color: "white",
  },

  input: {
    borderWidth: 1,
    borderColor: "#2E7D32",
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
  },

  analyzeButton: {
    marginTop: 25,
    marginBottom: 30,
  },

  loadingContainer: {
    alignItems: "center",
    gap: 10,
  },

  loadingText: {
    color: "#2E7D32",
    fontSize: 14,
  },

  cameraContainer: {
    flex: 1,
    backgroundColor: "black",
  },

  camera: {
    flex: 1,
  },

  zoomContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    gap: 10,
  },

  zoomBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  zoomBtnText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 22,
  },

  zoomTrack: {
    flex: 1,
    height: 32,
    justifyContent: "center",
    position: "relative",
  },

  zoomTrackBg: {
    height: 4,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
  },

  zoomFill: {
    height: 4,
    backgroundColor: "#4CAF50",
    borderRadius: 2,
    position: "absolute",
    left: 0,
  },

  zoomThumb: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    top: 9,
  },

  zoomText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    minWidth: 36,
    textAlign: "right",
  },
});
