#!/usr/bin/env node

/**
 * FloraMind AI - Supabase Setup Script
 * This script helps you set up Supabase for FloraMind AI
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🌱 FloraMind AI - Supabase Setup Script');
console.log('=====================================\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupSupabase() {
  try {
    console.log('This script will help you configure Supabase for FloraMind AI.\n');
    
    // Get Supabase project details
    const projectUrl = await askQuestion('Enter your Supabase project URL (https://your-project-id.supabase.co): ');
    const anonKey = await askQuestion('Enter your Supabase anon key: ');
    const serviceRoleKey = await askQuestion('Enter your Supabase service role key: ');
    
    // Validate inputs
    if (!projectUrl || !anonKey || !serviceRoleKey) {
      console.log('❌ Error: All fields are required!');
      process.exit(1);
    }
    
    if (!projectUrl.includes('supabase.co')) {
      console.log('❌ Error: Invalid Supabase URL format!');
      process.exit(1);
    }
    
    // Update config file
    const configPath = path.join(__dirname, '..', 'supabase', 'config.ts');
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    configContent = configContent.replace(
      "url: 'https://your-project-id.supabase.co',",
      `url: '${projectUrl}',`
    );
    
    configContent = configContent.replace(
      "anonKey: 'your-anon-key-here',",
      `anonKey: '${anonKey}',`
    );
    
    configContent = configContent.replace(
      "serviceRoleKey: 'your-service-role-key-here',",
      `serviceRoleKey: '${serviceRoleKey}',`
    );
    
    // Update API URLs
    const projectId = projectUrl.replace('https://', '').replace('.supabase.co', '');
    configContent = configContent.replace(
      'https://your-project-id.supabase.co',
      projectUrl
    );
    
    fs.writeFileSync(configPath, configContent);
    
    console.log('\n✅ Supabase configuration updated successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Run the database schema: supabase/schema.sql');
    console.log('2. Test the connection: npm start');
    console.log('3. Build the app: npm run build:ios');
    console.log('\n🌱 FloraMind AI is ready to be legendary!');
    
  } catch (error) {
    console.error('❌ Error setting up Supabase:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the setup
setupSupabase();
