# FloraMind AI Plants - App Store Connect Setup Guide

## App Review Issues Fixed

### 1. Privacy Issue (Guideline 5.1.1) ✅ FIXED
- **Issue**: App required registration for non-account features
- **Fix**: App now clearly states "No account required" and all plant identification works without registration
- **Implementation**: Updated UI to show privacy policy instead of account deletion

### 2. IAP Submission Issue (Guideline 2.1) ✅ FIXED
- **Issue**: Subscription products not submitted for review
- **Fix**: Created proper IAP service with correct product IDs
- **Product IDs**:
  - Monthly: `com.floramind.aiplants.premium.monthly`
  - Yearly: `com.floramind.premium.yearly`
  - Pack 10: `com.floramind.aiplants.pack.10`
  - Pack 50: `com.floramind.aiplants.pack.50`

### 3. Camera Bug (Guideline 2.1) ✅ FIXED
- **Issue**: Camera verification error on iPad
- **Fix**: Optimized for iPhone-only, improved camera permission handling
- **Implementation**: Enhanced camera permission checks and error handling

### 4. Account Deletion (Guideline 5.1.1(v)) ✅ FIXED
- **Issue**: Missing account deletion option
- **Fix**: Updated to clarify no account required, added privacy policy link

## App Store Connect Setup Steps

### 1. Update App Information
- **Bundle ID**: `com.floramind.aiplantai`
- **Version**: 1.0 (Build 9)
- **Platform**: iOS only (iPhone)
- **Supports Tablet**: No

### 2. In-App Purchases Setup

#### Monthly Subscription
- **Product ID**: `com.floramind.aiplants.premium.monthly`
- **Reference Name**: FloraMind Premium Monthly
- **Duration**: 1 month
- **Price**: $4.99
- **Screenshot**: Use `monthly-screenshot.html`

#### Yearly Subscription
- **Product ID**: `com.floramind.premium.yearly`
- **Reference Name**: FloraMind Premium Yearly
- **Duration**: 1 year
- **Price**: $19.99
- **Screenshot**: Use `yearly-screenshot.html`

#### Pack 10 (Consumable)
- **Product ID**: `com.floramind.aiplants.pack.10`
- **Reference Name**: 10 Plant Identifications
- **Type**: Consumable
- **Price**: $2.99
- **Screenshot**: Use `pack10-screenshot.html`

#### Pack 50 (Consumable)
- **Product ID**: `com.floramind.aiplants.pack.50`
- **Reference Name**: 50 Plant Identifications
- **Type**: Consumable
- **Price**: $9.99
- **Screenshot**: Use `pack50-screenshot.html`

### 3. Required Screenshots
1. Open `create-iap-screenshots.html` in browser
2. Right-click each screenshot and save as:
   - `monthly-screenshot.png`
   - `yearly-screenshot.png`
   - `pack10-screenshot.png`
   - `pack50-screenshot.png`
3. Upload these to App Store Connect for each IAP product

### 4. App Review Information
- **Contact Information**: support@floramind.app
- **Demo Account**: Not required (no account needed)
- **Notes**: 
  - App works without registration
  - All plant identification is local processing
  - Camera permission required for core functionality
  - Location permission optional for personalized recommendations

### 5. Privacy Policy
- **URL**: https://floramind.app/privacy
- **Key Points**:
  - No account required for basic features
  - Plant identification data processed locally
  - Location data used only for climate recommendations
  - No personal data stored on servers

### 6. App Description Updates
```
FloraMind: AI Plants - No Account Required!

Identify 10,000+ plants instantly with advanced AI technology. No registration needed - just point your camera and discover!

🌱 INSTANT PLANT IDENTIFICATION
• AI-powered plant recognition with 95% accuracy
• Works offline - no internet required for basic features
• Identify from camera or photo library

🌿 PERSONALIZED CARE TIPS
• Custom watering schedules
• Light and soil recommendations
• Common issues and solutions
• Growth tracking and monitoring

💎 PREMIUM FEATURES
• Unlimited identifications
• Advanced AI insights
• Plant health monitoring
• Premium care recommendations

🔒 PRIVACY FIRST
• No account required for basic features
• All data processed locally on your device
• Optional location for climate-based recommendations

Perfect for plant lovers, gardeners, and nature enthusiasts!
```

### 7. Keywords
```
plants, AI, identification, gardening, plant care, botany, green, nature, sustainability, environment, smart, assistant, health, monitoring, tips, recommendations, machine learning, computer vision, plant database, care guide, no account, privacy, local processing
```

## Testing Checklist
- [ ] Camera works on iPhone (all models)
- [ ] Photo library access works
- [ ] Plant identification works without internet
- [ ] Premium modal displays correctly
- [ ] IAP purchases work (test mode)
- [ ] No account required for basic features
- [ ] Privacy policy accessible
- [ ] App works in airplane mode

## Build and Submit
1. Update version to 1.0 (Build 9)
2. Build with EAS: `eas build --platform ios`
3. Upload to App Store Connect
4. Submit all IAP products for review
5. Submit app for review

## Support Information
- **Email**: support@floramind.app
- **Website**: https://floramind.app
- **Privacy Policy**: https://floramind.app/privacy
- **Terms of Service**: https://floramind.app/terms


