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

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome to</Text>
            <Text style={styles.logoText}>🌱 CropDoc</Text>
          </View>

          <View style={styles.profileCircle}>
            <Text style={styles.profileIcon}>👨‍🌾</Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroCard}>
          <Text style={styles.heroEmoji}>🌿</Text>

          <Text style={styles.heroTitle}>
            Keep Your Crops Healthy
          </Text>

          <Text style={styles.heroDescription}>
            Identify crop leaf diseases quickly and get treatment
            recommendations with just one photo.
          </Text>

          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => router.push("/scan")}
            activeOpacity={0.8}
          >
            <Text style={styles.scanIcon}>📷</Text>
            <Text style={styles.scanButtonText}>Scan Leaf</Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <Text style={styles.sectionTitle}>What CropDoc Can Do</Text>

        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🔍</Text>
            <Text style={styles.featureTitle}>Detect Disease</Text>
            <Text style={styles.featureDescription}>
              Identify common crop diseases from leaf images.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>💊</Text>
            <Text style={styles.featureTitle}>Get Treatment</Text>
            <Text style={styles.featureDescription}>
              Receive organic and chemical treatment suggestions.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📋</Text>
            <Text style={styles.featureTitle}>Scan History</Text>
            <Text style={styles.featureDescription}>
              Keep track of your previous crop diagnoses.
            </Text>
          </View>
        </View>

        {/* How It Works */}
        <Text style={styles.sectionTitle}>How It Works</Text>

        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Scan a Leaf</Text>
              <Text style={styles.stepDescription}>
                Take a photo or choose an image from your gallery.
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Analyze</Text>
              <Text style={styles.stepDescription}>
                CropDoc analyzes the leaf and identifies the disease.
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Get Treatment</Text>
              <Text style={styles.stepDescription}>
                View disease information and treatment recommendations.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAF7",
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  greeting: {
    fontSize: 15,
    color: "#667366",
    marginBottom: 3,
  },

  logoText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2E7D32",
  },

  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E4F1E5",
    justifyContent: "center",
    alignItems: "center",
  },

  profileIcon: {
    fontSize: 24,
  },

  heroCard: {
    backgroundColor: "#2E7D32",
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
  },

  heroEmoji: {
    fontSize: 42,
    marginBottom: 12,
  },

  heroTitle: {
    fontSize: 27,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 34,
    marginBottom: 10,
  },

  heroDescription: {
    fontSize: 15,
    lineHeight: 23,
    color: "#E8F5E9",
    marginBottom: 22,
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
    fontSize: 20,
    marginRight: 8,
  },

  scanButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2E7D32",
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#1F2D20",
    marginBottom: 15,
  },

  featuresContainer: {
    gap: 12,
    marginBottom: 30,
  },

  featureCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5EDE5",
  },

  featureIcon: {
    fontSize: 28,
    marginBottom: 8,
  },

  featureTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#263426",
    marginBottom: 5,
  },

  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B756B",
  },

  stepsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5EDE5",
  },

  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  stepNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  stepNumberText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#2E7D32",
  },

  stepContent: {
    flex: 1,
  },

  stepTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#263426",
    marginBottom: 3,
  },

  stepDescription: {
    fontSize: 14,
    lineHeight: 19,
    color: "#6B756B",
  },
});