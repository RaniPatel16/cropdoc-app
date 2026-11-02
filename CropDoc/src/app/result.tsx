import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

// -------------------------------------------------------
// Mock diagnosis data — will be replaced with real backend
// -------------------------------------------------------
const mockResult = {
  crop: "Tomato",
  disease: "Early Blight",
  confidence: 94,
  organicTreatment: [
    "Remove infected leaves immediately",
    "Apply neem oil spray (2-3 ml per litre)",
    "Use compost tea as foliar spray",
  ],
  chemicalTreatment: [
    "Apply Mancozeb 75% WP fungicide",
    "Spray Chlorothalonil if severe",
  ],
  prevention: [
    "Maintain proper spacing between plants",
    "Avoid excessive moisture on leaves",
    "Rotate crops every season",
    "Use disease-resistant seed varieties",
  ],
};

export default function ResultScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Diagnosis Result</Text>
          <View style={styles.headerSpace} />
        </View>

        {/* Scanned Image Card */}
        {imageUri && (
          <View style={styles.scannedImageCard}>
            <Image source={{ uri: imageUri }} style={styles.scannedImage} />
            <View style={styles.imageBadge}>
              <Text style={styles.imageBadgeText}>📸 Scanned Leaf</Text>
            </View>
          </View>
        )}

        {/* Disease Card */}
        <View style={styles.diseaseCard}>
          <Text style={styles.diseaseEmoji}>🍅</Text>
          <Text style={styles.cropName}>{mockResult.crop}</Text>
          <Text style={styles.diseaseName}>{mockResult.disease}</Text>

          <View style={styles.confidenceRow}>
            <View style={styles.confidenceBarBg}>
              <View
                style={[
                  styles.confidenceBarFill,
                  { width: `${mockResult.confidence}%` },
                ]}
              />
            </View>
            <Text style={styles.confidenceText}>
              {mockResult.confidence}% confidence
            </Text>
          </View>
        </View>

        {/* Organic Treatment */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🌿</Text>
            <Text style={styles.sectionTitle}>Organic Treatment</Text>
          </View>
          {mockResult.organicTreatment.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Chemical Treatment */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>💊</Text>
            <Text style={styles.sectionTitle}>Chemical Treatment</Text>
          </View>
          {mockResult.chemicalTreatment.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Prevention Tips */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🛡️</Text>
            <Text style={styles.sectionTitle}>Prevention Tips</Text>
          </View>
          {mockResult.prevention.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push("/(tabs)/scan")}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>📷 Scan Another Leaf</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push("/(tabs)/history")}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryBtnText}>📋 View Scan History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => router.replace("/(tabs)/home")}
          activeOpacity={0.85}
        >
          <Text style={styles.homeBtnText}>🏠 Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F8F4" },
  scrollContent: { padding: 20, paddingBottom: 44 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { fontSize: 28, color: "#2E7D32", lineHeight: 32 },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#1A2B1A" },
  headerSpace: { width: 40 },

  // Scanned image preview
  scannedImageCard: {
    width: "100%",
    height: 220,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    position: "relative",
    backgroundColor: "#E0E0E0",
  },
  scannedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  imageBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  // Disease card
  diseaseCard: {
    backgroundColor: "#2E7D32",
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
    marginBottom: 20,
  },
  diseaseEmoji: { fontSize: 48, marginBottom: 8 },
  cropName: {
    fontSize: 16,
    color: "#C8E6C9",
    fontWeight: "600",
    marginBottom: 2,
  },
  diseaseName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 14,
  },
  confidenceRow: { width: "100%", alignItems: "center" },
  confidenceBarBg: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 4,
    marginBottom: 6,
  },
  confidenceBarFill: {
    height: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 14,
    color: "#C8E6C9",
    fontWeight: "600",
  },

  // Section
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DDE8DD",
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionIcon: { fontSize: 20, marginRight: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1A2B1A" },
  listItem: { flexDirection: "row", marginBottom: 8, paddingRight: 8 },
  bullet: { fontSize: 14, color: "#2E7D32", marginRight: 8, marginTop: 1 },
  listText: { fontSize: 14, lineHeight: 20, color: "#4A5A4A", flex: 1 },

  // Buttons
  primaryBtn: {
    backgroundColor: "#2E7D32",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  secondaryBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C8DEC8",
    marginBottom: 10,
  },
  secondaryBtnText: { color: "#2E7D32", fontSize: 16, fontWeight: "700" },
  homeBtn: {
    paddingVertical: 12,
    alignItems: "center",
  },
  homeBtnText: { color: "#7A847A", fontSize: 14, fontWeight: "600" },
});
