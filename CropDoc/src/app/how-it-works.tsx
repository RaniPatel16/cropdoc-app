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

const STEPS = [
  {
    step: 1,
    emoji: "📷",
    title: "Take a Leaf Photo",
    desc: "Use the live camera viewfinder or choose an affected plant leaf photo from your gallery. Ensure the leaf is well-lit and in clear focus.",
  },
  {
    step: 2,
    emoji: "🔬",
    title: "CropDoc Analyzes the Leaf",
    desc: "The diagnostic system examines the visual patterns, lesions, discolorations, and symptoms on the foliage.",
  },
  {
    step: 3,
    emoji: "🎯",
    title: "Disease is Identified",
    desc: "CropDoc outputs the detected disease name, infected crop variety, and a visual confidence percentage meter.",
  },
  {
    step: 4,
    emoji: "💊",
    title: "Treatment is Provided",
    desc: "Receive immediate organic remedies (such as neem oil solutions) and recommended chemical fungicides with proper dosage instructions.",
  },
  {
    step: 5,
    emoji: "📋",
    title: "Diagnosis is Saved",
    desc: "The scan log is securely archived in your local history so you can monitor crop recovery and field health over the harvest cycle.",
  },
];

export default function HowItWorksScreen() {
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
          <Text style={styles.headerTitle}>How It Works</Text>
          <View style={styles.headerSpace} />
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroEmoji}>💡</Text>
          <Text style={styles.heroTitle}>Simple 5-Step Diagnostics</Text>
          <Text style={styles.heroSubtitle}>
            CropDoc assists farmers in catching plant diseases early to protect crop yields.
          </Text>
        </View>

        {/* 5 Steps */}
        {STEPS.map((item) => (
          <View key={item.step} style={styles.stepCard}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>{item.step}</Text>
            </View>

            <View style={styles.stepContent}>
              <View style={styles.stepTitleRow}>
                <Text style={styles.stepEmoji}>{item.emoji}</Text>
                <Text style={styles.stepTitle}>{item.title}</Text>
              </View>
              <Text style={styles.stepDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}

        {/* Action Button */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push("/(tabs)/scan")}
          activeOpacity={0.85}
        >
          <Text style={styles.actionBtnText}>📷 Try Leaf Scan Now</Text>
        </TouchableOpacity>
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
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  heroEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: "#C8E6C9",
    lineHeight: 19,
  },

  // Steps
  stepCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0EAE0",
  },
  stepNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  stepNumberText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#2E7D32",
  },
  stepContent: {
    flex: 1,
  },
  stepTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  stepEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2D20",
  },
  stepDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: "#5B6B5B",
  },

  // Action
  actionBtn: {
    backgroundColor: "#2E7D32",
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  actionBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
