import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import {
  getScanHistory,
  clearScanHistory,
  HistoryRecord,
} from "../../services/storageService";

// Helper function to format date string to "03 Nov 2026"
function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
      return dateString;
    }
    const day = String(d.getDate()).padStart(2, "0");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch (e) {
    return dateString;
  }
}

export default function HistoryScreen() {
  const router = useRouter();

  // State to hold saved history scans
  const [historyList, setHistoryList] = useState<HistoryRecord[]>([]);

  // Simple function to load saved history records
  const loadHistory = async () => {
    const records = await getScanHistory();
    setHistoryList(records);
  };

  // Function to clear all history with a confirmation alert
  const handleClearHistory = () => {
    Alert.alert(
      "Clear Scan History",
      "Are you sure you want to delete all saved scan history? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            await clearScanHistory();
            setHistoryList([]);
          },
        },
      ]
    );
  };

  // 1. Load history on initial mount
  useEffect(() => {
    loadHistory();
  }, []);

  // 2. Reload history whenever the History tab comes into focus
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

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
          {historyList.length > 0 ? (
            <TouchableOpacity
              style={styles.clearHeaderButton}
              onPress={handleClearHistory}
            >
              <Text style={styles.clearHeaderText}>Clear</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.headerSpace} />
          )}
        </View>

        {/* Total Scans Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{historyList.length}</Text>
          <Text style={styles.summaryLabel}>Total Scans</Text>
        </View>

        {/* ---------------------------------------------------- */}
        {/* EMPTY STATE: When user has no scans yet              */}
        {/* ---------------------------------------------------- */}
        {historyList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🍃</Text>
            <Text style={styles.emptyTitle}>No scans yet</Text>
            <Text style={styles.emptySubtitle}>
              Your analyzed crop scans will appear here.
            </Text>

            <TouchableOpacity
              style={styles.scanBtn}
              onPress={() => router.push("/(tabs)/scan")}
              activeOpacity={0.85}
            >
              <Text style={styles.scanBtnText}>📷 Start Your First Scan</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ---------------------------------------------------- */
          /* HISTORY LIST: Display user's actual previous scans   */
          /* ---------------------------------------------------- */
          <View>
            {historyList.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.historyCard}
                onPress={() =>
                  router.push({
                    pathname: "/result",
                    params: {
                      imageUri: item.imageUri || undefined,
                      isPlantLeaf: "true",
                      crop: item.crop,
                      disease: item.disease,
                      confidence: item.confidence.toString(),
                      diagnosisStatus:
                        item.disease.toLowerCase() === "healthy"
                          ? "healthy"
                          : "identified",
                    },
                  })
                }
                activeOpacity={0.8}
              >
                {/* Left side: Crop & Disease details */}
                <View style={styles.info}>
                  <Text style={styles.cropName}>🌿 {item.crop}</Text>
                  <Text style={styles.diseaseName}>{item.disease}</Text>
                  <Text style={styles.confidenceText}>
                    Confidence: {item.confidence}%
                  </Text>
                  <Text style={styles.dateText}>{formatDate(item.date)}</Text>
                </View>

                {/* Right side: Small leaf image preview */}
                {item.imageUri ? (
                  <Image
                    source={{ uri: item.imageUri }}
                    style={styles.historyImage}
                  />
                ) : (
                  <View style={styles.historyPlaceholderBox}>
                    <Text style={styles.placeholderEmoji}>🌿</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {/* Bottom Button to start new scan */}
            <TouchableOpacity
              style={styles.scanBtn}
              onPress={() => router.push("/(tabs)/scan")}
              activeOpacity={0.85}
            >
              <Text style={styles.scanBtnText}>📷 Start New Scan</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8F4",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

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
  backText: {
    fontSize: 28,
    color: "#2E7D32",
    lineHeight: 32,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A2B1A",
  },
  headerSpace: {
    width: 40,
  },
  clearHeaderButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#FFEBEE",
  },
  clearHeaderText: {
    color: "#D32F2F",
    fontWeight: "700",
    fontSize: 13,
  },

  // Summary Card
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
  summaryLabel: {
    fontSize: 14,
    color: "#C8E6C9",
    fontWeight: "600",
  },

  // History Card
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0EAE0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  info: {
    flex: 1,
    paddingRight: 12,
  },
  cropName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1A2B1A",
    marginBottom: 4,
  },
  diseaseName: {
    fontSize: 15,
    color: "#D32F2F",
    fontWeight: "700",
    marginBottom: 3,
  },
  confidenceText: {
    fontSize: 13,
    color: "#2E7D32",
    fontWeight: "600",
    marginBottom: 6,
  },
  dateText: {
    fontSize: 12,
    color: "#7A8A7A",
    fontWeight: "500",
  },

  // Small image preview
  historyImage: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: "#E8ECE8",
  },
  historyPlaceholderBox: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: "#F0F8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderEmoji: {
    fontSize: 28,
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 36,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#E0EAE0",
    marginTop: 10,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A2B1A",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B756B",
    textAlign: "center",
    marginBottom: 20,
  },

  // Action Button
  scanBtn: {
    backgroundColor: "#2E7D32",
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  scanBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
