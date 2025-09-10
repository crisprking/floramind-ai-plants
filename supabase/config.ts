// FloraMind AI - Supabase Configuration
// Replace these with your actual Supabase project details

export const SUPABASE_CONFIG = {
  // Replace with your Supabase project URL
  url: 'https://your-project-id.supabase.co',
  
  // Replace with your Supabase anon key
  anonKey: 'your-anon-key-here',
  
  // Replace with your Supabase service role key (for server-side operations)
  serviceRoleKey: 'your-service-role-key-here',
  
  // Database configuration
  database: {
    // Table names
    tables: {
      plants: 'plants',
      userPlants: 'user_plants',
      plantIdentifications: 'plant_identifications',
      plantCareLogs: 'plant_care_logs',
      communityPosts: 'community_posts',
      postComments: 'post_comments',
      expertAdvice: 'expert_advice',
      plantCareSchedules: 'plant_care_schedules',
      userPreferences: 'user_preferences'
    },
    
    // Storage buckets
    storage: {
      plantImages: 'plant-images',
      userPhotos: 'user-photos',
      communityImages: 'community-images'
    }
  },
  
  // Feature flags
  features: {
    enableRealTime: true,
    enableStorage: true,
    enableAuth: false, // Set to true if you want user authentication
    enableRLS: true,   // Row Level Security
    enableAnalytics: true
  },
  
  // API endpoints
  api: {
    baseUrl: 'https://your-project-id.supabase.co',
    restUrl: 'https://your-project-id.supabase.co/rest/v1',
    realtimeUrl: 'wss://your-project-id.supabase.co/realtime/v1',
    storageUrl: 'https://your-project-id.supabase.co/storage/v1'
  }
};

// Environment-specific configurations
export const getSupabaseConfig = () => {
  const isDevelopment = __DEV__;
  
  if (isDevelopment) {
    return {
      ...SUPABASE_CONFIG,
      // Development overrides
      features: {
        ...SUPABASE_CONFIG.features,
        enableAnalytics: false
      }
    };
  }
  
  return SUPABASE_CONFIG;
};
