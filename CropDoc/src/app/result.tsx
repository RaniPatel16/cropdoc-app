
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { isRecognizedCrop } from "../services/diagnosisService";
import { API_CONFIG } from "../services/apiConfig";
import {
  isDiseaseSaved,
  saveFavoriteDisease,
  removeFavoriteDisease,
  generateSavedDiseaseId,
} from "../services/storageService";

interface DiseaseInfo {
  name: string;
  crop: string;
  description: string;
  symptoms: string[];
  causes: string[];
  prevention: string[];
  treatment: string[];
  sources: {
    organization: string;
    title: string;
    url?: string;
  }[];
  safetyNote?: string;
  verificationStatus: string;
}

export default function ResultScreen() {
  const router = useRouter();

  const {
    imageUri,
    isPlantLeaf,
    crop,
    disease,
    confidence,
    selectedCrop,
    description,
    symptoms,
    possibleCauses,
    conditions,
    prevention,
    treatment,
    diagnosisStatus,
    message,
  } = useLocalSearchParams<{
    imageUri?: string;
    isPlantLeaf?: string;
    crop?: string;
    disease?: string;
    confidence?: string;
    selectedCrop?: string;
    description?: string;
    symptoms?: string;
    possibleCauses?: string;
    conditions?: string;
    prevention?: string;
    treatment?: string;
    diagnosisStatus?: string;
    message?: string;
  }>();

  const isNotLeaf =
    isPlantLeaf === "false" || diagnosisStatus === "not_a_leaf";

  const isNonAgri =
    diagnosisStatus === "non_agricultural_plant";

  const isHealthy =
    disease?.trim().toLowerCase() === "healthy" ||
    diagnosisStatus === "healthy";

  const isUncertain =
    diagnosisStatus === "uncertain" ||
    (!isNotLeaf && !isNonAgri && !isHealthy && !disease);

  const isIdentified =
    !isNotLeaf && !isNonAgri && !isHealthy && !isUncertain && Boolean(disease);

  const candidateCrop = (crop || selectedCrop || "").trim();

  const resolvedCrop =
    candidateCrop.toLowerCase() === "chili"
      ? "Chilli"
      : candidateCrop || (isUncertain ? "Agricultural Crop" : "Crop");

  const confidenceNumber = confidence
    ? Number(confidence)
    : 0;

  // Convert route parameters into arrays
  const parseList = (value?: string | string[]): string[] => {
    if (!value) return [];

    const raw = Array.isArray(value) ? value[0] : value;

    try {
      const parsed = JSON.parse(raw);

      return Array.isArray(parsed)
        ? parsed.filter((item) => typeof item === "string")
        : [];
    } catch {
      return [];
    }
  };

  const aiDescription =
    typeof description === "string" ? description.trim() : "";
  const aiSymptoms = parseList(symptoms);
  const aiPossibleCauses = parseList(possibleCauses);
  const aiConditions = parseList(conditions);
  const aiPrevention = parseList(prevention);
  const aiTreatment = parseList(treatment);

  // MongoDB disease information
  const [diseaseInfo, setDiseaseInfo] =
    useState<DiseaseInfo | null>(null);

  const [loadingDisease, setLoadingDisease] =
    useState(false);

  const [diseaseError, setDiseaseError] =
    useState("");

  // Favorite / Bookmark state
  const [isSaved, setIsSaved] = useState(false);

  // Check if current disease is already bookmarked
  useEffect(() => {
    let active = true;
    if (isIdentified && resolvedCrop && disease) {
      isDiseaseSaved(resolvedCrop, disease).then((saved) => {
        if (active) setIsSaved(saved);
      });
    } else {
      setIsSaved(false);
    }
    return () => {
      active = false;
    };
  }, [isIdentified, resolvedCrop, disease]);

  const handleToggleFavorite = async () => {
    if (!resolvedCrop || !disease) return;
    const diseaseId = generateSavedDiseaseId(resolvedCrop, disease);

    if (isSaved) {
      await removeFavoriteDisease(diseaseId);
      setIsSaved(false);
    } else {
      const symptomsList =
        diseaseInfo?.symptoms && diseaseInfo.symptoms.length > 0
          ? diseaseInfo.symptoms
          : aiSymptoms;

      const success = await saveFavoriteDisease({
        id: diseaseId,
        crop: resolvedCrop,
        disease: disease.trim(),
        symptoms: symptomsList,
      });
      if (success) {
        setIsSaved(true);
      }
    }
  };

  // Fetch only verified disease information
  useEffect(() => {
    let isMounted = true;

    async function fetchDiseaseDetails() {
      // Only search MongoDB for an identified disease
      if (!isIdentified || !disease || !resolvedCrop) {
        setDiseaseInfo(null);
        setDiseaseError("");
        setLoadingDisease(false);
        return;
      }

      try {
        setLoadingDisease(true);
        setDiseaseError("");

        const url =
          `${API_CONFIG.baseURL}/api/diseases/` +
          `${encodeURIComponent(resolvedCrop)}/` +
          `${encodeURIComponent(disease.trim())}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!isMounted) return;

        if (!response.ok || !data.success || !data.disease) {
          setDiseaseInfo(null);
          setDiseaseError(
            data.message ||
              "Verified information is not available in the database."
          );
          return;
        }

        if (data.disease.verificationStatus !== "verified") {
          setDiseaseInfo(null);
          setDiseaseError(
            "This disease information has not been verified yet."
          );
          return;
        }

        setDiseaseInfo(data.disease);
      } catch (error) {
        console.error("Disease information error:", error);

        if (isMounted) {
          setDiseaseInfo(null);
          setDiseaseError(
            "Unable to connect to the disease information service."
          );
        }
      } finally {
        if (isMounted) {
          setLoadingDisease(false);
        }
      }
    }

    fetchDiseaseDetails();

    return () => {
      isMounted = false;
    };
  }, [isIdentified, resolvedCrop, disease]);

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

          <Text style={styles.headerTitle}>
            {isNotLeaf ? "Analysis Result" : "Diagnosis Result"}
          </Text>

          <View style={styles.headerSpace} />
        </View>

        {/* Scanned image */}
        {imageUri ? (
          <View style={styles.scannedImageCard}>
            <Image
              source={{ uri: imageUri }}
              style={styles.scannedImage}
            />

            <View
              style={
                isNotLeaf
                  ? styles.imageBadgeRejected
                  : isNonAgri
                  ? styles.imageBadgeWarning
                  : styles.imageBadge
              }
            >
              <Text style={styles.imageBadgeText}>
                {isNotLeaf
                  ? "⚠️ Not a Crop Leaf"
                  : isNonAgri
                  ? "🌿 Non-Agricultural Plant"
                  : "📸 Scanned Leaf"}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Not a leaf */}
        {isNotLeaf ? (
          <View>
            <View style={styles.rejectedCard}>
              <Text style={styles.rejectedEmoji}>❌</Text>

              <Text style={styles.rejectedTitle}>
                Unable to Analyze
              </Text>

              <Text style={styles.rejectedDescription}>
                {message ||
                  "This image could not be identified as an agricultural crop leaf. Please upload a clear crop leaf photo."}
              </Text>
            </View>

            <View style={styles.guideCard}>
              <Text style={styles.guideTitle}>
                💡 Tips for a Successful Scan
              </Text>

              {[
                "Focus closely on a single crop leaf showing symptoms",
                "Ensure natural bright daylight without strong shadows",
                "Avoid people, faces, rooms, floors, vehicles, or animals",
                "Keep your hand steady so the image is sharp and not blurry",
              ].map((item, index) => (
                <View key={index} style={styles.guideItem}>
                  <Text style={styles.guideBullet}>•</Text>
                  <Text style={styles.guideText}>{item}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => router.push("/(tabs)/scan")}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>
                🔄 Try Again
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.homeBtn}
              onPress={() => router.replace("/(tabs)/home")}
              activeOpacity={0.85}
            >
              <Text style={styles.homeBtnText}>
                🏠 Back to Home
              </Text>
            </TouchableOpacity>
          </View>
        ) : isNonAgri ? (
          <View>
            <View style={styles.warningCard}>
              <Text style={styles.warningEmoji}>🌿</Text>

              <Text style={styles.warningTitle}>
                Non-Agricultural Plant
              </Text>

              <Text style={styles.warningDescription}>
                {message ||
                  "This plant appears to be outside CropDoc's agricultural crop scope. CropDoc is specialized for agricultural field and horticultural crops."}
              </Text>
            </View>

            <View style={styles.guideCard}>
              <Text style={styles.guideTitle}>
                🌱 Supported Agricultural Crops
              </Text>
              <Text style={styles.guideText}>
                CropDoc supports agricultural crops including Tomato, Chilli, Potato,
                Brinjal, Okra, Onion, Garlic, Cucumber, Wheat, Rice, Maize, Cotton,
                Groundnut, Soybean, Sugarcane, Mango, Banana, Grapes, Citrus, Papaya,
                Watermelon, and other crops.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => router.push("/(tabs)/scan")}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>
                🔄 Scan an Agricultural Leaf
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.homeBtn}
              onPress={() => router.replace("/(tabs)/home")}
              activeOpacity={0.85}
            >
              <Text style={styles.homeBtnText}>
                🏠 Back to Home
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {/* Diagnosis card */}
            <View style={styles.diseaseCard}>
              <Text style={styles.diseaseEmoji}>🌿</Text>

              <Text style={styles.cropName}>
                {resolvedCrop}
              </Text>

              <Text style={styles.diseaseName}>
                {isHealthy
                  ? "Healthy Leaf"
                  : isUncertain
                  ? "Diagnosis Needs Confirmation"
                  : disease || "Diagnosis Needs Confirmation"}
              </Text>

              {confidenceNumber > 0 ? (
                <View style={styles.confidenceRow}>
                  <View style={styles.confidenceBarBg}>
                    <View
                      style={[
                        styles.confidenceBarFill,
                        {
                          width: `${Math.min(
                            100,
                            Math.max(0, confidenceNumber)
                          )}%`,
                        },
                      ]}
                    />
                  </View>

                  <Text style={styles.confidenceText}>
                    {confidenceNumber}% AI confidence estimate
                  </Text>
                </View>
              ) : (
                <Text style={styles.confidenceText}>
                  AI confidence score not available
                </Text>
              )}

              {confidenceNumber > 0 &&
                confidenceNumber < 60 && (
                  <View style={styles.lowConfidenceBadge}>
                    <Text style={styles.lowConfidenceText}>
                      ⚠️ Low confidence. A clearer image and
                      expert confirmation are recommended.
                    </Text>
                  </View>
                )}

              {/* Bookmark / Favorite Action for Identified Disease */}
              {isIdentified && (
                <TouchableOpacity
                  style={[
                    styles.bookmarkBtn,
                    isSaved && styles.bookmarkBtnSaved,
                  ]}
                  onPress={handleToggleFavorite}
                  activeOpacity={0.8}
                >
                  <Text style={styles.bookmarkBtnText}>
                    {isSaved ? "★ Saved in Favorites" : "☆ Save to Favorites"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Healthy result */}
            {isHealthy && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  🌱 Plant Health Status
                </Text>

                <Text style={styles.listText}>
                  {message ||
                    "The leaf appears healthy based on this AI image analysis. No clear disease symptoms were identified in the uploaded image."}
                </Text>

                {aiSymptoms.length > 0 && (
                  <InfoSection
                    title="Visual Observations"
                    icon="🌿"
                    items={aiSymptoms}
                  />
                )}

                <View style={styles.safetyCard}>
                  <Text style={styles.safetyNote}>
                    Continue monitoring your crop regularly.
                    An AI image check cannot guarantee that a
                    plant is completely disease-free.
                  </Text>
                </View>
              </View>
            )}

            {/* Uncertain diagnosis */}
            {isUncertain && (
              <View style={styles.warningCard}>
                <Text style={styles.warningEmoji}>ℹ️</Text>

                <Text style={styles.warningTitle}>
                  Diagnosis Needs Confirmation
                </Text>

                <Text style={styles.warningDescription}>
                  {message ||
                    "The symptoms or image are not clear enough for a reliable diagnosis. Please upload a clearer image."}
                </Text>

                {aiSymptoms.length > 0 && (
                  <InfoSection
                    title="Visible Symptoms"
                    icon="🔍"
                    items={aiSymptoms}
                  />
                )}

                {aiPossibleCauses.length > 0 && (
                  <InfoSection
                    title="Possible Causes (Preliminary AI)"
                    icon="ℹ️"
                    items={aiPossibleCauses}
                  />
                )}

                <Text style={styles.safetyNote}>
                  Do not apply pesticides or chemical treatments
                  based only on an uncertain AI result.
                </Text>
              </View>
            )}

            {/* Loading state */}
            {loadingDisease && (
              <View style={styles.statusCard}>
                <ActivityIndicator
                  size="large"
                  color="#2E7D32"
                />

                <Text style={styles.statusTitle}>
                  Loading disease information...
                </Text>

                <Text style={styles.statusDescription}>
                  Connecting to CropDoc database.
                </Text>
              </View>
            )}

            {/* AI observations when MongoDB has no verified record */}
            {!loadingDisease &&
              !diseaseInfo &&
              !isHealthy &&
              isIdentified && (
                <View>
                  <View style={styles.warningCard}>
                    <Text style={styles.warningEmoji}>ℹ️</Text>

                    <Text style={styles.warningTitle}>
                      AI Diagnosis – Not Yet Verified
                    </Text>

                    <Text style={styles.warningDescription}>
                      {diseaseError ||
                        "This disease information is not yet verified in the CropDoc database."}
                    </Text>

                    <Text style={styles.safetyNote}>
                      The diagnosis below is AI-generated based on visible leaf
                      features and has not been independently verified.
                      Consult a local agricultural expert before applying any
                      chemical treatments.
                    </Text>
                  </View>

                  {aiDescription ? (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>
                        📖 Disease Overview (AI-Generated)
                      </Text>
                      <Text style={styles.listText}>{aiDescription}</Text>
                    </View>
                  ) : null}

                  {aiSymptoms.length > 0 && (
                    <InfoSection
                      title="Visible Symptoms (AI-Observed)"
                      icon="🔍"
                      items={aiSymptoms}
                    />
                  )}

                  {aiPossibleCauses.length > 0 && (
                    <InfoSection
                      title="Possible Causes"
                      icon="🦠"
                      items={aiPossibleCauses}
                    />
                  )}

                  {aiConditions.length > 0 && (
                    <InfoSection
                      title="Favourable Disease Conditions"
                      icon="🌦️"
                      items={aiConditions}
                    />
                  )}

                  {aiPrevention.length > 0 && (
                    <InfoSection
                      title="Prevention & Cultural Methods"
                      icon="🛡️"
                      items={aiPrevention}
                    />
                  )}

                  {aiTreatment.length > 0 && (
                    <InfoSection
                      title="Safe Management Advice"
                      icon="🌿"
                      items={aiTreatment}
                    />
                  )}
                </View>
              )}

            {/* Verified MongoDB disease information */}
            {!loadingDisease && diseaseInfo && (
              <View>
                <View style={styles.verifiedBadgeCard}>
                  <Text style={styles.verifiedBadgeText}>
                    🛡️ Verified Information (CropDoc Database)
                  </Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    📖 About This Disease
                  </Text>

                  <Text style={styles.listText}>
                    {diseaseInfo.description}
                  </Text>
                </View>

                <InfoSection
                  title="Identified Symptoms"
                  icon="🔍"
                  items={diseaseInfo.symptoms}
                />

                <InfoSection
                  title="Possible Causes"
                  icon="🦠"
                  items={diseaseInfo.causes}
                />

                <InfoSection
                  title="Treatment & Management"
                  icon="🌿"
                  items={diseaseInfo.treatment}
                />

                <InfoSection
                  title="Prevention Tips"
                  icon="🛡️"
                  items={diseaseInfo.prevention}
                />

                {diseaseInfo.sources?.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      📚 Reference Sources
                    </Text>

                    {diseaseInfo.sources.map((source, index) => (
                      <View key={index} style={styles.sourceItem}>
                        <Text style={styles.sourceName}>
                          {source.organization}
                        </Text>

                        <Text style={styles.sourceTitle}>
                          {source.title}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {diseaseInfo.safetyNote ? (
                  <View style={styles.safetyCard}>
                    <Text style={styles.safetyNote}>
                      ⚠️ {diseaseInfo.safetyNote}
                    </Text>
                  </View>
                ) : null}
              </View>
            )}

            {/* Navigation buttons */}
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => router.push("/(tabs)/scan")}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>
                📷 Scan Another Leaf
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => router.push("/(tabs)/history")}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryBtnText}>
                📋 View Scan History
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.savedDiseasesBtn}
              onPress={() => router.push("/saved-diseases")}
              activeOpacity={0.85}
            >
              <Text style={styles.savedDiseasesBtnText}>
                🔖 View Saved Diseases
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.homeBtn}
              onPress={() => router.replace("/(tabs)/home")}
              activeOpacity={0.85}
            >
              <Text style={styles.homeBtnText}>
                🏠 Back to Home
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Reusable information section
function InfoSection({
  title,
  icon,
  items,
}: {
  title: string;
  icon: string;
  items: string[];
}) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>{icon}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      {items.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8F4",
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 44,
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
    fontSize: 18,
    fontWeight: "800",
    color: "#1A2B1A",
  },

  headerSpace: {
    width: 40,
  },

  scannedImageCard: {
    width: "100%",
    height: 220,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 18,
    position: "relative",
    backgroundColor: "#E0E0E0",
  },

  scannedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  imageBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  imageBadgeRejected: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(198, 40, 40, 0.85)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  imageBadgeWarning: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(230, 81, 0, 0.85)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  verifiedBadgeCard: {
    backgroundColor: "#E8F5E9",
    borderWidth: 1,
    borderColor: "#A5D6A7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    alignItems: "center",
  },

  verifiedBadgeText: {
    color: "#1B5E20",
    fontSize: 13,
    fontWeight: "700",
  },

  imageBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  rejectedCard: {
    backgroundColor: "#FFEBEE",
    borderWidth: 1.5,
    borderColor: "#FFCDD2",
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    marginBottom: 18,
  },

  rejectedEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },

  rejectedTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#C62828",
    marginBottom: 8,
  },

  rejectedDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: "#424242",
    textAlign: "center",
  },

  guideCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 18,
    padding: 18,
    marginBottom: 22,
  },

  guideTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A2B1A",
    marginBottom: 10,
  },

  guideItem: {
    flexDirection: "row",
    marginBottom: 8,
    paddingRight: 10,
  },

  guideBullet: {
    fontSize: 14,
    color: "#2E7D32",
    marginRight: 8,
  },

  guideText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#555555",
    flex: 1,
  },

  diseaseCard: {
    backgroundColor: "#2E7D32",
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
    marginBottom: 20,
  },

  diseaseEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },

  cropName: {
    fontSize: 16,
    color: "#C8E6C9",
    fontWeight: "600",
    marginBottom: 2,
  },

  diseaseName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 14,
    textAlign: "center",
  },

  confidenceRow: {
    width: "100%",
    alignItems: "center",
  },

  confidenceBarBg: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 4,
    marginBottom: 6,
  },

  confidenceBarFill: {
    height: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
  },

  confidenceText: {
    fontSize: 14,
    color: "#C8E6C9",
    fontWeight: "600",
    textAlign: "center",
  },

  lowConfidenceBadge: {
    marginTop: 12,
    backgroundColor: "rgba(255, 193, 7, 0.25)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  lowConfidenceText: {
    fontSize: 12,
    color: "#FFF9C4",
    fontWeight: "600",
    textAlign: "center",
  },

  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DDE8DD",
    marginBottom: 14,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A2B1A",
    marginBottom: 10,
  },

  listItem: {
    flexDirection: "row",
    marginBottom: 8,
    paddingRight: 8,
  },

  bullet: {
    fontSize: 14,
    color: "#2E7D32",
    marginRight: 8,
    marginTop: 1,
  },

  listText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4A5A4A",
    flex: 1,
  },

  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#DDE8DD",
  },

  statusTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A2B1A",
    marginTop: 12,
  },

  statusDescription: {
    fontSize: 13,
    color: "#687568",
    marginTop: 6,
  },

  warningCard: {
    backgroundColor: "#FFF8E1",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFE082",
    padding: 18,
    alignItems: "center",
    marginBottom: 16,
  },

  warningEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },

  warningTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#795548",
    textAlign: "center",
    marginBottom: 8,
  },

  warningDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: "#5D5147",
    textAlign: "center",
  },

  safetyCard: {
    backgroundColor: "#FFF8E1",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },

  safetyNote: {
    fontSize: 13,
    lineHeight: 20,
    color: "#795548",
  },

  sourceItem: {
    marginBottom: 12,
  },

  sourceName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2E7D32",
  },

  sourceTitle: {
    fontSize: 13,
    color: "#4A5A4A",
    marginTop: 3,
  },

  primaryBtn: {
    backgroundColor: "#2E7D32",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 10,
  },

  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C8DEC8",
    marginBottom: 10,
  },

  secondaryBtnText: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "700",
  },

  bookmarkBtn: {
    marginTop: 14,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.45)",
    alignItems: "center",
  },

  bookmarkBtnSaved: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },

  bookmarkBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  savedDiseasesBtn: {
    backgroundColor: "#F0F8F0",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C8DEC8",
    marginBottom: 10,
  },

  savedDiseasesBtnText: {
    color: "#2E7D32",
    fontSize: 15,
    fontWeight: "700",
  },

  homeBtn: {
    paddingVertical: 12,
    alignItems: "center",
  },

  homeBtnText: {
    color: "#7A847A",
    fontSize: 14,
    fontWeight: "600",
  },
});
