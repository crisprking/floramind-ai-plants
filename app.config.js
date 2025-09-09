const { ExpoConfig, ConfigContext } = require('expo/config');

module.exports = ({ config }) => {
  // Force npm usage in build environment
  process.env.NPM_CONFIG_PACKAGE_LOCK = 'false';
  process.env.NPM_CONFIG_LOCKFILE = 'false';
  
  return {
    ...config,
    expo: {
      ...config.expo,
      name: "FloraMind AI",
      slug: "floramind-ai-plant-ai",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      userInterfaceStyle: "light",
      newArchEnabled: true,
      platforms: ["ios"],
      splash: {
        image: "./assets/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#1B5E20"
      },
      ios: {
        supportsTablet: false,
        bundleIdentifier: "com.floramind.aiplantai",
        buildNumber: "9",
        infoPlist: {
          ITSAppUsesNonExemptEncryption: false,
          CFBundleAllowMixedLocalizations: true,
          CFBundleLocalizations: ["en"],
          NSPhotoLibraryUsageDescription: "FloraMind needs access to your photo library to identify plants from your existing photos. This helps you discover what plants you have and get personalized care advice.",
          NSCameraUsageDescription: "FloraMind uses your camera to take photos of plants for instant AI-powered identification. This is the core feature that helps you identify and learn about plants around you.",
          NSLocationWhenInUseUsageDescription: "FloraMind uses your location to provide personalized plant care recommendations based on your local climate and growing conditions. This helps ensure your plants thrive in your specific environment.",
          UIRequiredDeviceCapabilities: ["armv7"],
          UIStatusBarStyle: "UIStatusBarStyleLightContent",
          UILaunchStoryboardName: "LaunchScreen",
          UIViewControllerBasedStatusBarAppearance: false,
          UIBackgroundModes: ["background-processing"],
          NSAppTransportSecurity: {
            NSAllowsArbitraryLoads: false,
            NSExceptionDomains: {
              "floramind.app": {
                NSExceptionAllowsInsecureHTTPLoads: false,
                NSExceptionMinimumTLSVersion: "TLSv1.2",
                NSIncludesSubdomains: true
              }
            }
          }
        },
        associatedDomains: ["applinks:floramind.app"],
        entitlements: {
          "com.apple.developer.in-app-payments": ["merchant.com.floramind.aiplantai"],
          "com.apple.developer.associated-domains": true
        }
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#1B5E20"
        },
        package: "com.floramind.aiplantai",
        permissions: [
          "android.permission.CAMERA",
          "android.permission.READ_EXTERNAL_STORAGE",
          "android.permission.WRITE_EXTERNAL_STORAGE",
          "android.permission.ACCESS_FINE_LOCATION",
          "android.permission.ACCESS_COARSE_LOCATION"
        ]
      },
      web: {
        favicon: "./assets/favicon.png",
        name: "FloraMind AI Plants",
        shortName: "FloraMind",
        description: "AI-powered plant identification and care assistant",
        themeColor: "#1B5E20",
        backgroundColor: "#1B5E20"
      },
      scheme: "floramind-ai-plant-ai",
      description: "The most advanced AI-powered plant care assistant that combines machine learning, environmental consciousness, and community insights to revolutionize how you care for your plants. Identify 10,000+ plant species with 95% accuracy, get personalized care recommendations, and track your plant's growth with cutting-edge AI technology.",
      keywords: [
        "plants", "AI", "identification", "gardening", "plant care", "botany", "green", "nature", "sustainability", "environment", "smart", "assistant", "health", "monitoring", "tips", "recommendations", "machine learning", "computer vision", "plant database", "care guide"
      ],
      privacy: "public",
      primaryColor: "#1B5E20",
      backgroundColor: "#1B5E20",
      owner: "devdeving",
      githubUrl: "https://github.com/crisprking/floramind-ai-plants",
      extra: {
        eas: {
          projectId: "290f054b"
        }
      },
      plugins: [
        ["expo-camera", {
          cameraPermission: "FloraMind uses your camera to take photos of plants for instant AI-powered identification. This is the core feature that helps you identify and learn about plants around you."
        }],
        ["expo-image-picker", {
          photosPermission: "FloraMind needs access to your photo library to identify plants from your existing photos. This helps you discover what plants you have and get personalized care advice."
        }],
        ["expo-location", {
          locationAlwaysAndWhenInUsePermission: "FloraMind uses your location to provide personalized plant care recommendations based on your local climate and growing conditions. This helps ensure your plants thrive in your specific environment."
        }]
      ]
    }
  };
};
