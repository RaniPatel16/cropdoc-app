# CropDoc App 🌱

An intelligent mobile application for crop disease detection, plant health monitoring, and treatment recommendations built with React Native and Expo.

---

## 📁 Project Structure

```text
cropdoc-app/
├── CropDoc/                  # Main Expo / React Native Application
│   ├── .vscode/              # Recommended VS Code workspace settings & extensions
│   ├── .gitignore            # Git ignore configuration
│   ├── assets/               # App icons, splash screens, and images
│   ├── scripts/              # Project helper scripts
│   ├── src/                  # Application source code
│   │   ├── app/              # Expo Router file-based pages & navigation
│   │   ├── components/       # Reusable UI components
│   │   ├── constants/        # Theme & styling constants
│   │   └── hooks/            # Custom React hooks
│   ├── app.json              # Expo application configuration
│   ├── package.json          # Dependencies and npm scripts
│   └── tsconfig.json         # TypeScript configuration
└── README.md                 # Root repository documentation
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app on your Android/iOS device (or Android Studio / Xcode emulator)

### Installation

1. Navigate to the `CropDoc` directory:
   ```bash
   cd CropDoc
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

4. Scan the QR code with **Expo Go** (Android) or the Camera app (iOS) to launch the app!
## ✨ Features

- 🌿 **Leaf Scanner**: Take photo with live camera viewfinder or choose from gallery.
- 🔬 **Instant Diagnosis**: Detect blight, rust, leaf spots and view confidence meters.
- 💊 **Treatment Recommendations**: Step-by-step organic remedies and chemical fungicides.
- 🛡️ **Prevention Best Practices**: Spacing, irrigation, and crop rotation guidelines.
- 📋 **Scan History**: Full historical log of diagnosed crops and timestamps.
