# FloraMind AI - IAP Submission Guide

## **CRITICAL: Submit IAP Products for App Store Review**

The App Store rejected the app because IAP products are not submitted for review. Follow these steps:

### **1. Access App Store Connect**
- Go to [App Store Connect](https://appstoreconnect.apple.com)
- Sign in with your Apple Developer account
- Select "FloraMind AI" app

### **2. Navigate to In-App Purchases**
- Click on "Features" tab
- Select "In-App Purchases"
- Click "+" to create new IAP products

### **3. Create Subscription Products**

#### **Monthly Subscription**
- **Product ID**: `com.floramind.aiplants.premium.monthly`
- **Reference Name**: FloraMind AI Premium Monthly
- **Product Type**: Auto-Renewable Subscription
- **Subscription Group**: FloraMind AI Premium
- **Duration**: 1 Month
- **Price**: $4.99/month

#### **Yearly Subscription**
- **Product ID**: `com.floramind.aiplants.premium.yearly`
- **Reference Name**: FloraMind AI Premium Yearly
- **Product Type**: Auto-Renewable Subscription
- **Subscription Group**: FloraMind AI Premium
- **Duration**: 1 Year
- **Price**: $39.99/year

### **4. Create Consumable Products**

#### **10-Pack Credits**
- **Product ID**: `com.floramind.aiplants.pack.10`
- **Reference Name**: FloraMind AI 10-Pack
- **Product Type**: Consumable
- **Price**: $2.99

#### **50-Pack Credits**
- **Product ID**: `com.floramind.aiplants.pack.50`
- **Reference Name**: FloraMind AI 50-Pack
- **Product Type**: Consumable
- **Price**: $9.99

### **5. Add Required Metadata**
For each IAP product, add:
- **Display Name**: As shown above
- **Description**: 
  - Monthly: "Unlimited plant identification, health diagnosis, and AI chat support"
  - Yearly: "Unlimited plant identification, health diagnosis, and AI chat support - Best Value!"
  - 10-Pack: "10 additional plant identifications"
  - 50-Pack: "50 additional plant identifications - Best Value!"

### **6. Upload App Review Screenshots**
- **Required**: Upload screenshots showing IAP purchase flow
- **Screenshots**: Use the generated IAP screenshots from `create-iap-screenshots.html`
- **Description**: "Screenshots showing the in-app purchase flow for FloraMind AI Premium subscriptions and credit packs"

### **7. Submit for Review**
- Click "Submit for Review" on each IAP product
- Ensure all products are in "Ready to Submit" status
- Submit the app binary again after IAP products are approved

### **8. App Review Information**
When submitting the app:
- **Notes**: "IAP products have been submitted for review. The app provides free plant identification with usage limits, and premium features are available through in-app purchases."
- **Demo Account**: Not required (no account needed)
- **Contact Information**: support@floramind.ai

## **Important Notes**
- IAP products must be submitted BEFORE the app can be approved
- The app will be rejected until IAP products are reviewed and approved
- All product IDs must match exactly with the code in `AppleIAPService.ts`
- Screenshots are mandatory for IAP submission

## **Product ID Reference**
```typescript
export const PRODUCT_IDS = {
  MONTHLY: 'com.floramind.aiplants.premium.monthly',
  YEARLY: 'com.floramind.aiplants.premium.yearly',
  PACK_10: 'com.floramind.aiplants.pack.10',
  PACK_50: 'com.floramind.aiplants.pack.50',
};
```
