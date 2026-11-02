import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";

export default function ScanScreen() {
  const router = useRouter();
  const cameraRef = useRef<any>(null);

  const [image, setImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();

  // Open camera
  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();

      if (!result.granted) {
        Alert.alert(
          "Camera Permission Required",
          "Please allow camera access to scan a crop leaf."
        );
        return;
      }
    }

    setShowCamera(true);
  };

  // Capture photo from camera
  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.85,
        });
        if (photo?.uri) {
          setImage(photo.uri);
          setShowCamera(false);
        }
      } catch (e) {
        Alert.alert("Camera Error", "Could not take photo. Please try again.");
      }
    }
  };

  // Open gallery
  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setShowCamera(false);
    }
  };

  // Camera UI
  if (showCamera) {
    return (
      <SafeAreaView style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back">
          <View style={styles.cameraOverlay}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.cameraGuide}>
              <Text style={styles.guideText}>
                Place the crop leaf inside the frame
              </Text>
            </View>

            <View style={styles.cameraBottom}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleCapture}
              >
                <View style={styles.captureInner} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Scan Leaf</Text>

          <View style={styles.headerSpace} />
        </View>

        {/* Information */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>Analyze Your Crop</Text>

          <Text style={styles.description}>
            Take a clear photo of the affected crop leaf or choose an image
            from your gallery.
          </Text>
        </View>

        {/* Image Preview */}
        <View style={styles.previewContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <>
              <Text style={styles.previewIcon}>🌿</Text>

              <Text style={styles.previewTitle}>No Leaf Image</Text>

              <Text style={styles.previewDescription}>
                Add a photo of the affected leaf to continue.
              </Text>
            </>
          )}
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={openCamera}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonIcon}>📷</Text>
            <Text style={styles.primaryButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={openGallery}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonIcon}>🖼️</Text>
            <Text style={styles.secondaryButtonText}>
              Choose from Gallery
            </Text>
          </TouchableOpacity>
        </View>

        {/* Analyze Button */}
        {image && (
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={() =>
              router.push({
                pathname: "/result",
                params: { imageUri: image },
              })
            }
            activeOpacity={0.8}
          >
            <Text style={styles.analyzeButtonText}>🔍 Analyze Leaf</Text>
          </TouchableOpacity>
        )}

        {/* Tip */}
        <View style={styles.tipContainer}>
          <Text style={styles.tipTitle}>💡 Tip for better results</Text>

          <Text style={styles.tipText}>
            Make sure the leaf is clearly visible, well-lit, and fills most of
            the photo.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAF7",
  },

  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 24,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },

  backText: {
    fontSize: 32,
    color: "#2E7D32",
    lineHeight: 35,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2D20",
  },

  headerSpace: {
    width: 42,
  },

  infoContainer: {
    marginBottom: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1F2D20",
    marginBottom: 6,
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B756B",
  },

  previewContainer: {
    height: 250,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#D8E5D8",
    borderStyle: "dashed",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 16,
  },

  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  previewIcon: {
    fontSize: 48,
    marginBottom: 8,
  },

  previewTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#263426",
    marginBottom: 4,
  },

  previewDescription: {
    fontSize: 13,
    color: "#7A847A",
    textAlign: "center",
    paddingHorizontal: 24,
  },

  buttonsContainer: {
    gap: 10,
  },

  primaryButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#C9DCC9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "700",
  },

  buttonIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  analyzeButton: {
    marginTop: 12,
    backgroundColor: "#1B5E20",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },

  analyzeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  tipContainer: {
    marginTop: 14,
    backgroundColor: "#EAF4EA",
    borderRadius: 14,
    padding: 12,
  },

  tipTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 4,
  },

  tipText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#5E6B5E",
  },

  cameraContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },

  camera: {
    flex: 1,
  },

  cameraOverlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },

  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },

  closeText: {
    color: "#FFFFFF",
    fontSize: 20,
  },

  cameraGuide: {
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 20,
    width: "80%",
    height: "45%",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 15,
  },

  guideText: {
    color: "#FFFFFF",
    fontSize: 14,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 8,
  },

  cameraBottom: {
    alignItems: "center",
    paddingBottom: 20,
  },

  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 5,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
  },
});
