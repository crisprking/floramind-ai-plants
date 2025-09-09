const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚀 FloraMind: AI Plant AI - New Expo Setup');
console.log('=' .repeat(50));

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

console.log('🔧 Setting up for new Expo environment...');

// Step 1: Install dependencies
if (!runCommand('npm install', 'Installing dependencies')) {
  console.log('❌ Failed to install dependencies.');
  process.exit(1);
}

// Step 2: Clear Expo cache
if (!runCommand('npx expo install --fix', 'Fixing Expo dependencies')) {
  console.log('❌ Failed to fix Expo dependencies.');
  process.exit(1);
}

// Step 3: Start Expo development server
console.log('\n🚀 Starting Expo development server...');
console.log('📱 Your app will be available at:');
console.log('   - Local: http://localhost:8081');
console.log('   - Expo Go: Scan QR code with your phone');
console.log('   - iOS Simulator: Press "i" in terminal');
console.log('   - Web: Press "w" in terminal');

console.log('\n🎉 Setup complete! Starting Expo...');

// Start Expo
try {
  execSync('npx expo start', { stdio: 'inherit' });
} catch (error) {
  console.log('❌ Failed to start Expo development server.');
  console.log('You can start it manually with: npx expo start');
}
