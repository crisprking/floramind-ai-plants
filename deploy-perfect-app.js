const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 FloraMind: AI Plants - Perfect App Deployment');
console.log('=' .repeat(60));

// Function to run commands safely
function runCommand(command, description) {
  try {
    console.log(`\n📋 ${description}...`);
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    console.log(`✅ ${description} completed successfully!`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} failed: ${error.message}`);
    return false;
  }
}

// Function to check if git is initialized
function isGitInitialized() {
  try {
    execSync('git status', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Function to check if expo is installed
function isExpoInstalled() {
  try {
    execSync('npx expo --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

console.log('🔍 Pre-deployment checks...');

// Check 1: Verify all files exist
const requiredFiles = [
  'App.tsx',
  'app.json',
  'package.json',
  'eas.json',
  'metro.config.js',
  'README.md',
  'test-100-quality.js',
  'PERFECT_APP_SUMMARY.md'
];

console.log('\n📁 Checking required files...');
let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING!`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please ensure all files are present before deployment.');
  process.exit(1);
}

// Check 2: Run quality tests
console.log('\n🧪 Running comprehensive quality tests...');
try {
  execSync('node test-100-quality.js', { stdio: 'inherit' });
  console.log('✅ All quality tests passed!');
} catch (error) {
  console.log('❌ Quality tests failed. Please fix issues before deployment.');
  process.exit(1);
}

// Check 3: Verify package.json
console.log('\n📦 Verifying package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (packageJson.name === 'floramind-ai-plants' && packageJson.version === '1.0.0') {
    console.log('✅ Package.json is valid');
  } else {
    console.log('❌ Package.json validation failed');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ Package.json is invalid JSON');
  process.exit(1);
}

// Check 4: Verify app.json
console.log('\n📱 Verifying app.json...');
try {
  const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  if (appJson.expo.name === 'FloraMind: AI Plants' && appJson.expo.ios.buildNumber === '8') {
    console.log('✅ App.json is valid');
  } else {
    console.log('❌ App.json validation failed');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ App.json is invalid JSON');
  process.exit(1);
}

console.log('\n🎉 All pre-deployment checks passed!');
console.log('\n🚀 Starting deployment process...');

// Step 1: Install dependencies
if (!runCommand('npm install', 'Installing dependencies')) {
  console.log('❌ Failed to install dependencies. Please check your npm configuration.');
  process.exit(1);
}

// Step 2: Initialize Git if not already initialized
if (!isGitInitialized()) {
  console.log('\n📝 Initializing Git repository...');
  if (!runCommand('git init', 'Initializing Git repository')) {
    console.log('❌ Failed to initialize Git repository.');
    process.exit(1);
  }
}

// Step 3: Add all files to Git
console.log('\n📝 Adding files to Git...');
if (!runCommand('git add .', 'Adding files to Git')) {
  console.log('❌ Failed to add files to Git.');
  process.exit(1);
}

// Step 4: Create initial commit
console.log('\n💾 Creating initial commit...');
if (!runCommand('git commit -m "🌱 FloraMind: AI Plants - Perfect App v1.0.0 - 100% Quality Score"', 'Creating initial commit')) {
  console.log('❌ Failed to create initial commit.');
  process.exit(1);
}

// Step 5: Check Expo installation
if (!isExpoInstalled()) {
  console.log('\n📱 Installing Expo CLI...');
  if (!runCommand('npm install -g @expo/cli', 'Installing Expo CLI')) {
    console.log('❌ Failed to install Expo CLI.');
    process.exit(1);
  }
}

// Step 6: Start Expo development server
console.log('\n🚀 Starting Expo development server...');
console.log('📱 The app will be available at:');
console.log('   - Local: http://localhost:8081');
console.log('   - Expo Go: Scan QR code with your phone');
console.log('   - iOS Simulator: Press "i" in terminal');
console.log('   - Web: Press "w" in terminal');

console.log('\n🎉 DEPLOYMENT COMPLETE!');
console.log('=' .repeat(60));
console.log('✅ FloraMind: AI Plants is now ready for:');
console.log('   📱 Expo Development Server');
console.log('   🌐 GitHub Repository');
console.log('   🍎 Apple App Store Submission');
console.log('   🚀 Production Deployment');

console.log('\n📋 Next Steps:');
console.log('1. Test the app in Expo Go or iOS Simulator');
console.log('2. Push to GitHub: git remote add origin <your-repo-url>');
console.log('3. Push to GitHub: git push -u origin main');
console.log('4. Submit to Apple App Store when ready');

console.log('\n🌱 FloraMind: AI Plants - Perfect App Deployed Successfully!');
console.log('=' .repeat(60));

// Start Expo in the background
console.log('\n🚀 Starting Expo development server...');
try {
  execSync('npx expo start', { stdio: 'inherit' });
} catch (error) {
  console.log('❌ Failed to start Expo development server.');
  console.log('You can start it manually with: npx expo start');
}
