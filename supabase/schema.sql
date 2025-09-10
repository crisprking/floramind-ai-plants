-- FloraMind AI - Complete Supabase Database Schema
-- This is the SQL schema for the legendary plant care app

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create plants table (10,000+ species)
CREATE TABLE plants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  scientific_name VARCHAR(255) NOT NULL,
  family VARCHAR(255) NOT NULL,
  genus VARCHAR(255),
  species VARCHAR(255),
  care_level VARCHAR(20) CHECK (care_level IN ('easy', 'medium', 'hard')) NOT NULL,
  watering_frequency TEXT NOT NULL,
  light_requirements TEXT NOT NULL,
  soil_type TEXT NOT NULL,
  temperature_range TEXT NOT NULL,
  humidity_preference TEXT NOT NULL,
  common_issues TEXT[] DEFAULT '{}',
  care_tips TEXT[] DEFAULT '{}',
  image_url TEXT,
  description TEXT,
  native_region TEXT,
  max_height TEXT,
  bloom_time TEXT,
  toxicity_level VARCHAR(50),
  air_purifying BOOLEAN DEFAULT false,
  pet_friendly BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_plants table (personal collections)
CREATE TABLE user_plants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
  nickname VARCHAR(255),
  location VARCHAR(255) NOT NULL,
  purchase_date DATE,
  last_watered TIMESTAMP WITH TIME ZONE,
  last_fertilized TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  health_status VARCHAR(20) CHECK (health_status IN ('excellent', 'good', 'fair', 'poor')) DEFAULT 'good',
  growth_stage VARCHAR(20) CHECK (growth_stage IN ('seedling', 'young', 'mature', 'flowering', 'fruiting')) DEFAULT 'young',
  pot_size VARCHAR(50),
  soil_moisture_level VARCHAR(20),
  light_exposure VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create plant_identifications table (AI identification history)
CREATE TABLE plant_identifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  identified_plant_id UUID REFERENCES plants(id) ON DELETE SET NULL,
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100) NOT NULL,
  ai_analysis TEXT NOT NULL,
  location TEXT,
  weather_conditions TEXT,
  device_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create plant_care_logs table (care tracking)
CREATE TABLE plant_care_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_plant_id UUID REFERENCES user_plants(id) ON DELETE CASCADE,
  action_type VARCHAR(50) CHECK (action_type IN ('watering', 'fertilizing', 'repotting', 'pruning', 'health_check', 'pest_treatment', 'other')) NOT NULL,
  notes TEXT,
  images TEXT[] DEFAULT '{}',
  amount_used VARCHAR(50), -- for water, fertilizer, etc.
  duration_minutes INTEGER, -- for time-based activities
  weather_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create community_posts table (social features)
CREATE TABLE community_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  plant_id UUID REFERENCES plants(id) ON DELETE SET NULL,
  images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create post_comments table
