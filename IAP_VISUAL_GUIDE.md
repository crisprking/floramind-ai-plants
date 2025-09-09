# FloraMind: AI Plants - IAP Visual Setup Guide

## 🎯 Visual Step-by-Step IAP Setup

### Step 1: Access App Store Connect
```
1. Go to: https://appstoreconnect.apple.com
2. Sign in with your Apple Developer account
3. Click on "My Apps"
4. Select "FloraMind: AI Plants"
```

### Step 2: Navigate to In-App Purchases
```
1. Click on "Features" tab
2. Click on "In-App Purchases" in the left sidebar
3. You'll see the IAP management interface
```

### Step 3: Create Subscription Group
```
1. Click on "Subscription Groups"
2. Click the "+" button to create new group
3. Fill in:
   - Group Reference Name: FloraMind Premium
   - Group Display Name: FloraMind Premium
4. Click "Create"
```

### Step 4: Create Monthly Subscription
```
1. In the subscription group, click "+" to add subscription
2. Fill in the form:
   - Product ID: com.floramind.aiplants.premium.monthly
   - Reference Name: FloraMind Premium Monthly
   - Subscription Duration: 1 Month
   - Price: $4.99
3. Click "Create"
```

### Step 5: Create Yearly Subscription
```
1. In the same subscription group, click "+" to add subscription
2. Fill in the form:
   - Product ID: com.floramind.aiplants.premium.yearly
   - Reference Name: FloraMind Premium Yearly
   - Subscription Duration: 1 Year
   - Price: $19.99
3. Click "Create"
```

### Step 6: Create Consumable Products
```
1. Go back to "In-App Purchases" main page
2. Click "+" to add new IAP
3. Select "Consumable"
4. Fill in for Pack 10:
   - Product ID: com.floramind.aiplants.identifications.pack10
   - Reference Name: Plant Identifications Pack 10
   - Price: $2.99
5. Click "Create"
6. Repeat for Pack 50:
   - Product ID: com.floramind.aiplants.identifications.pack50
   - Reference Name: Plant Identifications Pack 50
   - Price: $9.99
```

## 📱 App Store Connect Interface Layout

### Main IAP Page
```
┌─────────────────────────────────────────────────────────┐
│ Features > In-App Purchases                             │
├─────────────────────────────────────────────────────────┤
│ + Create In-App Purchase                                │
│                                                         │
│ Subscription Groups:                                    │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ FloraMind Premium                                   │ │
│ │   - Monthly Subscription ($4.99)                   │ │
│ │   - Yearly Subscription ($19.99)                   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Consumable Products:                                    │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Plant Identifications Pack 10 ($2.99)              │ │
│ │ Plant Identifications Pack 50 ($9.99)              │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### IAP Product Configuration Form
```
┌─────────────────────────────────────────────────────────┐
│ Create In-App Purchase                                  │
├─────────────────────────────────────────────────────────┤
│ Product ID: com.floramind.aiplants.premium.monthly     │
│ Reference Name: FloraMind Premium Monthly              │
│                                                         │
│ Type: Auto-Renewable Subscription                      │
│ Subscription Group: FloraMind Premium                  │
│ Duration: 1 Month                                      │
│                                                         │
│ Pricing:                                               │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Tier 1: $4.99/month                                │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [Create] [Cancel]                                       │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Required Information for Each IAP

### Monthly Subscription
```
Product ID: com.floramind.aiplants.premium.monthly
Reference Name: FloraMind Premium Monthly
Type: Auto-Renewable Subscription
Subscription Group: FloraMind Premium
Duration: 1 Month
Price: $4.99

Localized Information:
- Display Name: Premium Monthly
- Description: Unlimited plant identifications & premium features

Review Information:
- Review Notes: Test account not required - app works without account
- Screenshot: Premium upgrade modal showing monthly option
```

### Yearly Subscription
```
Product ID: com.floramind.aiplants.premium.yearly
Reference Name: FloraMind Premium Yearly
Type: Auto-Renewable Subscription
Subscription Group: FloraMind Premium
Duration: 1 Year
Price: $19.99

Localized Information:
- Display Name: Premium Yearly
- Description: Best value! Save 67% with annual subscription

Review Information:
- Review Notes: Test account not required - app works without account
- Screenshot: Premium upgrade modal showing yearly option
```

### Pack 10 (Consumable)
```
Product ID: com.floramind.aiplants.identifications.pack10
Reference Name: Plant Identifications Pack 10
Type: Consumable
Price: $2.99

Localized Information:
- Display Name: 10 Identifications
- Description: Perfect for occasional plant lovers

Review Information:
- Review Notes: Test account not required - app works without account
- Screenshot: Identification pack purchase screen
```

### Pack 50 (Consumable)
```
Product ID: com.floramind.aiplants.identifications.pack50
Reference Name: Plant Identifications Pack 50
Type: Consumable
Price: $9.99

Localized Information:
- Display Name: 50 Identifications
- Description: Great for plant enthusiasts

Review Information:
- Review Notes: Test account not required - app works without account
- Screenshot: Identification pack purchase screen
```

## 📸 Required Screenshots

### Screenshot 1: Premium Upgrade Modal
```
┌─────────────────────────────────────────────────────────┐
│ Upgrade to Premium                                      │
├─────────────────────────────────────────────────────────┤
│ 💎 Premium Monthly - $4.99/month                       │
│ ⭐ Premium Yearly - $19.99/year (Save 67%)             │
│                                                         │
│ Features:                                               │
│ • Unlimited plant identifications                       │
│ • Advanced AI analytics                                 │
│ • Plant health monitoring                               │
│ • Personalized care schedules                           │
│                                                         │
│ [Upgrade] [Maybe Later]                                 │
└─────────────────────────────────────────────────────────┘
```

### Screenshot 2: Purchase Confirmation
```
┌─────────────────────────────────────────────────────────┐
│ Purchase Successful!                                    │
├─────────────────────────────────────────────────────────┤
│ Welcome to FloraMind Premium!                          │
│                                                         │
│ You now have:                                           │
│ • Unlimited plant identifications                       │
│ • Advanced features unlocked                            │
│ • Premium support                                       │
│                                                         │
│ [Continue]                                              │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Common Mistakes to Avoid

### ❌ Don't Do
- Use different Product IDs in app vs App Store Connect
- Forget to create subscription group
- Skip localized information
- Forget review screenshots
- Use wrong IAP type (consumable vs subscription)

### ✅ Do Instead
- Match Product IDs exactly
- Create subscription group first
- Add all localized information
- Upload required screenshots
- Use correct IAP types

## 🚀 Testing Checklist

### Before Submission
- [ ] All 4 IAP products created
- [ ] Product IDs match app code
- [ ] Subscription group configured
- [ ] Localized information added
- [ ] Review screenshots uploaded
- [ ] Review notes added

### After Submission
- [ ] All IAP products submitted for review
- [ ] App submitted for review
- [ ] Test user created
- [ ] Purchase flow tested
- [ ] Restore purchases tested

## 🎉 Success Guarantee

Following this visual guide will ensure:
- ✅ Perfect IAP setup in App Store Connect
- ✅ No IAP-related rejections
- ✅ Smooth user purchase experience
- ✅ Maximum revenue potential
- ✅ Apple App Store approval

---

**FloraMind: AI Plants** - IAP setup made simple! 🌱💰
