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

export default function AboutScreen() {
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
          <Text style={styles.headerTitle}>About CropDoc</Text>
          <View style={styles.headerSpace} />
        </View>

        {/* Brand Hero */}
        <View style={styles.heroCard}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoEmoji}>🌱</Text>
          </View>
          <Text style={styles.appName}>CropDoc</Text>
          <Text style={styles.version}>Version 1.0.0 (Release Build 100)</Text>
          <Text style={styles.tagline}>
            Smart Plant Pathology & Crop Protection
          </Text>
        </View>

        {/* Purpose */}
        <Text style={styles.sectionHeader}>Purpose of the Application</Text>
        <View style={styles.card}>
          <Text style={styles.bodyText}>
            CropDoc was engineered to democratize access to agronomic expertise
            for smallholder farmers and agricultural communities.
          </Text>
          <Text style={[styles.bodyText, { marginTop: 10 }]}>
            By transforming everyday smartphone cameras into field diagnostics
            laboratories, CropDoc enables early identification of foliar
            infections before diseases spread across entire fields.
          </Text>
        </View>

        {/* Key Pillars */}
        <Text style={styles.sectionHeader}>Key Capabilities</Text>
        <View style={styles.card}>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>🔬</Text>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Instant Field Analysis</Text>
              <Text style={styles.featureDesc}>
                Rapid classification of foliar blight, rust, and leaf spot.
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>🌿</Text>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Dual Treatment Pathways</Text>
              <Text style={styles.featureDesc}>
                Eco-friendly organic options alongside targeted chemical sprays.
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>🛡️</Text>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Preventive Care</Text>
              <Text style={styles.featureDesc}>
                Practical spacing, watering, and crop rotation strategies.
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Designed for Agricultural Resilience</Text>
          <Text style={styles.copyright}>© 2026 CropDoc. All rights reserved.</Text>
        </View>
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
    paddingBottom: 36,
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
    color: "#1F2D20",
  },
  headerSpace: {
    width: 40,
  },

  // Hero
  heroCard: {
    backgroundColor: "#2E7D32",
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logoEmoji: {
    fontSize: 32,
  },
  appName: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  version: {
    fontSize: 12,
    color: "#C8E6C9",
    fontWeight: "600",
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    color: "#E8F5E9",
  },

  sectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7D6B",
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E0EAE0",
    marginBottom: 20,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#3B4B3B",
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2D20",
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 13,
    color: "#6B756B",
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F4F0",
    marginVertical: 12,
  },

  footer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7D6B",
  },
  copyright: {
    fontSize: 11,
    color: "#9AABA9",
    marginTop: 4,
  },
});
