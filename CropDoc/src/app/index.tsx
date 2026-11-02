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
// Mock data for "Recent Scan" section
// Later this will come from real scan history
// -------------------------------------------------------
const recentScan = {
  crop: "Tomato",
  disease: "Early Blight",
  confidence: 94,
  date: "2 Nov 2026",
  emoji: "🍅",
};

export default function HomeScreen() {
  const router = useRouter();
  // router.push("/scan")    → goes to Scan screen
  // router.push("/history") → goes to History screen

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome to</Text>
            <Text style={styles.logoText}>🌱 CropDoc</Text>
          </View>

          {/* Tap clipboard icon → History screen */}
          <TouchableOpacity
            style={styles.historyIconBtn}
            onPress={() => router.push("/history")}
            activeOpacity={0.7}
          >
            <Text style={styles.historyIcon}>📋</Text>
          </TouchableOpacity>
        </View>

        {/* ── Hero Banner ── */}
        <View style={styles.heroCard}>
          <Text style={styles.heroEmoji}>🌿</Text>
          <Text style={styles.heroTitle}>Keep Your Crops Healthy</Text>
          <Text style={styles.heroDescription}>
            Identify crop leaf diseases quickly and get treatment
            recommendations with just one photo.
          </Text>

          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => router.push("/scan")}
            activeOpacity={0.85}
          >
            <Text style={styles.scanIcon}>📷</Text>
            <Text style={styles.scanButtonText}>Scan Leaf Now</Text>
          </TouchableOpacity>
        </View>

        {/* ── Quick Navigation Row ── */}
        <View style={styles.quickNavRow}>
          <TouchableOpacity
            style={[styles.quickCard, styles.quickCardGreen]}
            onPress={() => router.push("/scan")}
            activeOpacity={0.8}
          >
            <Text style={styles.quickIcon}>🔍</Text>
            <Text style={styles.quickTitle}>New Scan</Text>
            <Text style={styles.quickSubtitle}>Take photo / gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push("/history")}
            activeOpacity={0.8}
          >
            <Text style={styles.quickIcon}>📜</Text>
            <Text style={styles.quickTitle}>Past Scans</Text>
            <Text style={styles.quickSubtitle}>View diagnosis log</Text>
          </TouchableOpacity>
        </View>

        {/* ── Recent Scan Section ── */}
        <Text style={styles.sectionTitle}>Recent Scan</Text>

        <TouchableOpacity
          style={styles.recentCard}
          onPress={() => router.push("/history")}
          activeOpacity={0.8}
        >
          <View style={styles.recentIconBox}>
            <Text style={styles.recentCropEmoji}>{recentScan.emoji}</Text>
          </View>

          <View style={styles.recentInfo}>
            <Text style={styles.recentCropName}>{recentScan.crop}</Text>
            <Text style={styles.recentDisease}>
              {recentScan.disease} detected
            </Text>
            <Text style={styles.recentMeta}>
              {recentScan.date} · {recentScan.confidence}% confidence
            </Text>
          </View>

          <Text style={styles.recentArrow}>›</Text>
        </TouchableOpacity>

        {/* ── Feature Cards ── */}
        <Text style={styles.sectionTitle}>What CropDoc Can Do</Text>

        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🔬</Text>
            <Text style={styles.featureTitle}>Detect Disease</Text>
            <Text style={styles.featureDescription}>
              Identify common crop diseases from a single leaf photo.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>💊</Text>
            <Text style={styles.featureTitle}>Treatment Advice</Text>
            <Text style={styles.featureDescription}>
              Get organic remedies and chemical fungicide suggestions.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🛡️</Text>
            <Text style={styles.featureTitle}>Prevention Tips</Text>
            <Text style={styles.featureDescription}>
              Learn spacing, watering, and soil care best practices.
            </Text>
          </View>
        </View>

        {/* ── How It Works ── */}
        <Text style={styles.sectionTitle}>How It Works</Text>

        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Scan a Leaf</Text>
              <Text style={styles.stepDescription}>
                Snap a clear photo or pick one from your gallery.
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Instant Analysis</Text>
              <Text style={styles.stepDescription}>
                CropDoc checks the leaf for disease symptoms.
              </Text>
            </View>
          </View>

          <View style={[styles.step, { marginBottom: 0 }]}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>View Remedies</Text>
              <Text style={styles.stepDescription}>
                Follow treatment steps to save your crop harvest.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// -------------------------------------------------------
// Styles — green / agriculture theme
// -------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8F4",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 44,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: "#6B7D6B",
    fontWeight: "500",
    marginBottom: 2,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2E7D32",
  },
  historyIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },
  historyIcon: {
    fontSize: 20,
  },

  // Hero
  heroCard: {
    backgroundColor: "#2E7D32",
    borderRadius: 22,
    padding: 22,
    marginBottom: 20,
  },
  heroEmoji: {
    fontSize: 38,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 30,
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: "#C8E6C9",
    marginBottom: 18,
  },
  scanButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scanIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E7D32",
  },

  // Quick Nav
  quickNavRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  quickCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DDE8DD",
  },
  quickCardGreen: {
    backgroundColor: "#F0F8F0",
    borderColor: "#C8DEC8",
  },
  quickIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  quickTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2D20",
    marginBottom: 2,
  },
  quickSubtitle: {
    fontSize: 12,
    color: "#7A847A",
  },

  // Section title
  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1A2B1A",
    marginBottom: 12,
  },

  // Recent scan card
  recentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#DDE8DD",
    marginBottom: 24,
  },
  recentIconBox: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: "#FFEBEE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recentCropEmoji: {
    fontSize: 22,
  },
  recentInfo: {
    flex: 1,
  },
  recentCropName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A2B1A",
  },
  recentDisease: {
    fontSize: 13,
    color: "#C62828",
    fontWeight: "600",
    marginTop: 1,
  },
  recentMeta: {
    fontSize: 12,
    color: "#8A9A8A",
    marginTop: 3,
  },
  recentArrow: {
    fontSize: 24,
    color: "#B0C4B0",
    marginLeft: 6,
  },

  // Feature cards
  featuresContainer: {
    gap: 12,
    marginBottom: 24,
  },
  featureCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DDE8DD",
  },
  featureIcon: {
    fontSize: 26,
    marginBottom: 6,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#263426",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: "#6B756B",
  },

  // Steps
  stepsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DDE8DD",
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  stepBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepBadgeText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#2E7D32",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#263426",
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: "#6B756B",
  },
});