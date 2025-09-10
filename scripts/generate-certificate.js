#!/usr/bin/env node

/**
 * FloraMind AI - Maximum Power Certificate Generator
 * This script helps you generate the .p12 certificate needed
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('⚡ FloraMind AI - Maximum Power Certificate Generator');
console.log('====================================================\n');

async function generateCertificate() {
  try {
    console.log('🔐 Generating .p12 certificate with MAXIMUM POWER...\n');

    // Step 1: Check if we can use EAS to generate credentials
    console.log('1. Attempting to generate credentials via EAS...');
    try {
      execSync('npx eas credentials --platform ios --configure-build', { 
        stdio: 'inherit',
        input: 'com.floramind.aiplantai\nApp Store\nUpload new certificate\n\n'
      });
      console.log('✅ Certificate generated successfully via EAS!');
      return;
    } catch (error) {
      console.log('⚠️  EAS generation failed. Using alternative method...');
    }

    // Step 2: Provide manual instructions
    console.log('\n📋 MANUAL CERTIFICATE GENERATION (MAXIMUM POWER):');
    console.log('================================================');
    console.log('\n1. Go to: https://developer.apple.com');
    console.log('2. Sign in with your Apple ID');
    console.log('3. Go to: "Certificates, Identifiers & Profiles"');
    console.log('4. Click: "Certificates" → "+" button');
    console.log('5. Choose: "iOS Distribution (App Store and Ad Hoc)"');
    console.log('6. Follow the steps to create certificate');
    console.log('7. Download the .cer file');
    console.log('8. Convert to .p12 using Keychain Access (Mac) or OpenSSL');
    console.log('\n⚡ ALTERNATIVE - EAS DASHBOARD (FASTER):');
    console.log('========================================');
    console.log('1. Go to: https://expo.dev');
    console.log('2. Sign in: pitafi5063@ncien.com');
    console.log('3. Select: plantaithebestone project');
    console.log('4. Go to: Credentials → iOS');
    console.log('5. Click: "Generate new credentials"');
    console.log('6. Follow the wizard - EAS creates .p12 automatically');
    
    console.log('\n🌱 FloraMind AI is ready - just need the certificate!');

  } catch (error) {
    console.error('❌ Error generating certificate:', error.message);
  }
}

// Run the certificate generator
generateCertificate();