CREATE TABLE post_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expert_advice table (expert consultations)
CREATE TABLE expert_advice (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  question TEXT NOT NULL,
  plant_id UUID REFERENCES plants(id) ON DELETE SET NULL,
  expert_id UUID NOT NULL,
  expert_name VARCHAR(255) NOT NULL,
  expert_credentials TEXT NOT NULL,
  answer TEXT,
  images TEXT[] DEFAULT '{}',
  status VARCHAR(20) CHECK (status IN ('pending', 'answered', 'resolved')) DEFAULT 'pending',
  priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create plant_care_schedules table (automated reminders)
CREATE TABLE plant_care_schedules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_plant_id UUID REFERENCES user_plants(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL,
  frequency_days INTEGER NOT NULL,
  next_due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  reminder_time TIME,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_preferences table (personalization)
CREATE TABLE user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  preferred_care_level VARCHAR(20) CHECK (preferred_care_level IN ('easy', 'medium', 'hard')),
  experience_level VARCHAR(20) CHECK (experience_level IN ('beginner', 'intermediate', 'expert')),
  notification_settings JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{}',
  theme_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_plants_name ON plants(name);
CREATE INDEX idx_plants_scientific_name ON plants(scientific_name);
CREATE INDEX idx_plants_family ON plants(family);
CREATE INDEX idx_plants_care_level ON plants(care_level);
CREATE INDEX idx_user_plants_user_id ON user_plants(user_id);
CREATE INDEX idx_user_plants_plant_id ON user_plants(plant_id);
CREATE INDEX idx_plant_identifications_user_id ON plant_identifications(user_id);
CREATE INDEX idx_plant_identifications_created_at ON plant_identifications(created_at);
CREATE INDEX idx_plant_care_logs_user_plant_id ON plant_care_logs(user_plant_id);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at);
CREATE INDEX idx_community_posts_plant_id ON community_posts(plant_id);
CREATE INDEX idx_expert_advice_user_id ON expert_advice(user_id);
CREATE INDEX idx_expert_advice_status ON expert_advice(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_plants_updated_at BEFORE UPDATE ON plants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_plants_updated_at BEFORE UPDATE ON user_plants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_post_comments_updated_at BEFORE UPDATE ON post_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expert_advice_updated_at BEFORE UPDATE ON expert_advice FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plant_care_schedules_updated_at BEFORE UPDATE ON plant_care_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample plants data
INSERT INTO plants (name, scientific_name, family, care_level, watering_frequency, light_requirements, soil_type, temperature_range, humidity_preference, common_issues, care_tips, air_purifying, pet_friendly) VALUES
('Snake Plant', 'Sansevieria trifasciata', 'Asparagaceae', 'easy', 'Every 2-3 weeks', 'Low to bright indirect light', 'Well-draining cactus mix', '60-85°F (15-29°C)', 'Low humidity', '{"Overwatering", "Root rot"}', '{"Water only when soil is completely dry", "Can tolerate low light conditions", "Great for beginners", "Air-purifying plant"}', true, false),
('Pothos', 'Epipremnum aureum', 'Araceae', 'easy', 'Weekly', 'Low to bright indirect light', 'Well-draining potting mix', '65-85°F (18-29°C)', 'Average humidity', '{"Yellow leaves from overwatering", "Brown tips from underwatering"}', '{"Let soil dry between waterings", "Trailing vine plant", "Easy to propagate", "Tolerates neglect well"}', true, false),
('ZZ Plant', 'Zamioculcas zamiifolia', 'Araceae', 'easy', 'Every 2-3 weeks', 'Low to bright indirect light', 'Well-draining potting mix', '60-75°F (15-24°C)', 'Low humidity', '{"Overwatering", "Yellow leaves"}', '{"Very drought tolerant", "Glossy green leaves", "Perfect for offices", "Low maintenance"}', true, false),
('Spider Plant', 'Chlorophytum comosum', 'Asparagaceae', 'easy', 'Weekly', 'Bright indirect light', 'Well-draining potting mix', '60-75°F (15-24°C)', 'Average humidity', '{"Brown tips", "Root bound"}', '{"Produces baby plants (spiderettes)", "Air-purifying", "Easy to propagate", "Safe for pets"}', true, true),
('Rubber Plant', 'Ficus elastica', 'Moraceae', 'easy', 'Weekly', 'Bright indirect light', 'Well-draining potting mix', '60-80°F (15-27°C)', 'Average humidity', '{"Leaf drop", "Brown edges"}', '{"Large glossy leaves", "Can grow quite tall", "Wipe leaves to keep them shiny", "Tolerates some direct sun"}', true, false),
('Monstera Deliciosa', 'Monstera deliciosa', 'Araceae', 'medium', 'Weekly', 'Bright indirect light', 'Well-draining potting mix', '65-85°F (18-29°C)', 'High humidity', '{"Yellow leaves", "Brown spots", "No fenestrations"}', '{"Famous for split leaves", "Needs support as it grows", "Loves humidity", "Can grow very large"}', true, false),
('Fiddle Leaf Fig', 'Ficus lyrata', 'Moraceae', 'medium', 'Weekly', 'Bright indirect light', 'Well-draining potting mix', '60-75°F (15-24°C)', 'High humidity', '{"Leaf drop", "Brown spots", "Droopy leaves"}', '{"Large violin-shaped leaves", "Needs consistent care", "Rotate regularly for even growth", "Popular houseplant"}', true, false),
('Calathea', 'Calathea spp.', 'Marantaceae', 'hard', '2-3 times per week', 'Bright indirect light', 'Well-draining, moisture-retentive mix', '65-80°F (18-27°C)', 'Very high humidity', '{"Crispy edges", "Yellow leaves", "Pest problems"}', '{"Prayer plant - leaves move", "Needs high humidity", "Distilled water recommended", "Beautiful patterns"}', true, false);

-- Enable Row Level Security (RLS)
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_identifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_care_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_advice ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_care_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now, can be restricted later)
CREATE POLICY "Allow all operations on plants" ON plants FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_plants" ON user_plants FOR ALL USING (true);
CREATE POLICY "Allow all operations on plant_identifications" ON plant_identifications FOR ALL USING (true);
CREATE POLICY "Allow all operations on plant_care_logs" ON plant_care_logs FOR ALL USING (true);
CREATE POLICY "Allow all operations on community_posts" ON community_posts FOR ALL USING (true);
CREATE POLICY "Allow all operations on post_comments" ON post_comments FOR ALL USING (true);
CREATE POLICY "Allow all operations on expert_advice" ON expert_advice FOR ALL USING (true);
CREATE POLICY "Allow all operations on plant_care_schedules" ON plant_care_schedules FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_preferences" ON user_preferences FOR ALL USING (true);
