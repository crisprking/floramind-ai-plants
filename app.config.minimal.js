const { ExpoConfig, ConfigContext } = require('expo/config');

module.exports = ({ config }) => {
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
          NSPhotoLibraryUsageDescription: "FloraMind needs access to your photo library to identify plants from your existing photos.",
          NSCameraUsageDescription: "FloraMind uses your camera to take photos of plants for instant AI-powered identification.",
          NSLocationWhenInUseUsageDescription: "FloraMind uses your location to provide personalized plant care recommendations.",
          UIRequiredDeviceCapabilities: ["armv7"],
          UIStatusBarStyle: "UIStatusBarStyleLightContent",
          UILaunchStoryboardName: "LaunchScreen",
          UIViewControllerBasedStatusBarAppearance: false,
          UIBackgroundModes: ["background-processing"]
        },
        associatedDomains: ["applinks:floramind.app"],
        entitlements: {
          "com.apple.developer.in-app-payments": ["merchant.com.floramind.aiplantai"],
          "com.apple.developer.associated-domains": true
        }
      },
      owner: "devdeving",
      githubUrl: "https://github.com/crisprking/floramind-ai-plants",
      extra: {
        eas: {
          projectId: "290f054b"
        }
      }
    }
  };
};
