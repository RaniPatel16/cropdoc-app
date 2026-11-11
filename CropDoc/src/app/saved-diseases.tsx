import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import {
  getSavedDiseases,
  removeFavoriteDisease,
  SavedDisease,
} from "../services/storageService";

export default function SavedDiseasesScreen() {
  const router = useRouter();
  const [savedList, setSavedList] = useState<SavedDisease[]>([]);

  const loadSaved = async () => {
    const list = await getSavedDiseases();
    setSavedList(list);
  };

  useEffect(() => {
    loadSaved();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSaved();
    }, [])
  );

  const handleRemove = (item: SavedDisease) => {
    Alert.alert(
      "Remove Favorite",
      `Remove "${item.disease}" from your saved diseases?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            await removeFavoriteDisease(item.id);
            await loadSaved();
          },
        },
      ]
    );
  };

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
            activeOpacity={0.7}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Saved Diseases</Text>
          <View style={styles.headerSpace} />
        </View>

        {/* Total Count Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{savedList.length}</Text>
          <Text style={styles.summaryLabel}>Favorite Diseases Saved</Text>
        </View>

        {/* Saved List or Empty State */}
        {savedList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔖</Text>
            <Text style={styles.emptyTitle}>No saved diseases</Text>
            <Text style={styles.emptySubtitle}>
              Bookmark diseases from your scan results to reference them here anytime.
            </Text>

            <TouchableOpacity
              style={styles.scanBtn}
              onPress={() => router.push("/(tabs)/scan")}
              activeOpacity={0.85}
            >
              <Text style={styles.scanBtnText}>📷 Scan a Crop Leaf</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {savedList.map((item) => (
              <View key={item.id} style={styles.diseaseCard}>
                {/* Header Row: Crop & Remove */}
                <View style={styles.cardHeader}>
                  <View style={styles.cropBadge}>
                    <Text style={styles.cropBadgeText}>🌿 {item.crop}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => handleRemove(item)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.removeBtnText}>✕ Remove</Text>
                  </TouchableOpacity>
                </View>

                {/* Disease Name */}
                <Text style={styles.diseaseName}>{item.disease}</Text>

                {/* Symptoms Preview */}
                {item.symptoms && item.symptoms.length > 0 ? (
                  <View style={styles.symptomsBox}>
                    <Text style={styles.symptomsTitle}>Key Symptoms:</Text>
                    {item.symptoms.slice(0, 3).map((sym, idx) => (
                      <View key={idx} style={styles.symptomRow}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.symptomText}>{sym}</Text>
                      </View>
                    ))}
                    {item.symptoms.length > 3 && (
                      <Text style={styles.moreSymptoms}>
                        +{item.symptoms.length - 3} more symptoms
                      </Text>
                    )}
                  </View>
                ) : null}

                {/* View Result Details Action */}
                <TouchableOpacity
                  style={styles.viewDetailsBtn}
                  onPress={() =>
                    router.push({
                      pathname: "/result",
                      params: {
                        isPlantLeaf: "true",
                        crop: item.crop,
                        disease: item.disease,
                        confidence: "95",
                        symptoms: JSON.stringify(item.symptoms || []),
                        diagnosisStatus: "identified",
                      },
                    })
                  }
                  activeOpacity={0.8}
                >
                  <Text style={styles.viewDetailsText}>View Disease Info ➔</Text>
                </TouchableOpacity>
              </View>
            ))}
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
    lineHeight: 20,
    marginBottom: 20,
  },
  scanBtn: {
    backgroundColor: "#2E7D32",
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: "center",
  },
  scanBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  diseaseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E0EAE0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cropBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cropBadgeText: {
    color: "#2E7D32",
    fontSize: 13,
    fontWeight: "700",
  },
  removeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#FFEBEE",
  },
  removeBtnText: {
    fontSize: 12,
    color: "#D32F2F",
    fontWeight: "600",
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A2B1A",
    marginBottom: 10,
  },
  symptomsBox: {
    backgroundColor: "#F7FAF7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8EFE8",
  },
  symptomsTitle: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#3F563F",
    marginBottom: 6,
  },
  symptomRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  bullet: {
    fontSize: 13,
    color: "#2E7D32",
    marginRight: 6,
    lineHeight: 18,
  },
  symptomText: {
    fontSize: 13,
    color: "#4A5A4A",
    lineHeight: 18,
    flex: 1,
  },
  moreSymptoms: {
    fontSize: 11.5,
    color: "#7D8C7D",
    fontStyle: "italic",
    marginTop: 2,
    marginLeft: 10,
  },
  viewDetailsBtn: {
    alignSelf: "flex-end",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2E7D32",
  },
});

