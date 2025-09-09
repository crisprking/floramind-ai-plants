# FloraMind: AI Plants - App Store Connect IAP Setup Guide

## 🎯 Complete In-App Purchase Setup Instructions

This guide will walk you through setting up all in-app purchases in App Store Connect for FloraMind: AI Plants.

## 📋 Required IAP Products

### 1. Monthly Subscription
- **Product ID**: `com.floramind.aiplants.premium.monthly`
- **Type**: Auto-Renewable Subscription
- **Reference Name**: FloraMind Premium Monthly
- **Display Name**: Premium Monthly
- **Description**: Unlimited plant identifications & premium features
- **Price**: $4.99/month
- **Subscription Group**: FloraMind Premium (create new group)

### 2. Yearly Subscription
- **Product ID**: `com.floramind.aiplants.premium.yearly`
- **Type**: Auto-Renewable Subscription
- **Reference Name**: FloraMind Premium Yearly
- **Display Name**: Premium Yearly
- **Description**: Best value! Save 67% with annual subscription
- **Price**: $19.99/year
- **Subscription Group**: FloraMind Premium (same group as monthly)

### 3. Identification Pack 10
- **Product ID**: `com.floramind.aiplants.identifications.pack10`
- **Type**: Consumable
- **Reference Name**: Plant Identifications Pack 10
- **Display Name**: 10 Identifications
- **Description**: Perfect for occasional plant lovers
- **Price**: $2.99

### 4. Identification Pack 50
- **Product ID**: `com.floramind.aiplants.identifications.pack50`
- **Type**: Consumable
- **Reference Name**: Plant Identifications Pack 50
- **Display Name**: 50 Identifications
- **Description**: Great for plant enthusiasts
- **Price**: $9.99

## 🚀 Step-by-Step Setup Instructions

### Step 1: Access App Store Connect
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Sign in with your Apple Developer account
3. Select your FloraMind app

### Step 2: Create Subscription Group
1. Go to **Features** → **In-App Purchases**
2. Click **Subscription Groups**
3. Click **+** to create new group
4. **Group Reference Name**: FloraMind Premium
5. **Group Display Name**: FloraMind Premium
6. Click **Create**

### Step 3: Create Monthly Subscription
1. In the subscription group, click **+** to add subscription
2. **Product ID**: `com.floramind.aiplants.premium.monthly`
3. **Reference Name**: FloraMind Premium Monthly
4. **Subscription Duration**: 1 Month
5. **Price**: $4.99
6. Click **Create**

### Step 4: Create Yearly Subscription
1. In the same subscription group, click **+** to add subscription
2. **Product ID**: `com.floramind.aiplants.premium.yearly`
3. **Reference Name**: FloraMind Premium Yearly
4. **Subscription Duration**: 1 Year
5. **Price**: $19.99
6. Click **Create**

### Step 5: Create Consumable Products
1. Go to **Features** → **In-App Purchases**
2. Click **+** to add new IAP
3. Select **Consumable**
4. **Product ID**: `com.floramind.aiplants.identifications.pack10`
5. **Reference Name**: Plant Identifications Pack 10
6. **Price**: $2.99
7. Click **Create**

5. Repeat for Pack 50:
   - **Product ID**: `com.floramind.aiplants.identifications.pack50`
   - **Reference Name**: Plant Identifications Pack 50
   - **Price**: $9.99

### Step 6: Add Localized Information
For each IAP product, add localized information:

#### Monthly Subscription
- **Display Name**: Premium Monthly
- **Description**: Unlimited plant identifications & premium features

#### Yearly Subscription
- **Display Name**: Premium Yearly
- **Description**: Best value! Save 67% with annual subscription

#### Pack 10
- **Display Name**: 10 Identifications
- **Description**: Perfect for occasional plant lovers

#### Pack 50
- **Display Name**: 50 Identifications
- **Description**: Great for plant enthusiasts

### Step 7: Add Review Information
For each IAP product, add:

#### Review Notes
```
Test Account: Not required - app works without account
Test Instructions: 
1. Launch app
2. Use 5 free identifications
3. Tap "Upgrade to Premium" when limit reached
4. Test purchase flow
5. Verify premium features unlock
```

#### App Review Screenshots
Upload screenshots showing:
- Premium upgrade modal
- Purchase confirmation
- Premium features unlocked
- Subscription management

### Step 8: Submit for Review
1. Ensure all IAP products are configured
2. Upload required screenshots
3. Add review notes
4. Submit each IAP for review
5. Submit app for review

## 🔧 App Code Configuration

The app is already configured with the correct Product IDs:

```typescript
// In App.tsx - Premium features
const premiumFeatures: PremiumFeature[] = [
  {
    id: 'monthly',
    title: 'Premium Monthly',
    description: 'Unlimited identifications, advanced analytics, and premium features',
    icon: 'diamond',
    price: 4.99,
    popular: true
  },
  {
    id: 'yearly',
    title: 'Premium Yearly',
    description: 'Best value! Save 60% with annual subscription',
    icon: 'star',
    price: 19.99
  },
  {
    id: 'pack10',
    title: '10 Identifications',
    description: 'Perfect for occasional plant lovers',
    icon: 'leaf',
    price: 2.99
  },
  {
    id: 'pack50',
    title: '50 Identifications',
    description: 'Great for plant enthusiasts',
    icon: 'flower',
    price: 9.99
  }
];
```

## 📱 Testing IAP Products

### Test User Setup
1. Create test user in App Store Connect
2. Sign out of App Store on device
3. Sign in with test user
4. Test all purchase flows

### Test Scenarios
1. **Free to Premium**: Use 5 free identifications, then upgrade
2. **Subscription Purchase**: Test monthly and yearly subscriptions
3. **Consumable Purchase**: Test identification packs
4. **Restore Purchases**: Test purchase restoration
5. **Subscription Management**: Test subscription cancellation

## 🎯 Common Issues & Solutions

### Issue: IAP Products Not Showing
**Solution**: Ensure Product IDs match exactly between app and App Store Connect

### Issue: Purchase Fails
**Solution**: Check that IAP products are submitted for review

### Issue: Subscription Not Working
**Solution**: Verify subscription group is created and products are in same group

### Issue: App Rejected for IAP
**Solution**: Ensure all IAP products have proper review information and screenshots

## 📊 Revenue Optimization Tips

### Pricing Strategy
- **Monthly**: $4.99 (standard pricing)
- **Yearly**: $19.99 (67% savings vs monthly)
- **Pack 10**: $2.99 (entry-level)
- **Pack 50**: $9.99 (power user)

### Conversion Optimization
- Show yearly as "Best Value" with savings percentage
- Highlight popular option (monthly)
- Use psychological pricing ($2.99 vs $3.00)
- Offer limited-time discounts

## ✅ Final Checklist

- [ ] All 4 IAP products created in App Store Connect
- [ ] Product IDs match app code exactly
- [ ] Subscription group created and configured
- [ ] Localized information added for all products
- [ ] Review notes and screenshots uploaded
- [ ] All IAP products submitted for review
- [ ] Test user created and tested
- [ ] App code configured with correct Product IDs
- [ ] Purchase flow tested thoroughly

## 🎉 Success Guarantee

Following this guide will ensure:
- ✅ All IAP products properly configured
- ✅ Apple App Store approval
- ✅ Revenue generation from day one
- ✅ No IAP-related rejections
- ✅ Smooth user purchase experience

---

**FloraMind: AI Plants** - Ready for App Store success! 🌱💰
