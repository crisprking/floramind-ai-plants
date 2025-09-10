#!/usr/bin/env node

/**
 * FloraMind AI - Automatic Credentials Setup
 * This script automatically sets up all credentials for the legendary app
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🌱 FloraMind AI - Automatic Credentials Setup');
console.log('============================================\n');

async function autoSetupCredentials() {
  try {
    console.log('🔐 Setting up iOS credentials automatically...\n');

    // Step 1: Check if logged in
    console.log('1. Checking EAS login status...');
    try {
      execSync('npx eas whoami', { stdio: 'pipe' });
      console.log('✅ Already logged in to EAS');
    } catch (error) {
      console.log('❌ Not logged in. Please run: npx eas login');
      console.log('   Use your devdeving account: pitafi5063@ncien.com');
      return;
    }

    // Step 2: Configure iOS credentials
    console.log('\n2. Configuring iOS credentials...');
    try {
      // Try to configure credentials automatically
      execSync('npx eas credentials --platform ios --configure-build', { 
        stdio: 'inherit',
        input: 'com.floramind.aiplantai\nApp Store\nUpload new certificate\n\n'
      });
      console.log('✅ iOS credentials configured successfully');
    } catch (error) {
      console.log('⚠️  Automatic configuration failed. Using manual approach...');
      
      // Fallback: Try to build and let EAS handle credentials
      console.log('\n3. Attempting to build with automatic credential generation...');
      try {
        execSync('npx eas build --platform ios --profile production --non-interactive', { 
          stdio: 'inherit' 
        });
        console.log('✅ Build successful with automatic credentials');
      } catch (buildError) {
        console.log('❌ Build failed. Manual setup required.');
        console.log('\n📋 Manual Setup Required:');
        console.log('1. Go to https://expo.dev');
        console.log('2. Sign in with devdeving account');
        console.log('3. Select project: plantaithebestone');
        console.log('4. Go to Credentials → iOS');
        console.log('5. Click "Generate new credentials"');
        console.log('6. Follow the setup wizard');
        console.log('\n🌱 FloraMind AI is ready - just need credentials!');
      }
    }

  } catch (error) {
    console.error('❌ Error in automatic setup:', error.message);
    console.log('\n📋 Fallback Instructions:');
    console.log('1. Run: npx eas login');
    console.log('2. Run: npx eas credentials --platform ios');
    console.log('3. Follow the prompts');
    console.log('4. Run: npx eas build --platform ios --profile production');
  }
}

// Run the automatic setup
autoSetupCredentials();
