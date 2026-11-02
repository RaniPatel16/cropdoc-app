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
// Mock scan history
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
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan History</Text>
          <View style={styles.headerSpace} />
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{mockHistory.length}</Text>
          <Text style={styles.summaryLabel}>Total Scans Conducted</Text>
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

        {/* Action Button */}
        <TouchableOpacity
          style={styles.scanBtn}
          onPress={() => router.push("/(tabs)/scan")}
          activeOpacity={0.85}
        >
          <Text style={styles.scanBtnText}>📷 Start New Scan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F8F4" },
  scrollContent: { padding: 20, paddingBottom: 32 },

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
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#1A2B1A" },
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
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  summaryLabel: { fontSize: 14, color: "#C8E6C9", fontWeight: "600" },

  // History Card
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8EFE8",
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0F8F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cropEmoji: { fontSize: 24 },
  info: { flex: 1 },
  cropName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1A2B1A",
    marginBottom: 2,
  },
  diseaseName: {
    fontSize: 14,
    color: "#D32F2F",
    fontWeight: "600",
    marginBottom: 4,
  },
  meta: { fontSize: 12, color: "#7A8A7A" },
  arrow: { fontSize: 22, color: "#A0B0A0", marginLeft: 8 },

  // Button
  scanBtn: {
    backgroundColor: "#2E7D32",
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  scanBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
