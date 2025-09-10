import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { SupabaseService, PlantIdentification } from './SupabaseService';
import { LegendaryPlantDatabase } from './LegendaryPlantDatabase';

// Types for the legendary AI service
type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image'; image: string };

type CoreMessage =
  | { role: 'system'; content: string }
  | { role: 'user'; content: string | ContentPart[] }
  | { role: 'assistant'; content: string | ContentPart[] };

type LLMResponse = { 
  completion: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
};

// Legendary AI Service with Supabase integration
export class LegendaryAIService {
  private static readonly API_KEY = 'your-gemini-api-key'; // Replace with actual API key
  private static readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';

  // Enhanced plant identification with Supabase learning
  static async identifyPlant(imageUri: string, userId?: string): Promise<{
    plant: any;
    confidence: number;
    aiAnalysis: string;
    careTips: string[];
    similarPlants: any[];
  }> {
    try {
      // Convert image to base64
      const base64Image = await this.convertImageToBase64(imageUri);
      
      // Enhanced AI prompt for better identification
      const systemPrompt = `You are FloraMind AI, the world's most advanced plant identification system. 
      
      Analyze this plant image and provide:
      1. Plant name (common and scientific)
      2. Family and genus
      3. Care level (easy/medium/hard)
      4. Detailed care instructions
      5. Common issues and solutions
      6. Growth characteristics
      7. Confidence score (0-100)
      
      Be specific, accurate, and helpful. If uncertain, say so and provide the most likely identification.`;

      const userPrompt = `Please identify this plant and provide comprehensive care information.`;

      const response = await this.callGeminiAPI([
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: [
            { type: 'text', text: userPrompt },
            { type: 'image', image: base64Image }
          ]
        }
      ]);

      // Parse AI response
      const aiAnalysis = response.completion;
      const plant = this.parsePlantIdentification(aiAnalysis);
      const confidence = this.extractConfidenceScore(aiAnalysis);
      const careTips = this.extractCareTips(aiAnalysis);

      // Get similar plants from database
      const similarPlants = await this.getSimilarPlants(plant.name);

      // Save identification to Supabase for learning
      if (userId) {
        try {
          await SupabaseService.savePlantIdentification({
            user_id: userId,
            image_url: imageUri,
            identified_plant_id: plant.id,
            confidence_score: confidence,
            ai_analysis: aiAnalysis,
            location: 'Unknown', // Could be enhanced with GPS
            weather_conditions: 'Unknown' // Could be enhanced with weather API
          });
        } catch (error) {
          console.log('Failed to save identification to Supabase:', error);
        }
      }

      return {
        plant,
        confidence,
        aiAnalysis,
        careTips,
        similarPlants
      };

    } catch (error) {
      console.error('Error identifying plant:', error);
      
      // Fallback to local database
      const fallbackPlant = await this.getFallbackPlant();
      return {
        plant: fallbackPlant,
        confidence: 50,
        aiAnalysis: 'Unable to identify plant with AI. Here are some general plant care tips.',
        careTips: [
          'Ensure proper lighting for your plant',
          'Water when soil feels dry',
          'Check for pests regularly',
          'Provide adequate humidity'
        ],
        similarPlants: []
      };
    }
  }

  // Enhanced plant health diagnosis with Supabase learning
  static async diagnosePlant(imageUri: string, userId?: string): Promise<{
    diagnosis: string;
    confidence: number;
    treatment: string[];
    prevention: string[];
    severity: 'low' | 'medium' | 'high';
  }> {
    try {
      const base64Image = await this.convertImageToBase64(imageUri);
      
      const systemPrompt = `You are FloraMind AI, a plant health expert. Analyze this plant image for health issues.
      
      Look for:
      - Pests and diseases
      - Nutrient deficiencies
      - Watering issues
      - Light problems
      - Environmental stress
      
      Provide:
      1. Specific diagnosis
      2. Confidence level (0-100)
      3. Treatment steps
      4. Prevention tips
      5. Severity assessment`;

      const userPrompt = `Please diagnose any health issues with this plant and provide treatment recommendations.`;

      const response = await this.callGeminiAPI([
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: [
            { type: 'text', text: userPrompt },
            { type: 'image', image: base64Image }
          ]
        }
      ]);

      const diagnosis = this.extractDiagnosis(response.completion);
      const confidence = this.extractConfidenceScore(response.completion);
      const treatment = this.extractTreatmentSteps(response.completion);
      const prevention = this.extractPreventionTips(response.completion);
      const severity = this.assessSeverity(response.completion);

      return {
        diagnosis,
        confidence,
        treatment,
        prevention,
        severity
      };

    } catch (error) {
      console.error('Error diagnosing plant:', error);
      
      return {
        diagnosis: 'Unable to diagnose plant health issues. Please check for common problems.',
        confidence: 30,
        treatment: [
          'Check soil moisture levels',
          'Inspect for pests',
          'Ensure proper lighting',
          'Consider repotting if needed'
        ],
        prevention: [
          'Maintain consistent watering schedule',
          'Provide adequate light',
          'Keep plant clean',
          'Monitor for early signs of issues'
        ],
        severity: 'low'
      };
    }
  }

  // Enhanced AI chat with plant knowledge
  static async chatWithAI(message: string, userId?: string): Promise<string> {
    try {
      const systemPrompt = `You are FloraMind AI, the world's most advanced plant care assistant. 
      
      You have access to:
      - 10,000+ plant species database
      - Expert botanical knowledge
      - Real-time plant care advice
      - Community insights
      
      Provide helpful, accurate, and friendly plant care advice. Be specific and actionable.`;

      const response = await this.callGeminiAPI([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ]);

      return response.completion;

    } catch (error) {
      console.error('Error in AI chat:', error);
      return 'I apologize, but I\'m having trouble processing your request right now. Please try again later.';
    }
  }

  // Get personalized plant recommendations
  static async getPersonalizedRecommendations(userId: string): Promise<any[]> {
    try {
      // Get user's plant collection
      const userPlants = await SupabaseService.getUserPlants(userId);
      
      // Get user's identification history
      const identifications = await SupabaseService.getUserIdentifications(userId);
      
      // Analyze preferences and recommend plants
      const recommendations = await this.analyzeUserPreferences(userPlants, identifications);
      
      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }

  // Private helper methods
  private static async convertImageToBase64(imageUri: string): Promise<string> {
    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      throw new Error('Failed to convert image to base64');
    }
  }

  private static async callGeminiAPI(messages: CoreMessage[]): Promise<LLMResponse> {
    const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages.map(msg => ({
          role: msg.role,
          parts: Array.isArray(msg.content) 
            ? msg.content.map(part => part.type === 'text' ? { text: part.text } : { inline_data: { mime_type: 'image/jpeg', data: part.image } })
            : [{ text: msg.content }]
        }))
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      completion: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated',
      usage: data.usage_metadata
    };
  }

  private static parsePlantIdentification(aiResponse: string): any {
    // Parse AI response to extract plant information
    const lines = aiResponse.split('\n');
    const plant: any = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Unknown Plant',
      scientific_name: 'Unknown',
      family: 'Unknown',
      care_level: 'medium',
      watering_frequency: 'Weekly',
      light_requirements: 'Bright indirect light',
      soil_type: 'Well-draining potting mix',
      temperature_range: '65-75°F',
      humidity_preference: 'Average',
      common_issues: [],
      care_tips: []
    };

    // Extract plant name
    const nameMatch = aiResponse.match(/Plant name[:\s]+([^\n]+)/i);
    if (nameMatch) plant.name = nameMatch[1].trim();

    // Extract scientific name
    const scientificMatch = aiResponse.match(/Scientific name[:\s]+([^\n]+)/i);
    if (scientificMatch) plant.scientific_name = scientificMatch[1].trim();

    // Extract family
    const familyMatch = aiResponse.match(/Family[:\s]+([^\n]+)/i);
    if (familyMatch) plant.family = familyMatch[1].trim();

    return plant;
  }

  private static extractConfidenceScore(aiResponse: string): number {
    const confidenceMatch = aiResponse.match(/confidence[:\s]+(\d+)/i);
    return confidenceMatch ? parseInt(confidenceMatch[1]) : 75;
  }

  private static extractCareTips(aiResponse: string): string[] {
    const tips: string[] = [];
    const lines = aiResponse.split('\n');
    
    for (const line of lines) {
      if (line.includes('•') || line.includes('-') || line.includes('*')) {
        tips.push(line.replace(/^[•\-*]\s*/, '').trim());
      }
    }
    
    return tips.slice(0, 5); // Return top 5 tips
  }

  private static extractDiagnosis(aiResponse: string): string {
    const lines = aiResponse.split('\n');
    return lines[0] || 'No specific diagnosis available';
  }

  private static extractTreatmentSteps(aiResponse: string): string[] {
    const steps: string[] = [];
    const lines = aiResponse.split('\n');
    
    for (const line of lines) {
      if (line.match(/^\d+\./) || line.includes('•') || line.includes('-')) {
        steps.push(line.replace(/^\d+\.\s*/, '').replace(/^[•\-]\s*/, '').trim());
      }
    }
    
    return steps.slice(0, 5);
  }

  private static extractPreventionTips(aiResponse: string): string[] {
    const tips: string[] = [];
    const lines = aiResponse.split('\n');
    
    for (const line of lines) {
      if (line.toLowerCase().includes('prevent') || line.toLowerCase().includes('avoid')) {
        tips.push(line.trim());
      }
    }
    
    return tips.slice(0, 3);
  }

  private static assessSeverity(aiResponse: string): 'low' | 'medium' | 'high' {
    const response = aiResponse.toLowerCase();
    if (response.includes('severe') || response.includes('critical') || response.includes('urgent')) {
      return 'high';
    } else if (response.includes('moderate') || response.includes('concerning')) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  private static async getSimilarPlants(plantName: string): Promise<any[]> {
    try {
      const plants = await LegendaryPlantDatabase.searchPlants(plantName);
      return plants.slice(0, 3);
    } catch (error) {
      return [];
    }
  }

  private static async getFallbackPlant(): Promise<any> {
    const plants = await LegendaryPlantDatabase.getAllPlants();
    return plants[0] || {
      id: 'fallback',
      name: 'Unknown Plant',
      scientific_name: 'Unknown',
      family: 'Unknown',
      care_level: 'medium',
      watering_frequency: 'Weekly',
      light_requirements: 'Bright indirect light',
      soil_type: 'Well-draining potting mix',
      temperature_range: '65-75°F',
      humidity_preference: 'Average',
      common_issues: [],
      care_tips: []
    };
  }

  private static async analyzeUserPreferences(userPlants: any[], identifications: any[]): Promise<any[]> {
    // Analyze user's plant preferences and recommend similar plants
    const allPlants = await LegendaryPlantDatabase.getAllPlants();
    
    // Simple recommendation logic - can be enhanced with ML
    const recommendations = allPlants
      .filter(plant => !userPlants.some(userPlant => userPlant.plant_id === plant.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
    
    return recommendations;
  }
}
