// FloraMind AI - Environment Configuration Example
// Copy this file to config.ts and fill in your actual values

export const ENV_CONFIG = {
  // Supabase Configuration
  SUPABASE_URL: 'https://your-project-id.supabase.co',
  SUPABASE_ANON_KEY: 'your-anon-key-here',
  SUPABASE_SERVICE_ROLE_KEY: 'your-service-role-key-here',
  
  // AI Configuration
  GEMINI_API_KEY: 'your-gemini-api-key-here',
  
  // App Configuration
  APP_ENV: 'production',
  ENABLE_ANALYTICS: true,
  ENABLE_REAL_TIME: true,
  
  // Optional: Weather API for plant care recommendations
  OPENWEATHER_API_KEY: 'your-openweather-api-key-here',
  
  // Optional: Push notifications
  EXPO_PUSH_TOKEN: 'your-expo-push-token-here'
};
