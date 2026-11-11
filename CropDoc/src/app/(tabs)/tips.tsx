import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useLanguage } from "../../context/LanguageContext";

const CROP_CATEGORIES = ["All", "Vegetables", "Grains", "Organic Care"];

const TIPS_DATA = [
  {
    id: "1",
    category: "Organic Care",
    emoji: "🌱",
    title: "Neem Oil Foliar Spray",
    desc: "Mix 2-3ml cold-pressed neem oil with 1ml liquid soap per liter of water. Spray at dusk to avoid leaf scorching.",
    badge: "Eco Remedy",
  },
  {
    id: "2",
    category: "Vegetables",
    emoji: "🍅",
    title: "Preventing Tomato Blight",
    desc: "Water strictly at the soil base. Mulch with clean straw to keep soil-borne fungus from splashing onto lower leaves.",
    badge: "Tomato Care",
  },
  {
    id: "3",
    category: "Vegetables",
    emoji: "🥔",
    title: "Potato Late Blight Guard",
    desc: "Hill soil high around potato stems. Harvest during dry spells and discard any soft or discolored tubers immediately.",
    badge: "Potato Guard",
  },
  {
    id: "4",
    category: "Grains",
    emoji: "🌾",
    title: "Rice Blast & Brown Spot Care",
    desc: "Avoid excess nitrogen fertilizer. Maintain balanced field drainage and rotate with green manure crops every off-season.",
    badge: "Field Health",
  },
  {
    id: "5",
    category: "Organic Care",
    emoji: "💧",
    title: "Drip Irrigation Best Practices",
    desc: "Drip systems keep foliage dry, reducing fungal spore germination by up to 70% compared to overhead sprinkler watering.",
    badge: "Water Wise",
  },
];

export default function TipsScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dailyTipIndex, setDailyTipIndex] = useState(0);

  const DAILY_CROP_TIPS = [
    {
      crop: "Rice",
      emoji: "🌾",
      title: t("tipRiceTitle"),
      tip: t("tipRiceText"),
    },
    {
      crop: "Wheat",
      emoji: "🌾",
      title: t("tipWheatTitle"),
      tip: t("tipWheatText"),
    },
    {
      crop: "Cotton",
      emoji: "🌱",
      title: t("tipCottonTitle"),
      tip: t("tipCottonText"),
    },
    {
      crop: "Tomato",
      emoji: "🍅",
      title: t("tipTomatoTitle"),
      tip: t("tipTomatoText"),
    },
    {
      crop: "Potato",
      emoji: "🥔",
      title: t("tipPotatoTitle"),
      tip: t("tipPotatoText"),
    },
    {
      crop: "Chilli",
      emoji: "🌶️",
      title: t("tipChilliTitle"),
      tip: t("tipChilliText"),
    },
  ];

  const currentDailyTip = DAILY_CROP_TIPS[dailyTipIndex];

  const handleNextDailyTip = () => {
    setDailyTipIndex((prev) => (prev + 1) % DAILY_CROP_TIPS.length);
  };

  const filteredTips =
    selectedCategory === "All"
      ? TIPS_DATA
      : TIPS_DATA.filter((tip) => tip.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.subtitle}>{t("farmingBestPractices")}</Text>
            <Text style={styles.title}>🌿 {t("cropTipsTitle")}</Text>
          </View>
        </View>

        {/* Daily Crop Care Tip Card */}
        <View style={styles.dailyCard}>
          <View style={styles.dailyHeader}>
            <View style={styles.dailyBadge}>
              <Text style={styles.dailyBadgeEmoji}>{currentDailyTip.emoji}</Text>
              <Text style={styles.dailyBadgeText}>{currentDailyTip.crop}</Text>
            </View>
            <Text style={styles.dailyCounter}>
              {t("tipIndicator")} {dailyTipIndex + 1} {t("of")} {DAILY_CROP_TIPS.length}
            </Text>
          </View>

          <Text style={styles.dailyTitle}>{currentDailyTip.title}</Text>
          <Text style={styles.dailyText}>{currentDailyTip.tip}</Text>

          <TouchableOpacity
            style={styles.nextTipBtn}
            onPress={handleNextDailyTip}
            activeOpacity={0.8}
          >
            <Text style={styles.nextTipBtnText}>{t("nextTip")}</Text>
          </TouchableOpacity>
        </View>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {CROP_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tip Cards */}
        {filteredTips.map((tip) => (
          <View key={tip.id} style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <View style={styles.emojiBox}>
                <Text style={styles.emoji}>{tip.emoji}</Text>
              </View>
              <View style={styles.badgeBox}>
                <Text style={styles.badgeText}>{tip.badge}</Text>
              </View>
            </View>

            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipDesc}>{tip.desc}</Text>
          </View>
        ))}

        {/* Action Button: Scan from Tips */}
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => router.push("/(tabs)/scan")}
          activeOpacity={0.85}
        >
          <Text style={styles.scanButtonText}>📷 {t("scanForDiagnosis")}</Text>
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
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7D6B",
    fontWeight: "600",
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1F2D20",
  },

  // Daily Crop Care Tip Card
  dailyCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: "#C8E6C9",
  },
  dailyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  dailyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  dailyBadgeEmoji: {
    fontSize: 15,
    marginRight: 6,
  },
  dailyBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2E7D32",
  },
  dailyCounter: {
    fontSize: 12,
    fontWeight: "600",
    color: "#5B7A5B",
  },
  dailyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1B3B1B",
    marginBottom: 6,
  },
  dailyText: {
    fontSize: 13.5,
    lineHeight: 20,
    color: "#2E4D2E",
    marginBottom: 14,
  },
  nextTipBtn: {
    alignSelf: "flex-end",
    backgroundColor: "#2E7D32",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  nextTipBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  // Categories
  categoryRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE5DC",
  },
  categoryChipActive: {
    backgroundColor: "#2E7D32",
    borderColor: "#2E7D32",
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4B554B",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },

  // Tip Card
  tipCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E0EAE0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  emojiBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0F8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 22,
  },
  badgeBox: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2E7D32",
  },
  tipTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1F2D20",
    marginBottom: 6,
  },
  tipDesc: {
    fontSize: 14,
    color: "#5B6B5B",
    lineHeight: 21,
  },

  // Scan Button
  scanButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
