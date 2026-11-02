import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();

  // Simple UI state placeholders
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlineModeEnabled, setOfflineModeEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

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
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerSpace} />
        </View>

        {/* 1. Notifications */}
        <Text style={styles.sectionHeader}>Alerts & Notifications</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>Seasonal Disease Alerts</Text>
              <Text style={styles.rowSubtitle}>
                Notify when weather creates high blight or fungal risk
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#D8E2D8", true: "#A5D6A7" }}
              thumbColor={notificationsEnabled ? "#2E7D32" : "#F4F8F4"}
            />
          </View>
        </View>

        {/* 2. Language */}
        <Text style={styles.sectionHeader}>Language & Region</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() =>
              Alert.alert(
                "Language Selection",
                "Language switching (English, Hindi, Regional languages) will be configurable in an upcoming release."
              )
            }
            activeOpacity={0.7}
          >
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>Display Language</Text>
              <Text style={styles.rowSubtitle}>English (Default)</Text>
            </View>
            <Text style={styles.rowArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* 3. Appearance */}
        <Text style={styles.sectionHeader}>Appearance & Theme</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>Dark Mode (Appearance)</Text>
              <Text style={styles.rowSubtitle}>
                Toggle high-contrast nighttime palette
              </Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: "#D8E2D8", true: "#A5D6A7" }}
              thumbColor={darkModeEnabled ? "#2E7D32" : "#F4F8F4"}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>Offline Diagnostic Cache</Text>
              <Text style={styles.rowSubtitle}>
                Keep core disease models accessible without network
              </Text>
            </View>
            <Switch
              value={offlineModeEnabled}
              onValueChange={setOfflineModeEnabled}
              trackColor={{ false: "#D8E2D8", true: "#A5D6A7" }}
              thumbColor={offlineModeEnabled ? "#2E7D32" : "#F4F8F4"}
            />
          </View>
        </View>

        {/* Reset / Cache */}
        <Text style={styles.sectionHeader}>Data & Storage</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() =>
              Alert.alert(
                "Clear Cache",
                "Diagnostic cache has been cleared successfully."
              )
            }
            activeOpacity={0.7}
          >
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>Clear Image Cache</Text>
              <Text style={styles.rowSubtitle}>Frees up local device storage</Text>
            </View>
            <Text style={styles.rowArrow}>›</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E0EAE0",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  rowInfo: {
    flex: 1,
    paddingRight: 14,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2D20",
    marginBottom: 2,
  },
  rowSubtitle: {
    fontSize: 12,
    color: "#7A8A7A",
    lineHeight: 17,
  },
  rowArrow: {
    fontSize: 22,
    color: "#A0B0A0",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F4F0",
    marginVertical: 10,
  },
});
