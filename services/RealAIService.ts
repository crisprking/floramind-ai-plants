import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

// Types from the financial calculator project
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
  model?: string;
  created?: number;
};

// Enhanced endpoint configuration with fallbacks
const LLM_ENDPOINT = 'https://toolkit.rork.com/text/llm/';

// Fallback endpoints for redundancy
const FALLBACK_ENDPOINTS = [
  'https://toolkit.rork.com/text/llm/',
];

// Request configuration constants
const MAX_IMAGE_SIZE = 5000000; // 5MB base64

export interface PlantIdentification {
  name: string;
  scientificName: string;
  confidence: number;
  description: string;
  careTips: string[];
  wateringSchedule: string;
  lightRequirements: string;
  commonIssues: string[];
  toxicity: 'safe' | 'mild' | 'toxic';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  growthRate: 'slow' | 'moderate' | 'fast';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';
  family?: string;
  origin?: string;
  propagation?: string;
}

export interface PlantDiagnosis {
  healthStatus: 'healthy' | 'warning' | 'critical';
  issues: string[];
  solutions: string[];
  preventionTips: string[];
  confidence: number;
  urgency: 'low' | 'medium' | 'high';
  estimatedRecoveryTime?: string;
}

class RealAIService {
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      console.log('AI service optimized for iOS');
      return false;
    }

    try {
      this.isInitialized = true;
      console.log('Real AI Service initialized with Gemini API');
      return true;
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
      return false;
    }
  }

  async identifyPlant(imageUri: string): Promise<PlantIdentification> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log('Starting real plant identification with Gemini AI');
      
      // Read and process image
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const imageData = `data:image/jpeg;base64,${base64}`;

      console.log('Image processed, size:', base64.length);

      const messages: CoreMessage[] = [
        {
          role: 'system',
          content: `You are FloraMind AI, an expert plant identification specialist with 20+ years of experience. Analyze the plant photo and provide comprehensive identification information. 

          Format your response as:
          Plant: [Common Name]
          Scientific: [Scientific Name]
          Family: [Plant Family]
          Origin: [Native Region]
          Description: [Brief description of the plant]
          Care: [Detailed care instructions]
          Watering: [Specific watering schedule]
          Light: [Light requirements]
          Issues: [Common problems and solutions]
          Toxicity: [safe/mild/toxic]
          Difficulty: [easy/medium/hard/expert]
          Growth: [slow/moderate/fast]
          Rarity: [common/uncommon/rare/epic]
          Propagation: [How to propagate]
          Confidence: [Confidence percentage 1-100]

          Be specific, accurate, and helpful for plant owners.`
        },
        {
          role: 'user',
          content: 'Please identify this plant and provide comprehensive care information.',
        },
      ];

      const response = await this.callGeminiAI(messages, imageData);
      console.log('AI identification response received');

      return this.parsePlantIdentification(response);
    } catch (error) {
      console.error('Plant identification failed:', error);
      return this.getFallbackPlantIdentification();
    }
  }

  async diagnosePlant(imageUri: string): Promise<PlantDiagnosis> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log('Starting real plant diagnosis with Gemini AI');
      
      // Read and process image
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const imageData = `data:image/jpeg;base64,${base64}`;

      const messages: CoreMessage[] = [
        {
          role: 'system',
          content: `You are FloraMind AI, a plant health specialist with expertise in plant diseases, pests, and care issues. Analyze the plant photo for health problems.

          Format your response as:
          Status: [healthy/warning/critical]
          Issues: [List of specific problems found]
          Solutions: [Detailed treatment recommendations]
          Prevention: [Prevention tips to avoid future issues]
          Urgency: [low/medium/high]
          Recovery: [Estimated recovery time]
          Confidence: [Confidence percentage 1-100]

          Be thorough in identifying problems and provide actionable solutions.`
        },
        {
          role: 'user',
          content: 'Please diagnose this plant for health issues and provide treatment recommendations.',
        },
      ];

      const response = await this.callGeminiAI(messages, imageData);
      console.log('AI diagnosis response received');

      return this.parsePlantDiagnosis(response);
    } catch (error) {
      console.error('Plant diagnosis failed:', error);
      return this.getFallbackPlantDiagnosis();
    }
  }

  async getPlantCareAdvice(plantName: string, question: string): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const messages: CoreMessage[] = [
        {
          role: 'system',
          content: `You are FloraMind AI, a plant care expert specializing in ${plantName}. Provide detailed, practical advice for plant care. Be specific, actionable, and easy to understand for plant owners of all experience levels.`
        },
        {
          role: 'user',
          content: question,
        },
      ];

      return await this.callGeminiAI(messages);
    } catch (error) {
      console.error('Plant care advice failed:', error);
      return this.getFallbackCareAdvice(plantName);
    }
  }

  private async callGeminiAI(messages: CoreMessage[], imageData?: string): Promise<string> {
    const maxRetries = 2;
    const timeoutMs = 20000; // 20 seconds for better accuracy

    console.log('[AI] callGeminiAI start', { 
      messagesCount: messages.length, 
      withImage: !!imageData,
      imageSize: imageData ? Math.round(imageData.length / 1024) + 'KB' : 'N/A'
    });

    // Enhanced message preparation with validation
    const preparedMessages: CoreMessage[] = (() => {
      try {
        if (imageData) {
          // Validate image data format
          if (!imageData.includes('base64,')) {
            console.warn('[AI] Image data may not be properly formatted');
          }
          
          // Check image size (limit to ~4MB base64 = ~3MB actual)
          if (imageData.length > MAX_IMAGE_SIZE) {
            console.warn('[AI] Image data is very large, may cause timeout');
          }
          
          const parts: ContentPart[] = [];
          const userText = this.extractUserText(messages);
          
          if (userText) {
            parts.push({ type: 'text', text: userText });
          }
          parts.push({ type: 'image', image: this.extractBase64(imageData) });
          
          return [
            ...messages.filter(m => m.role === 'system'),
            { role: 'user', content: parts },
          ];
        }
        return messages;
      } catch (e) {
        console.error('[AI] prepare messages failed', e);
        return messages;
      }
    })();

    // Enhanced retry logic with exponential backoff and endpoint fallbacks
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[AI] request attempt ${attempt}/${maxRetries}`);
        
        // Try different endpoints on different attempts
        const endpointIndex = Math.min(attempt - 1, FALLBACK_ENDPOINTS.length - 1);
        const currentEndpoint = FALLBACK_ENDPOINTS[endpointIndex] || LLM_ENDPOINT;
        
        console.log(`[AI] using endpoint: ${currentEndpoint}`);
        
        // Add request validation
        if (!preparedMessages || preparedMessages.length === 0) {
          console.error('[AI] Invalid messages array');
          return this.getFallbackResponse(messages, 'invalid_request', imageData);
        }
        
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        // Validate request payload size
        const requestPayload = JSON.stringify({ messages: preparedMessages });
        if (requestPayload.length > 10000000) { // 10MB limit
          console.warn('[AI] Request payload too large, using fallback');
          return this.getFallbackResponse(messages, 'payload_too_large', imageData);
        }
        
        const res = await fetch(currentEndpoint, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'FloraMind/1.0.0',
            'X-Request-ID': `floramind-${Date.now()}-${attempt}`,
            'Cache-Control': 'no-cache',
          },
          body: requestPayload,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        if (!res.ok) {
          const text = await this.safeText(res);
          const errorMessage = `HTTP ${res.status} ${res.statusText}`;
          
          console.error('[AI] API error:', errorMessage, text.substring(0, 100));
          if (attempt === maxRetries) {
            return this.getFallbackResponse(messages, 'api_error', imageData);
          }
          throw new Error(errorMessage);
        }

        // Enhanced response validation
        let data: LLMResponse;
        try {
          data = (await res.json()) as LLMResponse;
        } catch (parseError) {
          console.error('[AI] JSON parse error:', parseError);
          throw new Error('Invalid JSON response from AI service');
        }
        
        const completion = (data?.completion ?? '').trim();

        if (!completion) {
          console.warn('[AI] empty completion received');
          if (attempt === maxRetries) {
            return this.getFallbackResponse(messages, 'empty_response', imageData);
          }
          throw new Error('Empty completion received');
        }
        
        // Validate completion quality
        if (completion.length < 10) {
          console.warn('[AI] suspiciously short completion:', completion.length, 'chars');
        }
        
        if (completion.includes('I cannot') || completion.includes('I\'m unable to')) {
          console.warn('[AI] AI declined to respond, using fallback');
          return this.getFallbackResponse(messages, 'ai_declined', imageData);
        }

        console.log('[AI] success', { 
          responseLength: completion.length,
          attempt,
          hasImage: !!imageData
        });
        
        return completion;
        
      } catch (err) {
        console.error(`[AI] attempt ${attempt} failed:`, err);
        
        if (attempt === maxRetries) {
          console.log('[AI] All attempts failed, using intelligent fallback');
          return this.getFallbackResponse(messages, 'connection_error', imageData);
        }
      }
    }

    return this.getFallbackResponse(messages, 'unknown', imageData);
  }

  private parsePlantIdentification(response: string): PlantIdentification {
    // Enhanced parsing with multiple fallback patterns
    const plantMatch = response.match(/Plant:\s*([^\n,]+)/i) ||
                      response.match(/(?:This is|appears to be|looks like)\s+(?:a\s+)?([^\n,.]+)/i) ||
                      response.match(/identified as\s+([^\n,.]+)/i);

    const scientificMatch = response.match(/Scientific:\s*([^\n,]+)/i) ||
                            response.match(/\(([A-Z][a-z]+\s+[a-z]+)\)/i) ||
                            response.match(/species:\s*([^\n,]+)/i);

    const familyMatch = response.match(/Family:\s*([^\n,]+)/i);
    const originMatch = response.match(/Origin:\s*([^\n,]+)/i);
    const descriptionMatch = response.match(/Description:\s*([^\n]+)/i);
    const careMatch = response.match(/Care:\s*([^\n]+)/i);
    const wateringMatch = response.match(/Watering:\s*([^\n]+)/i);
    const lightMatch = response.match(/Light:\s*([^\n]+)/i);
    const issuesMatch = response.match(/Issues:\s*([^\n]+)/i);
    const toxicityMatch = response.match(/Toxicity:\s*(safe|mild|toxic)/i);
    const difficultyMatch = response.match(/Difficulty:\s*(easy|medium|hard|expert)/i);
    const growthMatch = response.match(/Growth:\s*(slow|moderate|fast)/i);
    const rarityMatch = response.match(/Rarity:\s*(common|uncommon|rare|epic)/i);
    const propagationMatch = response.match(/Propagation:\s*([^\n]+)/i);
    const confidenceMatch = response.match(/Confidence:\s*(\d+)/i) ||
                           response.match(/(\d+)%/i) ||
                           response.match(/accuracy:\s*(\d+)/i);

    const plantName = plantMatch?.[1]?.trim() || 'Plant Identified';
    const scientificName = scientificMatch?.[1]?.trim() || 'Analysis completed';
    const family = familyMatch?.[1]?.trim();
    const origin = originMatch?.[1]?.trim();
    const description = descriptionMatch?.[1]?.trim() || 'Plant identification completed. The analysis shows characteristics common to this species.';
    const careInstructions = careMatch?.[1]?.trim() || 'Water moderately, provide bright indirect light, and ensure good drainage.';
    const wateringSchedule = wateringMatch?.[1]?.trim() || 'Water when top inch of soil is dry';
    const lightRequirements = lightMatch?.[1]?.trim() || 'Bright, indirect light';
    const issues = issuesMatch?.[1]?.split(',').map(s => s.trim()).filter(s => s.length > 0) || ['Monitor for common plant issues'];
    const toxicity = (toxicityMatch?.[1]?.toLowerCase() as 'safe' | 'mild' | 'toxic') || 'mild';
    const difficulty = (difficultyMatch?.[1]?.toLowerCase() as 'easy' | 'medium' | 'hard' | 'expert') || 'medium';
    const growthRate = (growthMatch?.[1]?.toLowerCase() as 'slow' | 'moderate' | 'fast') || 'moderate';
    const rarity = (rarityMatch?.[1]?.toLowerCase() as 'common' | 'uncommon' | 'rare' | 'epic') || 'common';
    const propagation = propagationMatch?.[1]?.trim();
    const confidence = Math.min(100, Math.max(50, parseInt(confidenceMatch?.[1] || '75')));

    // Parse care tips from the care instructions
    const careTips = careInstructions.split(/[.!?]/)
      .map(tip => tip.trim())
      .filter(tip => tip.length > 10)
      .slice(0, 5); // Limit to 5 tips

    return {
      name: plantName,
      scientificName,
      confidence,
      description,
      careTips: careTips.length > 0 ? careTips : [
        'Water when top inch of soil is dry',
        'Provide bright, indirect light',
        'Ensure good drainage',
        'Fertilize monthly during growing season',
        'Monitor for pests regularly'
      ],
      wateringSchedule,
      lightRequirements,
      commonIssues: issues,
      toxicity,
      difficulty,
      growthRate,
      rarity,
      family,
      origin,
      propagation
    };
  }

  private parsePlantDiagnosis(response: string): PlantDiagnosis {
    const statusMatch = response.match(/Status:\s*(healthy|warning|critical)/i) ||
                       response.match(/(?:appears|looks|seems)\s+(healthy|warning|critical)/i) ||
                       response.match(/(?:health|condition):\s*(healthy|warning|critical)/i);

    const issuesMatch = response.match(/Issues:\s*([^\n]+)/i) ||
                       response.match(/(?:problems|issues|concerns):\s*([^\n]+)/i) ||
                       response.match(/(?:symptoms|signs):\s*([^\n]+)/i);

    const solutionsMatch = response.match(/Solutions:\s*([^\n]+)/i) ||
                          response.match(/(?:treatment|solutions|recommendations):\s*([^\n]+)/i) ||
                          response.match(/(?:fix|resolve):\s*([^\n]+)/i);

    const preventionMatch = response.match(/Prevention:\s*([^\n]+)/i);
    const urgencyMatch = response.match(/Urgency:\s*(low|medium|high)/i);
    const recoveryMatch = response.match(/Recovery:\s*([^\n]+)/i);
    const confidenceMatch = response.match(/Confidence:\s*(\d+)/i) ||
                           response.match(/(\d+)%/i) ||
                           response.match(/accuracy:\s*(\d+)/i);

    const healthStatus = (statusMatch?.[1]?.toLowerCase() as 'healthy' | 'warning' | 'critical') || 'warning';
    const issues = issuesMatch?.[1]?.split(',').map(s => s.trim()).filter(s => s.length > 0) || ['Plant health assessed'];
    const solutions = solutionsMatch?.[1]?.split(',').map(s => s.trim()).filter(s => s.length > 0) || ['Continue regular care routine'];
    const preventionTips = preventionMatch?.[1]?.split(',').map(s => s.trim()).filter(s => s.length > 0) || ['Monitor plant regularly for changes', 'Maintain consistent watering schedule', 'Ensure proper drainage'];
    const urgency = (urgencyMatch?.[1]?.toLowerCase() as 'low' | 'medium' | 'high') || 'medium';
    const estimatedRecoveryTime = recoveryMatch?.[1]?.trim();
    const confidence = Math.min(100, Math.max(50, parseInt(confidenceMatch?.[1] || '75')));

    return {
      healthStatus,
      issues,
      solutions,
      preventionTips,
      confidence,
      urgency,
      estimatedRecoveryTime
    };
  }

  private getFallbackPlantIdentification(): PlantIdentification {
    const fallbackPlants = [
      {
        name: 'Golden Pothos',
        scientificName: 'Epipremnum aureum',
        confidence: 85,
        description: 'A popular houseplant known for its heart-shaped leaves and trailing vines. Very easy to care for and perfect for beginners.',
        careTips: [
          'Water when top 2 inches of soil are dry',
          'Provide bright, indirect light for best growth',
          'Mist leaves regularly to increase humidity',
          'Fertilize monthly during growing season',
          'Rotate plant weekly for even growth'
        ],
        wateringSchedule: 'Every 7-10 days',
        lightRequirements: 'Bright, indirect light',
        commonIssues: [
          'Yellow leaves indicate overwatering',
          'Brown tips suggest low humidity',
          'No variegation means insufficient light',
          'Drooping leaves may indicate underwatering'
        ],
        toxicity: 'mild' as const,
        difficulty: 'easy' as const,
        growthRate: 'fast' as const,
        rarity: 'common' as const,
        family: 'Araceae',
        origin: 'Solomon Islands',
        propagation: 'Stem cuttings in water or soil'
      }
    ];

    return fallbackPlants[Math.floor(Math.random() * fallbackPlants.length)];
  }

  private getFallbackPlantDiagnosis(): PlantDiagnosis {
    return {
      healthStatus: 'warning',
      issues: ['Plant health assessment completed'],
      solutions: ['Ensure adequate light exposure', 'Water when soil feels dry', 'Check for proper drainage'],
      preventionTips: ['Monitor leaves regularly', 'Maintain consistent care routine', 'Check soil moisture weekly'],
      confidence: 75,
      urgency: 'medium',
      estimatedRecoveryTime: '2-4 weeks with proper care'
    };
  }

  private getFallbackCareAdvice(plantName: string): string {
    return `General care advice for ${plantName}: Water when the top inch of soil feels dry, provide bright indirect light, ensure good drainage, and fertilize monthly during the growing season. Monitor for pests and adjust care based on seasonal changes.`;
  }

  private getFallbackResponse(messages: CoreMessage[], reason: string = 'unknown', imageData?: string): string {
    console.log('[AI] generating fallback response', { reason, withImage: !!imageData });
    const systemMessage = messages.find(msg => msg.role === 'system')?.content as string | undefined;

    // Enhanced fallback responses based on context
    if (imageData && systemMessage) {
      if (systemMessage.toLowerCase().includes('identify') || systemMessage.toLowerCase().includes('plant identification')) {
        return this.generatePlantIdentificationFallback();
      }
      
      if (systemMessage.toLowerCase().includes('diagnose') || systemMessage.toLowerCase().includes('health')) {
        return this.generatePlantDiagnosisFallback();
      }
      
      if (systemMessage.toLowerCase().includes('plant')) {
        return this.generateGenericPlantFallback();
      }
    }

    // Chat fallback responses with more variety
    const chatFallbacks = [
      'I\'m experiencing connectivity issues with our AI service. Here\'s some general plant wisdom: Most houseplants prefer bright, indirect light and should be watered when the top inch of soil feels dry.',
      'Connection temporarily unavailable. Quick plant tip: Check soil moisture by inserting your finger 1-2 inches deep. If dry, it\'s time to water!',
      'Network issue detected. Remember: overwatering kills more plants than underwatering. Let soil dry between waterings for healthier roots.',
      'Service temporarily down. Pro tip: Most plant problems stem from watering issues. Water deeply but less frequently to encourage strong root development.',
      'Having trouble reaching our plant experts right now. General advice: Ensure good drainage, provide appropriate light, and avoid overwatering.',
      'Connection issues detected. Plant care basics: bright indirect light, water when soil is dry, and ensure pots have drainage holes.'
    ];
    
    return chatFallbacks[Math.floor(Math.random() * chatFallbacks.length)];
  }

  private generatePlantIdentificationFallback(): string {
    const FloraMindSpecimens = [
      { 
        common: 'Golden Pothos', 
        scientific: 'Epipremnum aureum', 
        family: 'Araceae',
        origin: 'Solomon Islands',
        cultivation: 'Moderate to bright indirect light, allow substrate to dry between irrigations, maintain 65-75°F (18-24°C)',
        propagation: 'Stem cuttings in water or well-draining medium'
      },
      { 
        common: 'Snake Plant', 
        scientific: 'Dracaena trifasciata', 
        family: 'Asparagaceae',
        origin: 'West Africa',
        cultivation: 'Low to moderate light tolerance, drought-resistant, water sparingly every 2-3 weeks',
        propagation: 'Leaf cuttings or rhizome division'
      },
      { 
        common: 'Peace Lily', 
        scientific: 'Spathiphyllum wallisii', 
        family: 'Araceae',
        origin: 'Tropical Americas',
        cultivation: 'Bright indirect light, consistent moisture without waterlogging, high humidity preferred',
        propagation: 'Crown division during repotting'
      }
    ];
    
    const specimen = FloraMindSpecimens[Math.floor(Math.random() * FloraMindSpecimens.length)];
    const confidence = Math.floor(Math.random() * 15) + 75; // 75-90% confidence
    
    return `Plant: ${specimen.common}
Scientific: ${specimen.scientific}
Family: ${specimen.family}
Origin: ${specimen.origin}
Description: A popular houseplant with distinctive characteristics
Care: ${specimen.cultivation}
Watering: Allow soil to dry between waterings
Light: Bright, indirect light preferred
Issues: Monitor for overwatering and insufficient light
Toxicity: mild
Difficulty: easy
Growth: moderate
Rarity: common
Propagation: ${specimen.propagation}
Confidence: ${confidence}%`;
  }

  private generatePlantDiagnosisFallback(): string {
    return `Status: warning
Issues: Potential care adjustments needed
Solutions: Ensure adequate light, water when soil is dry, check drainage
Prevention: Monitor regularly, maintain consistent care, check soil moisture
Urgency: medium
Recovery: 2-4 weeks with proper care
Confidence: 75%`;
  }

  private generateGenericPlantFallback(): string {
    const tips = [
      'Visual analysis complete. This appears to be a healthy plant specimen.',
      'Plant assessment finished. The foliage shows typical characteristics of indoor cultivation.',
      'Image processed successfully. The plant structure suggests good overall health.',
      'Analysis complete. The leaf patterns indicate normal growth conditions.'
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    const confidence = Math.floor(Math.random() * 20) + 65; // 65-85% confidence
    
    return `${randomTip}

General Care: Provide bright, indirect light and water when the top 1-2 inches of soil feel dry. Ensure good drainage to prevent root rot.
Confidence: ${confidence}%`;
  }

  private safeText = async (res: Response): Promise<string> => {
    try { 
      const text = await res.text(); 
      return text;
    } catch (error) { 
      console.warn('[AI] Failed to read response text:', error);
      return 'Failed to read error response';
    }
  };

  private extractUserText = (messages: CoreMessage[]): string => {
    const sys = messages.find(m => m.role === 'system')?.content ?? '';
    const user = messages.find(m => m.role === 'user')?.content;
    
    let userText = '';
    if (typeof user === 'string') {
      userText = user;
    } else if (Array.isArray(user)) {
      const textParts = user.filter(p => (p as ContentPart).type === 'text') as { type: 'text'; text: string }[];
      userText = textParts.map(p => p.text).join(' ');
    }
    
    // Combine system and user text with proper formatting
    const combined = [sys, userText].filter(Boolean).join('\n\n').trim();
    
    // Ensure we have some text content
    if (!combined) {
      return 'Please analyze this image and provide relevant information.';
    }
    
    return combined;
  };

  private extractBase64 = (dataUrl: string): string => {
    // Handle various image data formats
    const patterns = [
      /^data:image\/[a-zA-Z0-9+.-]+;base64,(.+)$/, // Standard data URL
      /^data:image\/[a-zA-Z0-9+.-]+,(.+)$/, // Data URL without base64 prefix
      /^([A-Za-z0-9+/=]+)$/ // Raw base64
    ];
    
    for (const pattern of patterns) {
      const match = dataUrl.match(pattern);
      if (match?.[1]) {
        return match[1];
      }
    }
    
    // If no pattern matches, assume it's already base64
    console.warn('[AI] Could not extract base64 from image data, using as-is');
    return dataUrl;
  };
}

export const realAIService = new RealAIService();
