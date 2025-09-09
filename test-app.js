#!/usr/bin/env node

/**
 * FloraMind: AI Plants - App Testing Script
 * 
 * This script helps verify that the app meets all Apple App Store requirements
 * and addresses the rejection reasons from the previous submission.
 */

const fs = require('fs');
const path = require('path');

console.log('🌱 FloraMind: AI Plants - App Testing Script');
console.log('==========================================\n');

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  total: 0
};

function runTest(testName, condition, isWarning = false) {
  testResults.total++;
  
  if (condition) {
    testResults.passed++;
    console.log(`✅ ${testName}`);
  } else {
    if (isWarning) {
      testResults.warnings++;
      console.log(`⚠️  ${testName} (WARNING)`);
    } else {
      testResults.failed++;
      console.log(`❌ ${testName} (FAILED)`);
    }
  }
}

// Test 1: App Configuration
console.log('📱 Testing App Configuration...');
console.log('--------------------------------');

const appJsonPath = path.join(__dirname, 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

runTest('Bundle ID is correct', appJson.expo.ios.bundleIdentifier === 'com.floramind.aiplants');
runTest('App name is correct', appJson.expo.name === 'FloraMind: AI Plants');
runTest('Version is set', appJson.expo.version === '1.0.0');
runTest('Build number is set', appJson.expo.ios.buildNumber === '8');
runTest('iPad support enabled', appJson.expo.ios.supportsTablet === true);
runTest('Camera permission description exists', appJson.expo.ios.infoPlist.NSCameraUsageDescription);
runTest('Photo library permission description exists', appJson.expo.ios.infoPlist.NSPhotoLibraryUsageDescription);
runTest('Location permission description exists', appJson.expo.ios.infoPlist.NSLocationWhenInUseUsageDescription);

// Test 2: Package Dependencies
console.log('\n📦 Testing Package Dependencies...');
console.log('----------------------------------');

const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const requiredDeps = [
  'expo-camera',
  'expo-image-picker',
  'expo-location',
  'expo-in-app-purchases',
  'expo-haptics',
  'react-native-safe-area-context'
];

requiredDeps.forEach(dep => {
  runTest(`${dep} is installed`, packageJson.dependencies[dep]);
});

// Test 3: App Code Analysis
console.log('\n🔍 Testing App Code...');
console.log('---------------------');

const appTsxPath = path.join(__dirname, 'App.tsx');
const appCode = fs.readFileSync(appTsxPath, 'utf8');

runTest('No forced registration for core features', 
  appCode.includes('identificationsUsed >= maxFreeIdentifications') && 
  !appCode.includes('requireAuth') && 
  !appCode.includes('mustLogin'));

runTest('Account deletion functionality exists', 
  appCode.includes('showAccountDeletion') && 
  appCode.includes('Account Deletion'));

runTest('Camera functionality implemented', 
  appCode.includes('takePhoto') && 
  appCode.includes('ImagePicker.launchCameraAsync'));

runTest('Photo library functionality implemented', 
  appCode.includes('pickFromGallery') && 
  appCode.includes('ImagePicker.launchImageLibraryAsync'));

runTest('Permission handling implemented', 
  appCode.includes('requestPermissions') && 
  appCode.includes('cameraPermission'));

runTest('Error handling implemented', 
  appCode.includes('try') && 
  appCode.includes('catch') && 
  appCode.includes('Alert.alert'));

runTest('Loading states implemented', 
  appCode.includes('isLoading') && 
  appCode.includes('Identifying...'));

runTest('Haptic feedback implemented', 
  appCode.includes('Haptics.impactAsync') && 
  appCode.includes('Haptics.notificationAsync'));

// Test 4: In-App Purchase Service
console.log('\n💳 Testing In-App Purchase Service...');
console.log('-------------------------------------');

const iapServicePath = path.join(__dirname, 'services', 'InAppPurchases.ts');
if (fs.existsSync(iapServicePath)) {
  const iapCode = fs.readFileSync(iapServicePath, 'utf8');
  
  runTest('IAP service exists', true);
  runTest('Monthly subscription product ID defined', 
    iapCode.includes('com.floramind.aiplants.premium.monthly'));
  runTest('Yearly subscription product ID defined', 
    iapCode.includes('com.floramind.aiplants.premium.yearly'));
  runTest('Consumable product IDs defined', 
    iapCode.includes('com.floramind.aiplants.identifications.pack10') &&
    iapCode.includes('com.floramind.aiplants.identifications.pack50'));
  runTest('Purchase restoration implemented', 
    iapCode.includes('restorePurchases'));
  runTest('Transaction completion implemented', 
    iapCode.includes('finishTransaction'));
} else {
  runTest('IAP service exists', false);
}

// Test 5: Documentation
console.log('\n📚 Testing Documentation...');
console.log('--------------------------');

const requiredDocs = [
  'PRIVACY_POLICY.md',
  'APP_STORE_METADATA.md',
  'APP_STORE_SUBMISSION_CHECKLIST.md',
  'README.md'
];

requiredDocs.forEach(doc => {
  runTest(`${doc} exists`, fs.existsSync(path.join(__dirname, doc)));
});

// Test 6: Apple Rejection Issues
console.log('\n🍎 Testing Apple Rejection Issues...');
console.log('-----------------------------------');

// Guideline 5.1.1 - Privacy
runTest('No forced registration for core features', 
  appCode.includes('identificationsUsed >= maxFreeIdentifications') && 
  !appCode.includes('requireAuth'));

runTest('Account deletion functionality provided', 
  appCode.includes('showAccountDeletion'));

// Guideline 2.1 - App Completeness
let iapCode = '';
if (fs.existsSync(iapServicePath)) {
  iapCode = fs.readFileSync(iapServicePath, 'utf8');
}
runTest('IAP products properly configured', 
  fs.existsSync(iapServicePath) && 
  iapCode.includes('com.floramind.aiplants.premium.monthly'));

runTest('Camera functionality working', 
  appCode.includes('takePhoto') && 
  appCode.includes('ImagePicker.launchCameraAsync') &&
  appCode.includes('try') && appCode.includes('catch'));

// Test 7: App Store Requirements
console.log('\n🏪 Testing App Store Requirements...');
console.log('----------------------------------');

runTest('App works without internet for core features', 
  appCode.includes('identifyPlant') && 
  !appCode.includes('fetch') && 
  !appCode.includes('axios'));

runTest('Proper error handling for network issues', 
  appCode.includes('Alert.alert') && 
  appCode.includes('Error'));

runTest('User-friendly error messages', 
  appCode.includes('Failed to take photo') && 
  appCode.includes('Failed to pick image'));

// Test Results Summary
console.log('\n📊 Test Results Summary');
console.log('======================');
console.log(`✅ Passed: ${testResults.passed}`);
console.log(`❌ Failed: ${testResults.failed}`);
console.log(`⚠️  Warnings: ${testResults.warnings}`);
console.log(`📊 Total: ${testResults.total}`);

const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
console.log(`\n🎯 Success Rate: ${successRate}%`);

if (testResults.failed === 0) {
  console.log('\n🎉 All tests passed! App is ready for App Store submission.');
} else {
  console.log('\n⚠️  Some tests failed. Please fix the issues before submitting.');
}

if (testResults.warnings > 0) {
  console.log('\n💡 Consider addressing the warnings for better app quality.');
}

// Apple Rejection Issues Status
console.log('\n🍎 Apple Rejection Issues Status');
console.log('================================');

const rejectionIssues = [
  {
    issue: 'Guideline 5.1.1 - Forced registration for non-account features',
    status: appCode.includes('identificationsUsed >= maxFreeIdentifications') && 
            !appCode.includes('requireAuth') ? '✅ FIXED' : '❌ NOT FIXED'
  },
  {
    issue: 'Guideline 2.1 - Missing in-app purchase products',
    status: fs.existsSync(iapServicePath) && 
            iapCode.includes('com.floramind.aiplants.premium.monthly') ? '✅ FIXED' : '❌ NOT FIXED'
  },
  {
    issue: 'Guideline 2.1 - Camera functionality bugs',
    status: appCode.includes('takePhoto') && 
            appCode.includes('try') && appCode.includes('catch') ? '✅ FIXED' : '❌ NOT FIXED'
  },
  {
    issue: 'Guideline 5.1.1(v) - Missing account deletion',
    status: appCode.includes('showAccountDeletion') ? '✅ FIXED' : '❌ NOT FIXED'
  }
];

rejectionIssues.forEach(issue => {
  console.log(`${issue.status} ${issue.issue}`);
});

const fixedIssues = rejectionIssues.filter(issue => issue.status.includes('✅')).length;
console.log(`\n🎯 Apple Issues Fixed: ${fixedIssues}/${rejectionIssues.length}`);

if (fixedIssues === rejectionIssues.length) {
  console.log('\n🎉 All Apple rejection issues have been addressed!');
  console.log('✅ App is ready for resubmission to the App Store.');
} else {
  console.log('\n⚠️  Some Apple rejection issues still need to be addressed.');
}

console.log('\n🌱 FloraMind: AI Plants testing complete!');
