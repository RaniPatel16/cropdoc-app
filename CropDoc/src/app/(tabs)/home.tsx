import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.78, 320);

// -------------------------------------------------------
// Mock data for "Recent Scan" section
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

  // Side Drawer Animation State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDrawer = (navigateCallback?: () => void) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDrawerOpen(false);
      if (navigateCallback) {
        navigateCallback();
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header with ☰ Hamburger Menu ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome to</Text>
            <Text style={styles.logoText}>🌱 CropDoc</Text>
          </View>

          {/* Three-Line Hamburger Menu Button (☰) */}
          <TouchableOpacity
            style={styles.hamburgerBtn}
            onPress={openDrawer}
            activeOpacity={0.7}
          >
            <View style={styles.hamburgerIconContainer}>
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
            </View>
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
            onPress={() => router.push("/(tabs)/scan")}
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
            onPress={() => router.push("/(tabs)/scan")}
            activeOpacity={0.8}
          >
            <Text style={styles.quickIcon}>🔍</Text>
            <Text style={styles.quickTitle}>New Scan</Text>
            <Text style={styles.quickSubtitle}>Take photo / gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push("/(tabs)/history")}
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
          onPress={() => router.push("/(tabs)/history")}
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

        {/* ── How It Works Section ── */}
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

      {/* ── Smooth Left Slide-In Drawer Modal ── */}
      <Modal
        visible={drawerOpen}
        transparent={true}
        animationType="none"
        onRequestClose={() => closeDrawer()}
      >
        <View style={styles.modalRoot}>
          {/* Backdrop */}
          <TouchableWithoutFeedback onPress={() => closeDrawer()}>
            <Animated.View
              style={[
                styles.drawerBackdrop,
                { opacity: fadeAnim },
              ]}
            />
          </TouchableWithoutFeedback>

          {/* Sliding Drawer Container */}
          <Animated.View
            style={[
              styles.drawerContainer,
              {
                width: DRAWER_WIDTH,
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            {/* Drawer Header */}
            <View style={styles.drawerHeader}>
              <View style={styles.drawerBrandRow}>
                <Text style={styles.drawerLogoEmoji}>🌱</Text>
                <Text style={styles.drawerBrandName}>CropDoc</Text>
              </View>

              <TouchableOpacity
                style={styles.closeDrawerBtn}
                onPress={() => closeDrawer()}
                activeOpacity={0.7}
              >
                <Text style={styles.closeDrawerIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.drawerDivider} />

            {/* Drawer Navigation List */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.drawerScroll}
            >
              {/* 1. Home */}
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => closeDrawer(() => router.push("/(tabs)/home"))}
                activeOpacity={0.75}
              >
                <Text style={styles.drawerItemIcon}>🏠</Text>
                <Text style={styles.drawerItemText}>Home</Text>
              </TouchableOpacity>

              {/* 2. Scan Leaf */}
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => closeDrawer(() => router.push("/(tabs)/scan"))}
                activeOpacity={0.75}
              >
                <Text style={styles.drawerItemIcon}>📷</Text>
                <Text style={styles.drawerItemText}>Scan Leaf</Text>
              </TouchableOpacity>

              {/* 3. Scan History */}
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() =>
                  closeDrawer(() => router.push("/(tabs)/history"))
                }
                activeOpacity={0.75}
              >
                <Text style={styles.drawerItemIcon}>📋</Text>
                <Text style={styles.drawerItemText}>Scan History</Text>
              </TouchableOpacity>

              {/* 4. Crop Tips */}
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => closeDrawer(() => router.push("/(tabs)/tips"))}
                activeOpacity={0.75}
              >
                <Text style={styles.drawerItemIcon}>🌿</Text>
                <Text style={styles.drawerItemText}>Crop Tips</Text>
              </TouchableOpacity>

              <View style={styles.drawerSectionDivider} />

              {/* 5. How It Works */}
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => closeDrawer(() => router.push("/how-it-works"))}
                activeOpacity={0.75}
              >
                <Text style={styles.drawerItemIcon}>💡</Text>
                <Text style={styles.drawerItemText}>How It Works</Text>
              </TouchableOpacity>

              {/* 6. Settings */}
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => closeDrawer(() => router.push("/settings"))}
                activeOpacity={0.75}
              >
                <Text style={styles.drawerItemIcon}>⚙️</Text>
                <Text style={styles.drawerItemText}>Settings</Text>
              </TouchableOpacity>

              {/* 7. About CropDoc */}
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => closeDrawer(() => router.push("/about"))}
                activeOpacity={0.75}
              >
                <Text style={styles.drawerItemIcon}>ℹ️</Text>
                <Text style={styles.drawerItemText}>About CropDoc</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Drawer Footer */}
            <View style={styles.drawerFooter}>
              <Text style={styles.drawerFooterVersion}>CropDoc v1.0.0</Text>
              <Text style={styles.drawerFooterTag}>Smart Crop Protection</Text>
            </View>
          </Animated.View>
        </View>
      </Modal>
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
    paddingBottom: 32,
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

  // Hamburger Button (☰ - Three Horizontal Lines)
  hamburgerBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#E8F5E9",
    borderWidth: 1,
    borderColor: "#C8E6C9",
    justifyContent: "center",
    alignItems: "center",
  },
  hamburgerIconContainer: {
    width: 20,
    height: 15,
    justifyContent: "space-between",
    alignItems: "center",
  },
  hamburgerLine: {
    width: 20,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: "#2E7D32",
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

  // -------------------------------------------------------
  // Side Drawer Styles
  // -------------------------------------------------------
  modalRoot: {
    flex: 1,
    flexDirection: "row",
  },
  drawerBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  drawerContainer: {
    flex: 1,
    height: "100%",
    backgroundColor: "#FFFFFF",
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 16,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
  },
  drawerBrandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  drawerLogoEmoji: {
    fontSize: 26,
    marginRight: 8,
  },
  drawerBrandName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2E7D32",
  },
  closeDrawerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F4F0",
    alignItems: "center",
    justifyContent: "center",
  },
  closeDrawerIcon: {
    fontSize: 16,
    color: "#5B6B5B",
    fontWeight: "700",
  },
  drawerDivider: {
    height: 1,
    backgroundColor: "#EAF0EA",
    marginBottom: 12,
  },
  drawerScroll: {
    paddingVertical: 4,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  drawerItemIcon: {
    fontSize: 20,
    marginRight: 14,
    width: 28,
    textAlign: "center",
  },
  drawerItemText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2D20",
  },
  drawerSectionDivider: {
    height: 1,
    backgroundColor: "#F0F4F0",
    marginVertical: 10,
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: "#EAF0EA",
    paddingTop: 14,
    alignItems: "center",
  },
  drawerFooterVersion: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7D6B",
  },
  drawerFooterTag: {
    fontSize: 11,
    color: "#9AABA9",
    marginTop: 2,
  },
});
