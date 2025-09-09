const fs = require('fs');
const path = require('path');

console.log('🔧 FloraMind: AI Plant AI - Build Setup');
console.log('=' .repeat(50));

// Function to create a minimal package.json for build
function createBuildPackageJson() {
  const packageJson = {
    "name": "floramind-ai-plant-ai",
    "version": "1.0.0",
    "main": "index.ts",
    "scripts": {
      "start": "expo start",
      "build": "expo export"
    },
    "dependencies": {
      "expo": "~53.0.22",
      "expo-status-bar": "~2.2.3",
      "expo-camera": "~16.1.11",
      "expo-image-picker": "~16.1.4",
      "expo-location": "~18.1.6",
      "expo-constants": "~17.1.7",
      "expo-linking": "~7.1.7",
      "expo-router": "~5.1.6",
      "expo-splash-screen": "~0.30.10",
      "expo-system-ui": "~5.0.11",
      "expo-web-browser": "~14.2.0",
      "expo-linear-gradient": "~14.1.5",
      "expo-blur": "~14.1.5",
      "expo-font": "~13.3.2",
      "react": "19.0.0",
      "react-native": "0.79.5",
      "react-native-gesture-handler": "~2.24.0",
      "react-native-reanimated": "~3.17.4",
      "react-native-safe-area-context": "5.4.0",
      "react-native-screens": "~4.11.1",
      "react-native-svg": "15.11.2",
      "expo-haptics": "~14.1.4"
    },
    "devDependencies": {
      "@babel/core": "^7.25.2",
      "@types/react": "~19.0.10",
      "sharp": "^0.34.3",
      "typescript": "~5.8.3"
    },
    "private": true
  };

  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  console.log('✅ Created optimized package.json for build');
}

// Function to create a build-optimized app.json
function createBuildAppJson() {
  const appJson = {
    "expo": {
      "name": "floramind ai plant ai",
      "slug": "floramind-ai-plant-ai",
      "version": "1.0.0",
      "orientation": "portrait",
      "icon": "./assets/icon.png",
      "userInterfaceStyle": "light",
      "newArchEnabled": true,
      "platforms": ["ios"],
      "splash": {
        "image": "./assets/splash-icon.png",
        "resizeMode": "contain",
        "backgroundColor": "#1B5E20"
      },
      "ios": {
        "supportsTablet": true,
        "bundleIdentifier": "com.floramind.aiplantai",
        "buildNumber": "8",
        "infoPlist": {
          "ITSAppUsesNonExemptEncryption": false,
          "CFBundleAllowMixedLocalizations": true,
          "CFBundleLocalizations": ["en"],
          "NSPhotoLibraryUsageDescription": "FloraMind needs access to your photo library to identify plants from your existing photos. This helps you discover what plants you have and get personalized care advice.",
          "NSCameraUsageDescription": "FloraMind uses your camera to take photos of plants for instant AI-powered identification. This is the core feature that helps you identify and learn about plants around you.",
          "NSLocationWhenInUseUsageDescription": "FloraMind uses your location to provide personalized plant care recommendations based on your local climate and growing conditions. This helps ensure your plants thrive in your specific environment.",
          "UIRequiredDeviceCapabilities": ["armv7"],
          "UIStatusBarStyle": "UIStatusBarStyleLightContent",
          "UILaunchStoryboardName": "LaunchScreen",
          "UIViewControllerBasedStatusBarAppearance": false,
          "UIBackgroundModes": ["background-processing"],
          "NSAppTransportSecurity": {
            "NSAllowsArbitraryLoads": false,
            "NSExceptionDomains": {
              "floramind.app": {
                "NSExceptionAllowsInsecureHTTPLoads": false,
                "NSExceptionMinimumTLSVersion": "TLSv1.2",
                "NSIncludesSubdomains": true
              }
            }
          }
        },
        "associatedDomains": ["applinks:floramind.app"],
        "entitlements": {
          "com.apple.developer.in-app-payments": true,
          "com.apple.developer.associated-domains": true
        }
      },
      "android": {
        "adaptiveIcon": {
          "foregroundImage": "./assets/adaptive-icon.png",
          "backgroundColor": "#1B5E20"
        },
        "package": "com.floramind.aiplantai",
        "permissions": [
          "android.permission.CAMERA",
          "android.permission.READ_EXTERNAL_STORAGE",
          "android.permission.WRITE_EXTERNAL_STORAGE",
          "android.permission.ACCESS_FINE_LOCATION",
          "android.permission.ACCESS_COARSE_LOCATION"
        ]
      },
      "web": {
        "favicon": "./assets/favicon.png",
        "name": "FloraMind AI Plants",
        "shortName": "FloraMind",
        "description": "AI-powered plant identification and care assistant",
        "themeColor": "#1B5E20",
        "backgroundColor": "#1B5E20"
      },
      "scheme": "floramind-ai-plant-ai",
      "description": "The most advanced AI-powered plant care assistant that combines machine learning, environmental consciousness, and community insights to revolutionize how you care for your plants. Identify 10,000+ plant species with 95% accuracy, get personalized care recommendations, and track your plant's growth with cutting-edge AI technology.",
      "keywords": [
        "plants", "AI", "identification", "gardening", "plant care", "botany", "green", "nature", "sustainability", "environment", "smart", "assistant", "health", "monitoring", "tips", "recommendations", "machine learning", "computer vision", "plant database", "care guide"
      ],
      "privacy": "public",
      "primaryColor": "#1B5E20",
      "backgroundColor": "#1B5E20",
      "owner": "verdai",
      "githubUrl": "https://github.com/abrahamtrueba9898/rork-verdai",
      "extra": {
        "eas": {
          "projectId": "62dd7ba0-2464-4f85-bb5d-85731a3b5ce0"
        }
      },
      "plugins": [
        ["expo-camera", {
          "cameraPermission": "FloraMind uses your camera to take photos of plants for instant AI-powered identification. This is the core feature that helps you identify and learn about plants around you."
        }],
        ["expo-image-picker", {
          "photosPermission": "FloraMind needs access to your photo library to identify plants from your existing photos. This helps you discover what plants you have and get personalized care advice."
        }],
        ["expo-location", {
          "locationAlwaysAndWhenInUsePermission": "FloraMind uses your location to provide personalized plant care recommendations based on your local climate and growing conditions. This helps ensure your plants thrive in your specific environment."
        }]
      ]
    }
  };

  fs.writeFileSync('app.json', JSON.stringify(appJson, null, 2));
  console.log('✅ Created optimized app.json for build');
}

// Run the setup
console.log('🔧 Setting up build-optimized configuration...');
createBuildPackageJson();
createBuildAppJson();

console.log('\n🎉 Build setup complete!');
console.log('📱 Your app is now optimized for EAS builds');
console.log('🚀 Ready to trigger a new build!');
