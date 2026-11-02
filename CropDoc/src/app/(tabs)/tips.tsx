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
  const [selectedCategory, setSelectedCategory] = useState("All");

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
            <Text style={styles.subtitle}>Farming Best Practices</Text>
            <Text style={styles.title}>🌿 Crop Tips</Text>
          </View>
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
          <Text style={styles.scanButtonText}>📷 Scan Leaf For Diagnosis</Text>
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
