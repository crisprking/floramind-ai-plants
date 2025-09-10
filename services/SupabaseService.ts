import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from '../supabase/config';

// Get Supabase configuration
const config = getSupabaseConfig();

// Create Supabase client
export const supabase = createClient(config.url, config.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Database types
export interface Plant {
  id: string;
  name: string;
  scientific_name: string;
  family: string;
  care_level: 'easy' | 'medium' | 'hard';
  watering_frequency: string;
  light_requirements: string;
  soil_type: string;
  temperature_range: string;
  humidity_preference: string;
  common_issues: string[];
  care_tips: string[];
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPlant {
  id: string;
  user_id: string;
  plant_id: string;
  plant: Plant;
  nickname?: string;
  location: string;
  purchase_date?: string;
  last_watered?: string;
  last_fertilized?: string;
  notes?: string;
  health_status: 'excellent' | 'good' | 'fair' | 'poor';
  growth_stage: 'seedling' | 'young' | 'mature' | 'flowering' | 'fruiting';
  created_at: string;
  updated_at: string;
}

export interface PlantIdentification {
  id: string;
  user_id: string;
  image_url: string;
  identified_plant_id?: string;
  identified_plant?: Plant;
  confidence_score: number;
  ai_analysis: string;
  location?: string;
  weather_conditions?: string;
  created_at: string;
}

export interface PlantCareLog {
  id: string;
  user_plant_id: string;
  action_type: 'watering' | 'fertilizing' | 'repotting' | 'pruning' | 'health_check';
  notes?: string;
  images?: string[];
  created_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  plant_id?: string;
  plant?: Plant;
  images: string[];
  tags: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface ExpertAdvice {
  id: string;
  user_id: string;
  question: string;
  plant_id?: string;
  plant?: Plant;
  expert_id: string;
  expert_name: string;
  expert_credentials: string;
  answer: string;
  images?: string[];
  status: 'pending' | 'answered' | 'resolved';
  created_at: string;
  updated_at: string;
}

// Supabase Service Class
export class SupabaseService {
  // Plant Database Operations
  static async getAllPlants(): Promise<Plant[]> {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  static async getPlantById(id: string): Promise<Plant | null> {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async searchPlants(query: string): Promise<Plant[]> {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .or(`name.ilike.%${query}%,scientific_name.ilike.%${query}%,family.ilike.%${query}%`)
      .limit(20);
    
    if (error) throw error;
    return data || [];
  }

  // User Plant Collections
  static async getUserPlants(userId: string): Promise<UserPlant[]> {
    const { data, error } = await supabase
      .from('user_plants')
      .select(`
        *,
        plant:plants(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async addUserPlant(userPlant: Omit<UserPlant, 'id' | 'created_at' | 'updated_at'>): Promise<UserPlant> {
    const { data, error } = await supabase
      .from('user_plants')
      .insert([userPlant])
      .select(`
        *,
        plant:plants(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateUserPlant(id: string, updates: Partial<UserPlant>): Promise<UserPlant> {
    const { data, error } = await supabase
      .from('user_plants')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        plant:plants(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteUserPlant(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_plants')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Plant Identification History
  static async savePlantIdentification(identification: Omit<PlantIdentification, 'id' | 'created_at'>): Promise<PlantIdentification> {
    const { data, error } = await supabase
      .from('plant_identifications')
      .insert([identification])
      .select(`
        *,
        identified_plant:plants(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserIdentifications(userId: string): Promise<PlantIdentification[]> {
    const { data, error } = await supabase
      .from('plant_identifications')
      .select(`
        *,
        identified_plant:plants(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // Plant Care Logging
  static async addCareLog(careLog: Omit<PlantCareLog, 'id' | 'created_at'>): Promise<PlantCareLog> {
    const { data, error } = await supabase
      .from('plant_care_logs')
      .insert([careLog])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getCareLogs(userPlantId: string): Promise<PlantCareLog[]> {
    const { data, error } = await supabase
      .from('plant_care_logs')
      .select('*')
      .eq('user_plant_id', userPlantId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // Community Features
  static async getCommunityPosts(limit: number = 20): Promise<CommunityPost[]> {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        plant:plants(*)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  }

  static async createCommunityPost(post: Omit<CommunityPost, 'id' | 'likes_count' | 'comments_count' | 'created_at' | 'updated_at'>): Promise<CommunityPost> {
    const { data, error } = await supabase
      .from('community_posts')
      .insert([post])
      .select(`
        *,
        plant:plants(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Expert Advice
  static async submitExpertQuestion(question: Omit<ExpertAdvice, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<ExpertAdvice> {
    const { data, error } = await supabase
      .from('expert_advice')
      .insert([question])
      .select(`
        *,
        plant:plants(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserExpertQuestions(userId: string): Promise<ExpertAdvice[]> {
    const { data, error } = await supabase
      .from('expert_advice')
      .select(`
        *,
        plant:plants(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // AI Learning and Analytics
  static async getPlantAnalytics(userId: string): Promise<any> {
    const { data, error } = await supabase
      .from('user_plants')
      .select('health_status, growth_stage, created_at')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  }

  static async getPopularPlants(): Promise<Plant[]> {
    const { data, error } = await supabase
      .from('user_plants')
      .select(`
        plant_id,
        plant:plants(*)
      `)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    return (data?.map((item: any) => item.plant).filter(Boolean) || []) as Plant[];
  }
}
