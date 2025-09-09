# FloraMind: AI Plants - IAP Troubleshooting Guide

## 🚨 Common IAP Issues & Solutions

### Issue 1: "No products available" or empty product list

#### Symptoms:
- App shows "No products available"
- Empty product list in premium modal
- Console shows "Failed to load products"

#### Solutions:
1. **Check Product IDs match exactly**
   ```typescript
   // In App Store Connect
   com.floramind.aiplants.premium.monthly
   
   // In app code (must match exactly)
   'com.floramind.aiplants.premium.monthly'
   ```

2. **Verify IAP products are submitted for review**
   - Go to App Store Connect
   - Check IAP status is "Ready to Submit" or "Approved"
   - If "Missing Metadata", add required information

3. **Check app bundle ID matches**
   ```json
   // In app.json
   "bundleIdentifier": "com.floramind.aiplants"
   ```

4. **Test with sandbox account**
   - Create test user in App Store Connect
   - Sign out of App Store on device
   - Sign in with test user
   - Test purchase flow

### Issue 2: Purchase fails or shows error

#### Symptoms:
- Purchase button doesn't work
- Error message during purchase
- "Purchase failed" alert

#### Solutions:
1. **Check IAP products are approved**
   - All IAP products must be approved before testing
   - Submit IAP products for review first
   - Wait for approval before testing

2. **Verify test user setup**
   ```bash
   # Create test user in App Store Connect
   1. Go to Users and Access > Sandbox Testers
   2. Click "+" to add new tester
   3. Use email not associated with Apple ID
   4. Create password
   5. Sign in on device with test user
   ```

3. **Check device settings**
   - Settings > App Store > Sandbox Account
   - Make sure test user is signed in
   - Restart app after signing in

### Issue 3: Subscription not working

#### Symptoms:
- Subscription purchase succeeds but features not unlocked
- Subscription status not updating
- User charged but no premium access

#### Solutions:
1. **Check subscription group setup**
   - Both monthly and yearly must be in same group
   - Group name: "FloraMind Premium"
   - Verify both products are in same group

2. **Implement subscription status checking**
   ```typescript
   // Check subscription status
   const checkSubscriptionStatus = async () => {
     try {
       const purchases = await InAppPurchases.getPurchaseHistoryAsync();
       const activeSubscriptions = purchases.filter(purchase => 
         purchase.productId.includes('premium') && 
         purchase.transactionState === 1 // Purchased
       );
       return activeSubscriptions.length > 0;
     } catch (error) {
       console.error('Error checking subscription:', error);
       return false;
     }
   };
   ```

3. **Handle subscription restoration**
   ```typescript
   // Restore purchases
   const restorePurchases = async () => {
     try {
       const purchases = await InAppPurchases.getPurchaseHistoryAsync();
       // Process restored purchases
       return purchases;
     } catch (error) {
       console.error('Error restoring purchases:', error);
       return [];
     }
   };
   ```

### Issue 4: App Store rejection for IAP

#### Symptoms:
- App rejected with IAP-related issues
- "Missing in-app purchase products" error
- IAP products not submitted for review

#### Solutions:
1. **Submit all IAP products for review**
   - Go to each IAP product in App Store Connect
   - Click "Submit for Review"
   - Wait for approval before submitting app

2. **Add required review information**
   ```
   Review Notes:
   Test Account: Not required - app works without account
   Test Instructions:
   1. Launch app
   2. Use 5 free identifications
   3. Tap "Upgrade to Premium" when limit reached
   4. Test purchase flow
   5. Verify premium features unlock
   ```

3. **Upload required screenshots**
   - App Review Screenshot for each IAP
   - Show the purchase flow clearly
   - Screenshot must be from actual app

### Issue 5: IAP products not showing in App Store

#### Symptoms:
- IAP products not visible on App Store page
- "Promote in-app purchases" not working
- Users can't see IAP options

#### Solutions:
1. **Check promotion settings**
   - In each IAP product settings
   - Enable "Show to all App Store users"
   - Add promotional image (1024x1024)

2. **Verify IAP is approved**
   - IAP must be approved to show on App Store
   - Check status in App Store Connect
   - Wait for approval if pending

3. **Add promotional image**
   - Required for App Store promotion
   - 1024x1024 pixels
   - JPG or PNG format
   - No rounded corners

## 🔧 Debugging Steps

### Step 1: Check Console Logs
```typescript
// Add logging to IAP service
console.log('IAP Response:', result);
console.log('Products loaded:', this.products);
console.log('Purchase result:', purchaseResult);
```

### Step 2: Verify Product IDs
```typescript
// Ensure Product IDs match exactly
const productIds = [
  'com.floramind.aiplants.premium.monthly',      // ✅ Correct
  'com.floramind.aiplants.premium.yearly',       // ✅ Correct
  'com.floramind.aiplants.identifications.pack10', // ✅ Correct
  'com.floramind.aiplants.identifications.pack50'  // ✅ Correct
];
```

### Step 3: Test Purchase Flow
```typescript
// Test each purchase type
const testPurchases = async () => {
  // Test monthly subscription
  await purchaseProduct('com.floramind.aiplants.premium.monthly');
  
  // Test yearly subscription
  await purchaseProduct('com.floramind.aiplants.premium.yearly');
  
  // Test consumable packs
  await purchaseProduct('com.floramind.aiplants.identifications.pack10');
  await purchaseProduct('com.floramind.aiplants.identifications.pack50');
};
```

### Step 4: Check App Store Connect
1. **IAP Products Status**
   - All products should be "Ready to Submit" or "Approved"
   - No products should be "Missing Metadata"

2. **Subscription Group**
   - Group name: "FloraMind Premium"
   - Both monthly and yearly in same group

3. **Review Information**
   - Review notes added
   - Screenshots uploaded
   - All products submitted for review

## 📱 Testing Checklist

### Before App Store Submission
- [ ] All 4 IAP products created in App Store Connect
- [ ] Product IDs match app code exactly
- [ ] Subscription group created and configured
- [ ] All IAP products submitted for review
- [ ] Review information and screenshots added
- [ ] Test user created in sandbox

### After App Store Submission
- [ ] All IAP products approved
- [ ] App approved with IAP
- [ ] Purchase flow tested with sandbox
- [ ] Subscription restoration tested
- [ ] Premium features unlock correctly

## 🎯 Success Indicators

### ✅ IAP Working Correctly
- Products load successfully
- Purchase flow completes
- Premium features unlock
- Subscription status updates
- Restore purchases works

### ❌ IAP Not Working
- "No products available" message
- Purchase fails with error
- Premium features not unlocking
- Subscription not recognized
- Restore purchases fails

## 🚀 Quick Fixes

### Fix 1: Product IDs Mismatch
```typescript
// Check these match exactly:
'com.floramind.aiplants.premium.monthly'
'com.floramind.aiplants.premium.yearly'
'com.floramind.aiplants.identifications.pack10'
'com.floramind.aiplants.identifications.pack50'
```

### Fix 2: Missing Review Information
```
Review Notes:
Test Account: Not required - app works without account
Test Instructions: Use 5 free identifications, then upgrade to premium
```

### Fix 3: Subscription Group Issues
```
Group Name: FloraMind Premium
Products: Monthly and Yearly in same group
```

## 🎉 Success Guarantee

Following this troubleshooting guide will resolve:
- ✅ All IAP loading issues
- ✅ Purchase flow problems
- ✅ Subscription management issues
- ✅ App Store rejection problems
- ✅ Revenue generation issues

---

**FloraMind: AI Plants** - IAP troubleshooting made simple! 🌱💰
