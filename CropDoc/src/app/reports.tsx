import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import {
  getPdfReports,
  deletePdfReportRecord,
  PdfReportRecord,
} from "../services/storageService";
import { generateAndSharePdfReport } from "../services/pdfReportService";
import { useLanguage } from "../context/LanguageContext";

export default function ReportsScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [reports, setReports] = useState<PdfReportRecord[]>([]);
  const [openingId, setOpeningId] = useState<string | null>(null);

  const loadReports = async () => {
    const list = await getPdfReports();
    setReports(list);
  };

  useEffect(() => {
    loadReports();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

  const handleOpenReport = async (item: PdfReportRecord) => {
    try {
      setOpeningId(item.id);
      await generateAndSharePdfReport(item.reportData);
    } catch (err) {
      console.log("Error opening PDF report:", err);
      Alert.alert("Report Error", "Unable to open or share this PDF report.");
    } finally {
      setOpeningId(null);
    }
  };

  const handleDeleteReport = (item: PdfReportRecord) => {
    Alert.alert(
      t("deleteReportTitle"),
      `${t("deleteReportMsg")} (${item.crop} - ${item.disease})`,
      [
        { text: t("cancelBtn"), style: "cancel" },
        {
          text: t("deleteBtn"),
          style: "destructive",
          onPress: async () => {
            await deletePdfReportRecord(item.id);
            await loadReports();
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
          <Text style={styles.headerTitle}>{t("reportsTitle")}</Text>
          <View style={styles.headerSpace} />
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{reports.length}</Text>
          <Text style={styles.summaryLabel}>{t("reportsCount")}</Text>
        </View>

        {/* Reports List or Empty State */}
        {reports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📄</Text>
            <Text style={styles.emptyTitle}>{t("noReportsYet")}</Text>
            <Text style={styles.emptySubtitle}>
              {t("noReportsDesc")}
            </Text>

            <TouchableOpacity
              style={styles.scanBtn}
              onPress={() => router.push("/(tabs)/scan")}
              activeOpacity={0.85}
            >
              <Text style={styles.scanBtnText}>{t("scanCropLeafBtn")}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {reports.map((item) => (
              <View key={item.id} style={styles.reportCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cropBadge}>
                    <Text style={styles.cropBadgeText}>🌿 {item.crop}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDeleteReport(item)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.deleteBtnText}>{t("deleteBtn")}</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.diseaseName}>{item.disease}</Text>

                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>
                    {item.confidence > 0 ? `${item.confidence}% ${t("confidenceLabel")} · ` : ""}
                    {item.date}
                  </Text>
                </View>

                {/* Open & Share Button */}
                <TouchableOpacity
                  style={styles.openBtn}
                  onPress={() => handleOpenReport(item)}
                  activeOpacity={0.8}
                  disabled={openingId === item.id}
                >
                  {openingId === item.id ? (
                    <View style={styles.loadingRow}>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                      <Text style={[styles.openBtnText, { marginLeft: 8 }]}>
                        {t("openingReport")}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.openBtnText}>{t("openSharePdfBtn")}</Text>
                  )}
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
  reportCard: {
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
  deleteBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#FFEBEE",
  },
  deleteBtnText: {
    fontSize: 12,
    color: "#D32F2F",
    fontWeight: "600",
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A2B1A",
    marginBottom: 6,
  },
  metaRow: {
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12.5,
    color: "#6B756B",
    fontWeight: "500",
  },
  openBtn: {
    backgroundColor: "#2E7D32",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  openBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

