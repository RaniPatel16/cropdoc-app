import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

// -------------------------------------------------------
// Mock scan history — will be replaced with real data later
// -------------------------------------------------------
const mockHistory = [
  {
    id: "1",
    crop: "Tomato",
    disease: "Early Blight",
    confidence: 94,
    date: "2 Nov 2026",
    emoji: "🍅",
  },
  {
    id: "2",
    crop: "Potato",
    disease: "Late Blight",
    confidence: 91,
    date: "1 Nov 2026",
    emoji: "🥔",
  },
  {
    id: "3",
    crop: "Rice",
    disease: "Brown Spot",
    confidence: 88,
    date: "30 Oct 2026",
    emoji: "🌾",
  },
  {
    id: "4",
    crop: "Wheat",
    disease: "Rust",
    confidence: 85,
    date: "28 Oct 2026",
    emoji: "🌿",
  },
  {
    id: "5",
    crop: "Corn",
    disease: "Gray Leaf Spot",
    confidence: 79,
    date: "25 Oct 2026",
    emoji: "🌽",
  },
];

export default function HistoryScreen() {
  const router = useRouter();

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
          <Text style={styles.headerTitle}>Scan History</Text>
          <View style={styles.headerSpace} />
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{mockHistory.length}</Text>
          <Text style={styles.summaryLabel}>Total Scans</Text>
        </View>

        {/* History List */}
        {mockHistory.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.historyCard}
            onPress={() => router.push("/result")}
            activeOpacity={0.8}
          >
            <View style={styles.iconBox}>
              <Text style={styles.cropEmoji}>{item.emoji}</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.cropName}>{item.crop}</Text>
              <Text style={styles.diseaseName}>{item.disease}</Text>
              <Text style={styles.meta}>
                {item.date} · {item.confidence}% confidence
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Bottom Button */}
        <TouchableOpacity
          style={styles.scanBtn}
          onPress={() => router.push("/scan")}
          activeOpacity={0.85}
        >
          <Text style={styles.scanBtnText}>📷 New Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => router.replace("/")}
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

  // Summary
  summaryCard: {
    backgroundColor: "#2E7D32",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  summaryNumber: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#C8E6C9",
    fontWeight: "600",
    marginTop: 2,
  },

  // History card
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#DDE8DD",
    marginBottom: 10,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: "#F0F8F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cropEmoji: { fontSize: 22 },
  info: { flex: 1 },
  cropName: { fontSize: 15, fontWeight: "700", color: "#1A2B1A" },
  diseaseName: {
    fontSize: 13,
    color: "#C62828",
    fontWeight: "600",
    marginTop: 1,
  },
  meta: { fontSize: 12, color: "#8A9A8A", marginTop: 3 },
  arrow: { fontSize: 24, color: "#B0C4B0", marginLeft: 6 },

  // Buttons
  scanBtn: {
    backgroundColor: "#2E7D32",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  scanBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  homeBtn: { paddingVertical: 12, alignItems: "center" },
  homeBtnText: { color: "#7A847A", fontSize: 14, fontWeight: "600" },
});
