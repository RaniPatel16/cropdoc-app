import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type LanguageCode = "en" | "gu" | "hi";

export interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  t: (key: string) => string;
}

const LANGUAGE_STORAGE_KEY = "@cropdoc_app_language";

export const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Navigation & Tabs
    tabHome: "Home",
    tabScan: "Scan",
    tabHistory: "History",
    tabTips: "Crop Tips",
    
    // Side Drawer
    drawerHome: "Home",
    drawerScan: "Scan Leaf",
    drawerHistory: "Scan History",
    drawerSaved: "Saved Diseases",
    drawerReports: "Diagnosis Reports",
    drawerTips: "Crop Tips",
    drawerHowItWorks: "How It Works",
    drawerSettings: "Settings",
    drawerAbout: "About CropDoc",
    drawerLanguage: "Language / ભાષા / भाषा",
    
    // Home Screen
    welcome: "Welcome to",
    keepCropsHealthy: "Keep Your Crops Healthy",
    heroDesc: "Identify crop leaf diseases quickly and get treatment recommendations with just one photo.",
    scanLeafNow: "Scan Leaf Now",
    newScan: "New Scan",
    takePhotoGallery: "Take photo / gallery",
    pastScans: "Past Scans",
    viewDiagnosisLog: "View diagnosis log",
    recentScan: "Recent Scan",
    whatCropDocCanDo: "What CropDoc Can Do",
    detectDisease: "Detect Disease",
    detectDiseaseDesc: "Identify common crop diseases from a single leaf photo.",
    treatmentAdvice: "Treatment Advice",
    treatmentAdviceDesc: "Get organic remedies and chemical fungicide suggestions.",
    preventionTips: "Prevention Tips",
    preventionTipsDesc: "Learn spacing, watering, and soil care best practices.",
    howItWorks: "How It Works",
    step1Title: "Scan a Leaf",
    step1Desc: "Snap a clear photo or pick one from your gallery.",
    step2Title: "Instant Analysis",
    step2Desc: "CropDoc checks the leaf for disease symptoms.",
    step3Title: "View Remedies",
    step3Desc: "Follow treatment steps to save your crop harvest.",
    
    // Scan Screen
    scanTitle: "CropDoc - Scan Leaf",
    scanDescription: "Capture or select a crop leaf photo to identify its crop and possible diseases using AI.",
    takePhotoBtn: "Take Photo",
    chooseGalleryBtn: "Choose from Gallery",
    removeImageBtn: "Remove Image",
    selectCropOptional: "Select Crop (Optional)",
    selectCropHint: "You can select a crop as a hint, or leave it empty and let AI identify the crop automatically.",
    enterCropName: "Enter crop name",
    analyzingLeaf: "Analyzing your crop leaf...",
    analyzeLeafBtn: "Analyze Leaf",
    capturePhotoBtn: "Capture Photo",
    cancelBtn: "Cancel",
    cameraPermissionNeeded: "Camera Permission Needed",
    cameraPermissionDesc: "CropDoc needs camera access so you can take clear leaf photos for disease diagnosis.",
    grantPermissionBtn: "Grant Permission",
    openSettingsBtn: "Open Settings",
    zoomLabel: "Zoom",
    
    // History Screen
    historyTitle: "Scan History",
    clearBtn: "Clear",
    totalScans: "Total Scans",
    noScansYet: "No scans yet",
    noScansDesc: "Your analyzed crop scans will appear here.",
    startFirstScanBtn: "📷 Start Your First Scan",
    startNewScanBtn: "📷 Start New Scan",
    clearHistoryTitle: "Clear Scan History",
    clearHistoryMsg: "Are you sure you want to delete all saved scan history? This cannot be undone.",
    clearAllBtn: "Clear All",
    confidenceLabel: "Confidence",
    
    // Saved Diseases Screen
    savedDiseasesTitle: "Saved Diseases",
    savedDiseasesCount: "Favorite Diseases Saved",
    noSavedDiseases: "No saved diseases",
    noSavedDiseasesDesc: "Bookmark diseases from your scan results to reference them here anytime.",
    scanCropLeafBtn: "📷 Scan a Crop Leaf",
    removeFavoriteTitle: "Remove Favorite",
    removeFavoriteMsg: "Remove this from your saved diseases?",
    removeBtn: "✕ Remove",
    keySymptoms: "Key Symptoms:",
    viewDiseaseInfo: "View Disease Info ➔",
    
    // Diagnosis Reports Screen
    reportsTitle: "Diagnosis Reports",
    reportsCount: "Generated PDF Reports",
    noReportsYet: "No diagnosis reports yet",
    noReportsDesc: "When you download or export PDF reports from your scan diagnosis results, they will appear here for easy access.",
    openSharePdfBtn: "📄 Open & Share PDF",
    openingReport: "Opening Report...",
    deleteReportTitle: "Delete Report",
    deleteReportMsg: "Delete this diagnosis report?",
    deleteBtn: "✕ Delete",
    
    // Result Screen
    diagnosisResultTitle: "Diagnosis Result",
    analysisResultTitle: "Analysis Result",
    scannedLeafBadge: "📸 Scanned Leaf",
    notCropLeafBadge: "⚠️ Not a Crop Leaf",
    nonAgriBadge: "🌿 Non-Agricultural Plant",
    unableToAnalyze: "Unable to Analyze",
    tipsForScan: "💡 Tips for a Successful Scan",
    tryAgainBtn: "🔄 Try Again",
    backToHomeBtn: "🏠 Back to Home",
    nonAgriPlant: "Non-Agricultural Plant",
    scanAgriLeafBtn: "🔄 Scan an Agricultural Leaf",
    confidenceAiEstimate: "AI confidence estimate",
    confidenceNotAvailable: "AI confidence score not available",
    lowConfidenceWarning: "⚠️ Low confidence. A clearer image and expert confirmation are recommended.",
    saveToFavorites: "☆ Save to Favorites",
    savedInFavorites: "★ Saved in Favorites",
    plantHealthStatus: "🌱 Plant Health Status",
    visualObservations: "🌿 Visual Observations",
    visibleSymptoms: "🔍 Visible Symptoms",
    possibleCauses: "🦠 Possible Causes",
    favourableConditions: "🌦️ Favourable Conditions",
    preventionMethods: "🛡️ Prevention & Cultural Methods",
    safeManagementAdvice: "🌿 Safe Management Advice",
    aboutThisDisease: "📖 About This Disease",
    treatmentManagement: "🌿 Treatment & Management",
    preventionTipsSection: "🛡️ Prevention Tips",
    referenceSources: "📚 Reference Sources",
    verifiedBadge: "🛡️ Verified Information (CropDoc Database)",
    unverifiedBadge: "ℹ️ AI Diagnosis – Not Yet Verified",
    loadingDiseaseInfo: "Loading disease information...",
    connectingDb: "Connecting to CropDoc database.",
    downloadPdfReport: "📄 Download PDF Report",
    generatingPdfReport: "Generating PDF Report...",
    scanAnotherLeaf: "📷 Scan Another Leaf",
    viewScanHistoryBtn: "📋 View Scan History",
    viewSavedDiseasesBtn: "🔖 View Saved Diseases",
    
    // Tips Screen
    farmingBestPractices: "Farming Best Practices",
    cropTipsTitle: "Crop Tips",
    tipIndicator: "Tip",
    of: "of",
    nextTip: "Next Tip ➔",
    scanForDiagnosis: "Scan Leaf For Diagnosis",
    
    // Crop Care Tips: Rice
    tipRiceTitle: "Water Management (AWD)",
    tipRiceText: "Use Alternate Wetting and Drying (AWD) to optimize irrigation water, allowing the soil to aerate periodically between watering cycles without stressing the crop.",
    
    // Crop Care Tips: Wheat
    tipWheatTitle: "Balanced Nitrogen Nutrition",
    tipWheatText: "Avoid late over-application of nitrogen. Excess vegetative growth produces dense, humid canopies that favor rust and powdery mildew development.",
    
    // Crop Care Tips: Cotton
    tipCottonTitle: "Early Pest Scouting",
    tipCottonText: "Inspect the undersides of leaves early in the morning for aphid and whitefly colonies, and keep field borders clean to reduce alternate host weeds.",
    
    // Crop Care Tips: Tomato
    tipTomatoTitle: "Base Watering & Spacing",
    tipTomatoText: "Direct irrigation water at the soil base rather than over the foliage. Keeping leaves dry minimizes fungal spore splash and reduces early blight pressure.",
    
    // Crop Care Tips: Potato
    tipPotatoTitle: "Hilling Soil Around Stems",
    tipPotatoText: "Hill soil up around potato stems as plants grow to shield developing tubers from direct sunlight and prevent greening and solanine buildup.",
    
    // Crop Care Tips: Chilli
    tipChilliTitle: "Canopy Airflow & Pest Checks",
    tipChilliText: "Maintain adequate plant spacing for good airflow and monitor regularly for thrips and whiteflies, which are common vectors for chilli leaf curl.",

    // Settings
    settingsTitle: "Settings",
    languageSettings: "Language & Region",
    displayLanguage: "Display Language",
    selectLanguage: "Select Preferred Language",
  },
  
  gu: {
    // Navigation & Tabs
    tabHome: "મુખ્ય પેજ",
    tabScan: "સ્કેન",
    tabHistory: "ઇતિહાસ",
    tabTips: "પાક ટિપ્સ",
    
    // Side Drawer
    drawerHome: "મુખ્ય પેજ",
    drawerScan: "પાંદડું સ્કેન કરો",
    drawerHistory: "સ્કેન ઇતિહાસ",
    drawerSaved: "સાચવેલા રોગો",
    drawerReports: "નિદાન રિપોર્ટ્સ",
    drawerTips: "પાક સંભાળ ટિપ્સ",
    drawerHowItWorks: "કેવી રીતે કાર્ય કરે છે",
    drawerSettings: "સેટિંગ્સ",
    drawerAbout: "ક્રોપડોક વિશે",
    drawerLanguage: "ભાષા બદલો",
    
    // Home Screen
    welcome: "સ્વાગત છે",
    keepCropsHealthy: "તમારા પાકને તંદુરસ્ત રાખો",
    heroDesc: "માત્ર એક ફોટોથી પાકના રોગોને ઓળખો અને યોગ્ય ઉપચાર મેળવો.",
    scanLeafNow: "પાંદડું સ્કેન કરો",
    newScan: "નવું સ્કેન",
    takePhotoGallery: "ફોટો લો / ગેલેરીમાંથી પસંદ કરો",
    pastScans: "પાછલા સ્કેન",
    viewDiagnosisLog: "ઇતિહાસ જુઓ",
    recentScan: "તાજેતરનું સ્કેન",
    whatCropDocCanDo: "ક્રોપડોક શું કરી શકે છે",
    detectDisease: "રોગની ઓળખ",
    detectDiseaseDesc: "એક પાંદડાના ફોટા પરથી રોગ ઓળખો.",
    treatmentAdvice: "ઉપચાર સલાહ",
    treatmentAdviceDesc: "સલામત ઓર્ગેનિક અને ભલામણ કરેલ ઉપાયો મેળવો.",
    preventionTips: "રોગ અટકાવવાની ટિપ્સ",
    preventionTipsDesc: "પાકનું અંતર, પાણી અને જમીનની સંભાળ શીખો.",
    howItWorks: "કેવી રીતે કાર્ય કરે છે",
    step1Title: "પાંદડું સ્કેન કરો",
    step1Desc: "રોગગ્રસ્ત પાંદડાનો સ્પષ્ટ ફોટો લો.",
    step2Title: "ત્વરિત તપાસ",
    step2Desc: "ક્રોપડોક પાંદડાના લક્ષણોની તપાસ કરે છે.",
    step3Title: "ઉપાયો મેળવો",
    step3Desc: "પાકને બચાવવા માટે ઉપાયો અનુસરો.",
    
    // Scan Screen
    scanTitle: "ક્રોપડોક - પાંદડું સ્કેન કરો",
    scanDescription: "AI દ્વારા પાક અને તેના સંભવિત રોગોને ઓળખવા માટે પાંદડાનો ફોટો લો અથવા પસંદ કરો.",
    takePhotoBtn: "કેમેરાથી ફોટો લો",
    chooseGalleryBtn: "ગેલેરીમાંથી પસંદ કરો",
    removeImageBtn: "ફોટો દૂર કરો",
    selectCropOptional: "પાક પસંદ કરો (વૈકલ્પિક)",
    selectCropHint: "તમે સંકેત તરીકે પાક પસંદ કરી શકો છો, અથવા ખાલી રાખી AI ને આપમેળે ઓળખવા દો.",
    enterCropName: "પાકનું નામ લખો",
    analyzingLeaf: "પાંદડાનું વિશ્લેષણ થઈ રહ્યું છે...",
    analyzeLeafBtn: "રોગ તપાસો",
    capturePhotoBtn: "ફોટો ક્લિક કરો",
    cancelBtn: "રદ કરો",
    cameraPermissionNeeded: "કેમેરા પરવાનગી જરૂરી છે",
    cameraPermissionDesc: "પાંદડાના ફોટા દ્વારા રોગ નિદાન કરવા માટે ક્રોપડોકને કેમેરાની મંજૂરી આપો.",
    grantPermissionBtn: "પરવાનગી આપો",
    openSettingsBtn: "સેટિંગ્સ ખોલો",
    zoomLabel: "ઝૂમ",
    
    // History Screen
    historyTitle: "સ્કેન ઇતિહાસ",
    clearBtn: "સાફ કરો",
    totalScans: "કુલ સ્કેન",
    noScansYet: "હજી સુધી કોઈ સ્કેન નથી",
    noScansDesc: "તમારા સ્કેન કરેલા પાકના પરિણામો અહીં દેખાશે.",
    startFirstScanBtn: "📷 પ્રથમ સ્કેન શરૂ કરો",
    startNewScanBtn: "📷 નવું સ્કેન શરૂ કરો",
    clearHistoryTitle: "ઇતિહાસ સાફ કરો",
    clearHistoryMsg: "શું તમે ખરેખર બધો સ્કેન ઇતિહાસ કાઢી નાખવા માંગો છો? આ પાછું મેળવી શકાશે નહીં.",
    clearAllBtn: "બધું સાફ કરો",
    confidenceLabel: "વિશ્વાસ દર",
    
    // Saved Diseases Screen
    savedDiseasesTitle: "સાચવેલા રોગો",
    savedDiseasesCount: "સાચવેલા મનપસંદ રોગો",
    noSavedDiseases: "કોઈ રોગ સાચવેલ નથી",
    noSavedDiseasesDesc: "તમારા સ્કેન પરિણામોમાંથી રોગોને સાચવો જેથી અહીં ગમે ત્યારે જોઈ શકો.",
    scanCropLeafBtn: "📷 પાકનું પાંદડું સ્કેન કરો",
    removeFavoriteTitle: "દૂર કરો",
    removeFavoriteMsg: "શું આ રોગને સાચવેલી યાદીમાંથી દૂર કરવો છે?",
    removeBtn: "✕ દૂર કરો",
    keySymptoms: "મુખ્ય લક્ષણો:",
    viewDiseaseInfo: "રોગની માહિતી જુઓ ➔",
    
    // Diagnosis Reports Screen
    reportsTitle: "નિદાન રિપોર્ટ્સ",
    reportsCount: "પીડીએફ રિપોર્ટ્સ",
    noReportsYet: "હજી કોઈ રિપોર્ટ નથી",
    noReportsDesc: "જ્યારે તમે સ્કેન પરિણામોમાંથી પીડીએફ રિપોર્ટ ડાઉનલોડ કરશો, ત્યારે તે અહીં દેખાશે.",
    openSharePdfBtn: "📄 પીડીએફ ખોલો અને શેર કરો",
    openingReport: "રિપોર્ટ ખુલી રહ્યો છે...",
    deleteReportTitle: "રિપોર્ટ કાઢી નાખો",
    deleteReportMsg: "શું આ નિદાન રિપોર્ટ કાઢી નાખવો છે?",
    deleteBtn: "✕ કાઢી નાખો",
    
    // Result Screen
    diagnosisResultTitle: "નિદાન પરિણામ",
    analysisResultTitle: "વિશ્લેષણ પરિણામ",
    scannedLeafBadge: "📸 સ્કેન કરેલ પાંદડું",
    notCropLeafBadge: "⚠️ પાકનું પાંદડું નથી",
    nonAgriBadge: "🌿 બિન-ખેતી છોડ",
    unableToAnalyze: "વિશ્લેષણ કરવામાં અસમર્થ",
    tipsForScan: "💡 સફળ સ્કેન માટે ટિપ્સ",
    tryAgainBtn: "🔄 ફરી પ્રયાસ કરો",
    backToHomeBtn: "🏠 મુખ્ય પેજ પર જાઓ",
    nonAgriPlant: "બિન-ખેતી છોડ",
    scanAgriLeafBtn: "🔄 ખેતી પાક સ્કેન કરો",
    confidenceAiEstimate: "AI અંદાજિત વિશ્વાસ સ્કોર",
    confidenceNotAvailable: "વિશ્વાસ સ્કોર ઉપલબ્ધ નથી",
    lowConfidenceWarning: "⚠️ ઓછો વિશ્વાસ સ્કોર. સ્પષ્ટ ફોટો લેવો અને નિષ્ણાતની સલાહ લેવી હિતાવહ છે.",
    saveToFavorites: "☆ મનપસંદમાં સાચવો",
    savedInFavorites: "★ મનપસંદમાં સાચવેલ છે",
    plantHealthStatus: "🌱 પાક સ્વાસ્થ્ય સ્થિતિ",
    visualObservations: "🌿 જોવા મળેલ લક્ષણો",
    visibleSymptoms: "🔍 દેખીતા લક્ષણો",
    possibleCauses: "🦠 સંભવિત કારણો",
    favourableConditions: "🌦️ અનુકૂળ વાતાવરણ",
    preventionMethods: "🛡️ નિવારણ અને ખેતી પદ્ધતિઓ",
    safeManagementAdvice: "🌿 સલામત વ્યવસ્થાપન સલાહ",
    aboutThisDisease: "📖 આ રોગ વિશે માહિતી",
    treatmentManagement: "🌿 ઉપચાર અને વ્યવસ્થાપન",
    preventionTipsSection: "🛡️ નિવારણ ટિપ્સ",
    referenceSources: "📚 સંદર્ભ સ્ત્રોતો",
    verifiedBadge: "🛡️ ચકાસાયેલ માહિતી (ક્રોપડોક ડેટાબેઝ)",
    unverifiedBadge: "ℹ️ AI નિદાન – ચકાસણી બાકી",
    loadingDiseaseInfo: "રોગની વિગતો લોડ થઈ રહી છે...",
    connectingDb: "ક્રોપડોક ડેટાબેઝ સાથે જોડાઈ રહ્યું છે.",
    downloadPdfReport: "📄 PDF રિપોર્ટ ડાઉનલોડ કરો",
    generatingPdfReport: "PDF રિપોર્ટ બની રહ્યો છે...",
    scanAnotherLeaf: "📷 બીજું પાંદડું સ્કેન કરો",
    viewScanHistoryBtn: "📋 સ્કેન ઇતિહાસ જુઓ",
    viewSavedDiseasesBtn: "🔖 સાચવેલા રોગો જુઓ",
    
    // Tips Screen
    farmingBestPractices: "ખેતીની શ્રેષ્ઠ પદ્ધતિઓ",
    cropTipsTitle: "પાક સંભાળ ટિપ્સ",
    tipIndicator: "ટિપ",
    of: "માંથી",
    nextTip: "આગળની ટિપ ➔",
    scanForDiagnosis: "નિદાન માટે સ્કેન કરો",
    
    // Crop Care Tips: Rice
    tipRiceTitle: "પાણી વ્યવસ્થાપન (AWD)",
    tipRiceText: "પાણીના યોગ્ય ઉપયોગ માટે વૈકલ્પિક ભીના અને સૂકા કરવાની પદ્ધતિ (AWD) અપનાવો, જેથી જમીનને પૂરતી હવા મળી રહે.",
    
    // Crop Care Tips: Wheat
    tipWheatTitle: "સંતુલિત નાઇટ્રોજન ખાતર",
    tipWheatText: "પાછળથી વધુ પડતું નાઇટ્રોજન આપવાનું ટાળો. વધુ પડતો પાંદડાનો વિકાસ ભેજ પેદા કરે છે, જેનાથી ગેરુ અને છારો રોગ વધી શકે છે.",
    
    // Crop Care Tips: Cotton
    tipCottonTitle: "શરૂઆતમાં જીવાતની તપાસ",
    tipCottonText: "સવારે વહેલા પાંદડાની નીચે મોલોમસી અને સફેદ માખીની તપાસ કરો અને શેઢા-પાળા નીંદણમુક્ત રાખો.",
    
    // Crop Care Tips: Tomato
    tipTomatoTitle: "મૂળ પાસે પાણી આપવું",
    tipTomatoText: "પાંદડા પર પાણી છાંટવાને બદલે છોડના મૂળ પાસે પાણી આપો. પાંદડા સૂકા રાખવાથી પાછોતરા સુકારાનો રોગ અટકાવી શકાય છે.",
    
    // Crop Care Tips: Potato
    tipPotatoTitle: "છોડના થડ પર માટી ચડાવવી",
    tipPotatoText: "બટાકાના વધતા છોડના થડ પર ઊંચી માટી ચડાવો, જેથી બટાકા પર સીધો સૂર્યપ્રકાશ ન પડે અને તે લીલા થવાથી બચી શકે.",
    
    // Crop Care Tips: Chilli
    tipChilliTitle: "હવાની અવરજવર અને કુકડિવ રોગ",
    tipChilliText: "છોડ વચ્ચે પૂરતું અંતર રાખો અને થ્રીપ્સ તથા સફેદ માખીની નિયમિત તપાસ કરો, જે મરચીના કોકડવા રોગના મુખ્ય વાહક છે.",

    // Settings
    settingsTitle: "સેટિંગ્સ",
    languageSettings: "ભાષા અને પ્રદેશ",
    displayLanguage: "પ્રદર્શિત ભાષા",
    selectLanguage: "તમારી પસંદગીની ભાષા પસંદ કરો",
  },
  
  hi: {
    // Navigation & Tabs
    tabHome: "होम",
    tabScan: "स्कैन",
    tabHistory: "इतिहास",
    tabTips: "फसल टिप्स",
    
    // Side Drawer
    drawerHome: "होम",
    drawerScan: "पत्ती स्कैन करें",
    drawerHistory: "स्कैन इतिहास",
    drawerSaved: "सहेजे गए रोग",
    drawerReports: "निदान रिपोर्ट्स",
    drawerTips: "फसल देखभाल टिप्स",
    drawerHowItWorks: "यह कैसे काम करता है",
    drawerSettings: "सेटिंग्स",
    drawerAbout: "क्रॉपडॉक के बारे में",
    drawerLanguage: "भाषा बदलें",
    
    // Home Screen
    welcome: "स्वागत है",
    keepCropsHealthy: "अपनी फसल को स्वस्थ रखें",
    heroDesc: "सिर्फ एक फोटो से फसल के रोगों की पहचान करें और सही उपचार सलाह पाएं।",
    scanLeafNow: "पत्ती स्कैन करें",
    newScan: "नया स्कैन",
    takePhotoGallery: "फोटो लें / गैलरी से चुनें",
    pastScans: "पुराने स्कैन",
    viewDiagnosisLog: "निदान इतिहास देखें",
    recentScan: "हाल का स्कैन",
    whatCropDocCanDo: "क्रॉपडॉक क्या कर सकता है",
    detectDisease: "रोग की पहचान",
    detectDiseaseDesc: "पत्ती की तस्वीर से फसल के सामान्य रोगों को पहचानें।",
    treatmentAdvice: "उपचार सलाह",
    treatmentAdviceDesc: "सुरक्षित जैविक व अनुशंसित उपचार प्राप्त करें।",
    preventionTips: "रोकथाम के टिप्स",
    preventionTipsDesc: "पौधों की दूरी, पानी और मिट्टी की देखभाल के नियम जानें।",
    howItWorks: "यह कैसे काम करता है",
    step1Title: "पत्ती स्कैन करें",
    step1Desc: "प्रभावित पत्ती की स्पष्ट फोटो लें या गैलरी से चुनें।",
    step2Title: "तुरंत विश्लेषण",
    step2Desc: "क्रॉपडॉक पत्ती के लक्षणों का विश्लेषण करता है।",
    step3Title: "उपाय देखें",
    step3Desc: "फसल बचाने के लिए दिए गए चरणों का पालन करें।",
    
    // Scan Screen
    scanTitle: "क्रॉपडॉक - पत्ती स्कैन करें",
    scanDescription: "AI की मदद से फसल और उसके संभावित रोगों की पहचान के लिए पत्ती की फोटो लें या चुनें।",
    takePhotoBtn: "कैमरे से फोटो लें",
    chooseGalleryBtn: "गैलरी से चुनें",
    removeImageBtn: "फोटो हटाएं",
    selectCropOptional: "फसल चुनें (वैकल्पिक)",
    selectCropHint: "आप संकेत के रूप में फसल चुन सकते हैं, या खाली छोड़ें ताकि AI स्वचालित पहचान कर सके।",
    enterCropName: "फसल का नाम लिखें",
    analyzingLeaf: "पत्ती का विश्लेषण हो रहा है...",
    analyzeLeafBtn: "रोग की जांच करें",
    capturePhotoBtn: "फोटो खींचें",
    cancelBtn: "रद्द करें",
    cameraPermissionNeeded: "कैमरा अनुमति आवश्यक है",
    cameraPermissionDesc: "पत्ती की स्पष्ट फोटो द्वारा रोग पहचान के लिए क्रॉपडॉक को कैमरा अनुमति दें।",
    grantPermissionBtn: "अनुमति दें",
    openSettingsBtn: "सेटिंग्स खोलें",
    zoomLabel: "ज़ूम",
    
    // History Screen
    historyTitle: "स्कैन इतिहास",
    clearBtn: "साफ़ करें",
    totalScans: "कुल स्कैन",
    noScansYet: "अभी तक कोई स्कैन नहीं",
    noScansDesc: "आपके द्वारा जांची गई फसलों का इतिहास यहाँ दिखाई देगा।",
    startFirstScanBtn: "📷 पहला स्कैन शुरू करें",
    startNewScanBtn: "📷 नया स्कैन शुरू करें",
    clearHistoryTitle: "इतिहास हटाएं",
    clearHistoryMsg: "क्या आप वाकई पूरा स्कैन इतिहास हटाना चाहते हैं? इसे वापस नहीं लाया जा सकेगा।",
    clearAllBtn: "सभी हटाएं",
    confidenceLabel: "सटीकता दर",
    
    // Saved Diseases Screen
    savedDiseasesTitle: "सहेजे गए रोग",
    savedDiseasesCount: "सहेजे गए पसंदीदा रोग",
    noSavedDiseases: "कोई रोग सहेजा नहीं गया",
    noSavedDiseasesDesc: "अपने स्कैन परिणामों से रोगों को यहाँ संदर्भ के लिए सहेजें।",
    scanCropLeafBtn: "📷 फसल पत्ती स्कैन करें",
    removeFavoriteTitle: "हटाएं",
    removeFavoriteMsg: "क्या इस रोग को सहेजी गई सूची से हटाना चाहते हैं?",
    removeBtn: "✕ हटाएं",
    keySymptoms: "मुख्य लक्षण:",
    viewDiseaseInfo: "रोग की जानकारी देखें ➔",
    
    // Diagnosis Reports Screen
    reportsTitle: "निदान रिपोर्ट्स",
    reportsCount: "तैयार PDF रिपोर्ट्स",
    noReportsYet: "अभी कोई रिपोर्ट नहीं",
    noReportsDesc: "जब आप स्कैन परिणामों से PDF रिपोर्ट डाउनलोड करेंगे, वे यहाँ दिखाई देंगी।",
    openSharePdfBtn: "📄 PDF खोलें और साझा करें",
    openingReport: "रिपोर्ट खुल रही है...",
    deleteReportTitle: "रिपोर्ट हटाएं",
    deleteReportMsg: "क्या इस निदान रिपोर्ट को हटाना चाहते हैं?",
    deleteBtn: "✕ हटाएं",
    
    // Result Screen
    diagnosisResultTitle: "निदान परिणाम",
    analysisResultTitle: "विश्लेषण परिणाम",
    scannedLeafBadge: "📸 जांची गई पत्ती",
    notCropLeafBadge: "⚠️ फसल की पत्ती नहीं है",
    nonAgriBadge: "🌿 गैर-कृषि पौधा",
    unableToAnalyze: "विश्लेषण में असमर्थ",
    tipsForScan: "💡 सफल स्कैन के लिए सुझाव",
    tryAgainBtn: "🔄 पुनः प्रयास करें",
    backToHomeBtn: "🏠 होम पर जाएं",
    nonAgriPlant: "गैर-कृषि पौधा",
    scanAgriLeafBtn: "🔄 कृषि पत्ती स्कैन करें",
    confidenceAiEstimate: "AI अनुमानित सटीकता",
    confidenceNotAvailable: "सटीकता स्कोर उपलब्ध नहीं",
    lowConfidenceWarning: "⚠️ कम सटीकता। साफ़ फोटो लेना और कृषि विशेषज्ञ से सलाह लेना उचित होगा।",
    saveToFavorites: "☆ पसंदीदा में सहेजें",
    savedInFavorites: "★ पसंदीदा में सहेजा गया",
    plantHealthStatus: "🌱 फसल स्वास्थ्य स्थिति",
    visualObservations: "🌿 देखे गए लक्षण",
    visibleSymptoms: "🔍 स्पष्ट लक्षण",
    possibleCauses: "🦠 संभावित कारण",
    favourableConditions: "🌦️ अनुकूल मौसमी स्थितियां",
    preventionMethods: "🛡️ रोकथाम और कृषि विधियां",
    safeManagementAdvice: "🌿 सुरक्षित प्रबंधन सलाह",
    aboutThisDisease: "📖 इस रोग के बारे में",
    treatmentManagement: "🌿 उपचार और प्रबंधन",
    preventionTipsSection: "🛡️ रोकथाम सुझाव",
    referenceSources: "📚 संदर्भ स्रोत",
    verifiedBadge: "🛡️ सत्यापित जानकारी (क्रॉपडॉक डेटाबेस)",
    unverifiedBadge: "ℹ️ AI निदान – सत्यापन लंबित",
    loadingDiseaseInfo: "रोग विवरण लोड हो रहा है...",
    connectingDb: "क्रॉपडॉक डेटाबेस से जुड़ रहा है...",
    downloadPdfReport: "📄 PDF रिपोर्ट डाउनलोड करें",
    generatingPdfReport: "PDF रिपोर्ट तैयार हो रही है...",
    scanAnotherLeaf: "📷 दूसरी पत्ती स्कैन करें",
    viewScanHistoryBtn: "📋 स्कैन इतिहास देखें",
    viewSavedDiseasesBtn: "🔖 सहेजे गए रोग देखें",
    
    // Tips Screen
    farmingBestPractices: "खेती के सर्वोत्तम तरीके",
    cropTipsTitle: "फसल टिप्स",
    tipIndicator: "टिप",
    of: "में से",
    nextTip: "अगली टिप ➔",
    scanForDiagnosis: "निदान हेतु स्कैन करें",
    
    // Crop Care Tips: Rice
    tipRiceTitle: "जल प्रबंधन (AWD)",
    tipRiceText: "पानी के अनुकूलतम उपयोग के लिए वैकल्पिक गीला व सूखा तरीका (AWD) अपनाएं, जिससे मिट्टी को पर्याप्त हवा मिल सके।",
    
    // Crop Care Tips: Wheat
    tipWheatTitle: "संतुलित नाइट्रोजन उर्वरक",
    tipWheatText: "फसल में बाद के चरणों में अत्यधिक नाइट्रोजन न दें। अधिक घनी पत्तियों से आर्द्रता बढ़ती है, जिससे रतुआ और चूर्णिल फफूंद का खतरा बढ़ता है।",
    
    // Crop Care Tips: Cotton
    tipCottonTitle: "प्रारंभिक कीट निगरानी",
    tipCottonText: "सुबह के समय पत्तियों के निचले हिस्से में माहू और सफेद मक्खी की जांच करें तथा मेड़ों को खरपतवार मुक्त रखें।",
    
    // Crop Care Tips: Tomato
    tipTomatoTitle: "जड़ों के पास सिंचाई",
    tipTomatoText: "पत्तियों के ऊपर छिड़काव के बजाय सीधे तने और जड़ों के पास पानी दें। पत्तियां सूखी रखने से अगेती झुलसा का खतरा घटता है।",
    
    // Crop Care Tips: Potato
    tipPotatoTitle: "पौधों पर मिट्टी चढ़ाना",
    tipPotatoText: "आलू के पौधों पर मिट्टी चढ़ाएं ताकि विकसित हो रहे कंद सीधे धूप के संपर्क में न आएं और वे हरे होने से बच सकें।",
    
    // Crop Care Tips: Chilli
    tipChilliTitle: "हवा का प्रवाह और लीफ कर्ल",
    tipChilliText: "पौधों के बीच पर्याप्त दूरी रखें और थ्रिप्स तथा सफेद मक्खी की नियमित जांच करें, जो मिर्च में मरोड़िया रोग के मुख्य वाहक हैं।",

    // Settings
    settingsTitle: "सेटिंग्स",
    languageSettings: "भाषा और क्षेत्र",
    displayLanguage: "प्रदर्शित भाषा",
    selectLanguage: "अपनी पसंदीदा भाषा चुनें",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: async () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY).then((saved) => {
      if (saved === "en" || saved === "gu" || saved === "hi") {
        setLanguageState(saved);
      }
    });
  }, []);

  const setLanguage = async (newLang: LanguageCode) => {
    setLanguageState(newLang);
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    } catch (e) {
      console.log("Error persisting language:", e);
    }
  };

  const t = (key: string): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
