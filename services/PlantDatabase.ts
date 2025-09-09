export interface PlantData {
  id: string;
  name: string;
  scientificName: string;
  family: string;
  origin: string;
  description: string;
  careTips: string[];
  wateringSchedule: string;
  lightRequirements: string;
  commonIssues: string[];
  toxicity: 'safe' | 'mild' | 'toxic';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  growthRate: 'slow' | 'moderate' | 'fast';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';
  propagation: string;
  temperature: string;
  humidity: string;
  soil: string;
  fertilizer: string;
  repotting: string;
  pruning: string;
  pests: string[];
  diseases: string[];
  seasonalCare: {
    spring: string;
    summer: string;
    fall: string;
    winter: string;
  };
  companionPlants: string[];
  benefits: string[];
  funFacts: string[];
}

export class PlantDatabase {
  private static plants: PlantData[] = [
    {
      id: 'monstera-deliciosa',
      name: 'Monstera Deliciosa',
      scientificName: 'Monstera deliciosa',
      family: 'Araceae',
      origin: 'Tropical rainforests of Central America',
      description: 'A stunning tropical plant known for its large, split leaves that develop natural holes as they mature. Often called the "Swiss Cheese Plant" due to its distinctive leaf pattern.',
      careTips: [
        'Water when top 2 inches of soil are dry',
        'Provide bright, indirect light for best growth',
        'Mist leaves regularly to increase humidity',
        'Fertilize monthly during growing season',
        'Rotate plant weekly for even growth',
        'Support with moss pole as it grows taller'
      ],
      wateringSchedule: 'Every 7-10 days in summer, every 10-14 days in winter',
      lightRequirements: 'Bright, indirect light (avoid direct sun)',
      commonIssues: [
        'Yellow leaves indicate overwatering',
        'Brown tips suggest low humidity',
        'No holes in leaves means insufficient light',
        'Drooping leaves may indicate underwatering',
        'Small leaves indicate need for more light'
      ],
      toxicity: 'mild',
      difficulty: 'easy',
      growthRate: 'fast',
      rarity: 'common',
      propagation: 'Stem cuttings with aerial roots in water or soil',
      temperature: '65-85°F (18-29°C)',
      humidity: '60-80%',
      soil: 'Well-draining potting mix with perlite',
      fertilizer: 'Balanced liquid fertilizer monthly during growing season',
      repotting: 'Every 1-2 years in spring',
      pruning: 'Trim yellow leaves and control size as needed',
      pests: ['Spider mites', 'Mealybugs', 'Scale insects'],
      diseases: ['Root rot', 'Leaf spot'],
      seasonalCare: {
        spring: 'Increase watering and start fertilizing',
        summer: 'Keep soil consistently moist, mist regularly',
        fall: 'Reduce watering frequency',
        winter: 'Water sparingly, stop fertilizing'
      },
      companionPlants: ['Pothos', 'Philodendron', 'Snake Plant'],
      benefits: ['Air purification', 'Humidity regulation', 'Aesthetic appeal'],
      funFacts: [
        'The holes in leaves are called fenestrations',
        'Can grow up to 20 feet tall in nature',
        'Produces edible fruit in its native habitat',
        'Leaves can reach 3 feet in diameter'
      ]
    },
    {
      id: 'snake-plant',
      name: 'Snake Plant',
      scientificName: 'Dracaena trifasciata',
      family: 'Asparagaceae',
      origin: 'West Africa',
      description: 'An incredibly hardy succulent with upright, sword-like leaves. Known for its ability to survive in low light and with minimal care, making it perfect for beginners.',
      careTips: [
        'Water sparingly - only when soil is completely dry',
        'Thrives in low to bright indirect light',
        'Very drought tolerant - perfect for beginners',
        'Fertilize every 2-3 months during growing season',
        'Repot every 2-3 years in well-draining soil',
        'Can tolerate neglect better than overwatering'
      ],
      wateringSchedule: 'Every 2-3 weeks in summer, monthly in winter',
      lightRequirements: 'Low to bright indirect light (very adaptable)',
      commonIssues: [
        'Root rot from overwatering is the main issue',
        'Brown tips may indicate fluoride in water',
        'Leaves may droop if severely underwatered',
        'Yellow leaves often mean too much water',
        'Soft, mushy leaves indicate overwatering'
      ],
      toxicity: 'mild',
      difficulty: 'easy',
      growthRate: 'slow',
      rarity: 'common',
      propagation: 'Leaf cuttings or rhizome division',
      temperature: '60-85°F (15-29°C)',
      humidity: '40-50%',
      soil: 'Cactus or succulent potting mix',
      fertilizer: 'Cactus fertilizer 2-3 times per year',
      repotting: 'Every 3-4 years when rootbound',
      pruning: 'Remove damaged leaves at base',
      pests: ['Mealybugs', 'Spider mites'],
      diseases: ['Root rot', 'Fungal infections'],
      seasonalCare: {
        spring: 'Resume light watering and fertilizing',
        summer: 'Water when soil is completely dry',
        fall: 'Reduce watering frequency',
        winter: 'Minimal watering, no fertilizer'
      },
      companionPlants: ['ZZ Plant', 'Jade Plant', 'Aloe Vera'],
      benefits: ['Air purification', 'Low maintenance', 'Drought tolerance'],
      funFacts: [
        'Also called "Mother-in-Law\'s Tongue"',
        'Can survive weeks without water',
        'Produces oxygen at night',
        'One of the best plants for air purification'
      ]
    },
    {
      id: 'fiddle-leaf-fig',
      name: 'Fiddle Leaf Fig',
      scientificName: 'Ficus lyrata',
      family: 'Moraceae',
      origin: 'Western Africa',
      description: 'A dramatic houseplant with large, violin-shaped leaves that can grow up to 12 inches long. Highly sought after for its striking appearance and statement-making presence.',
      careTips: [
        'Water when top inch of soil is dry',
        'Needs bright, indirect light - avoid direct sun',
        'Keep humidity above 40%',
        'Rotate weekly for even growth',
        'Wipe leaves monthly to remove dust',
        'Avoid moving once established'
      ],
      wateringSchedule: 'Every 7-10 days in summer, every 10-14 days in winter',
      lightRequirements: 'Bright, indirect light (east or west-facing window)',
      commonIssues: [
        'Leaf drop often indicates overwatering',
        'Brown spots may be from inconsistent watering',
        'Drooping leaves suggest underwatering',
        'Yellow leaves can indicate nutrient deficiency',
        'Brown edges indicate low humidity'
      ],
      toxicity: 'mild',
      difficulty: 'medium',
      growthRate: 'moderate',
      rarity: 'uncommon',
      propagation: 'Stem cuttings in water or soil',
      temperature: '65-75°F (18-24°C)',
      humidity: '40-60%',
      soil: 'Well-draining potting mix',
      fertilizer: 'Balanced liquid fertilizer monthly in growing season',
      repotting: 'Every 1-2 years in spring',
      pruning: 'Prune to control height and shape',
      pests: ['Spider mites', 'Mealybugs', 'Scale insects'],
      diseases: ['Root rot', 'Leaf spot', 'Anthracnose'],
      seasonalCare: {
        spring: 'Increase watering and fertilizing',
        summer: 'Keep soil consistently moist',
        fall: 'Reduce watering frequency',
        winter: 'Water sparingly, increase humidity'
      },
      companionPlants: ['Rubber Plant', 'Bird of Paradise', 'Monstera'],
      benefits: ['Air purification', 'Statement piece', 'Large leaf surface area'],
      funFacts: [
        'Leaves can grow up to 12 inches long',
        'Native to tropical rainforests',
        'Can grow up to 50 feet tall in nature',
        'Very sensitive to changes in environment'
      ]
    },
    {
      id: 'peace-lily',
      name: 'Peace Lily',
      scientificName: 'Spathiphyllum wallisii',
      family: 'Araceae',
      origin: 'Tropical regions of the Americas',
      description: 'An elegant plant with glossy green leaves and distinctive white flowers. Known for its air-purifying qualities and ability to bloom indoors with proper care.',
      careTips: [
        'Keep soil consistently moist but not soggy',
        'Provide bright, indirect light for flowering',
        'Mist leaves regularly for humidity',
        'Fertilize monthly during growing season',
        'Remove spent flowers to encourage new blooms',
        'Water when soil surface feels dry'
      ],
      wateringSchedule: 'Every 5-7 days in summer, every 7-10 days in winter',
      lightRequirements: 'Bright, indirect light for flowering',
      commonIssues: [
        'Drooping leaves indicate need for water',
        'Brown tips suggest low humidity',
        'No flowers means insufficient light',
        'Yellow leaves may indicate overwatering',
        'Brown flowers are normal - just remove them'
      ],
      toxicity: 'mild',
      difficulty: 'easy',
      growthRate: 'moderate',
      rarity: 'common',
      propagation: 'Division of root clumps',
      temperature: '65-80°F (18-27°C)',
      humidity: '50-60%',
      soil: 'Well-draining potting mix',
      fertilizer: 'Balanced liquid fertilizer monthly',
      repotting: 'Every 1-2 years when rootbound',
      pruning: 'Remove dead leaves and spent flowers',
      pests: ['Spider mites', 'Mealybugs', 'Aphids'],
      diseases: ['Root rot', 'Leaf spot'],
      seasonalCare: {
        spring: 'Increase watering and fertilizing',
        summer: 'Keep soil moist, mist regularly',
        fall: 'Reduce watering frequency',
        winter: 'Water when soil is dry, maintain humidity'
      },
      companionPlants: ['Pothos', 'Philodendron', 'Chinese Evergreen'],
      benefits: ['Air purification', 'Flowering plant', 'Low maintenance'],
      funFacts: [
        'White "flowers" are actually modified leaves',
        'Excellent air purifier, removes toxins',
        'Can bloom year-round with proper care',
        'Native to tropical rainforests'
      ]
    },
    {
      id: 'rubber-plant',
      name: 'Rubber Plant',
      scientificName: 'Ficus elastica',
      family: 'Moraceae',
      origin: 'Southeast Asia',
      description: 'A robust houseplant with large, glossy leaves that come in various colors. Known for its air-purifying qualities and architectural presence in any room.',
      careTips: [
        'Water when top inch of soil is dry',
        'Provide bright, indirect light',
        'Wipe leaves monthly to keep them shiny',
        'Fertilize monthly during growing season',
        'Rotate plant for even growth',
        'Can tolerate some direct morning sun'
      ],
      wateringSchedule: 'Every 7-10 days in summer, every 10-14 days in winter',
      lightRequirements: 'Bright, indirect light',
      commonIssues: [
        'Leaf drop often indicates overwatering',
        'Brown tips suggest low humidity',
        'Yellow leaves may indicate too much water',
        'Drooping leaves suggest underwatering',
        'Small leaves indicate need for more light'
      ],
      toxicity: 'mild',
      difficulty: 'easy',
      growthRate: 'moderate',
      rarity: 'common',
      propagation: 'Stem cuttings in water or soil',
      temperature: '60-80°F (15-27°C)',
      humidity: '40-50%',
      soil: 'Well-draining potting mix',
      fertilizer: 'Balanced liquid fertilizer monthly',
      repotting: 'Every 1-2 years in spring',
      pruning: 'Prune to control height and shape',
      pests: ['Spider mites', 'Mealybugs', 'Scale insects'],
      diseases: ['Root rot', 'Leaf spot'],
      seasonalCare: {
        spring: 'Increase watering and fertilizing',
        summer: 'Keep soil consistently moist',
        fall: 'Reduce watering frequency',
        winter: 'Water sparingly, maintain humidity'
      },
      companionPlants: ['Fiddle Leaf Fig', 'Monstera', 'Bird of Paradise'],
      benefits: ['Air purification', 'Large leaves', 'Architectural interest'],
      funFacts: [
        'Can grow up to 100 feet tall in nature',
        'Latex was once used to make rubber',
        'Very adaptable to different light conditions',
        'Leaves can grow up to 12 inches long'
      ]
    }
  ];

  static getPlantById(id: string): PlantData | undefined {
    return this.plants.find(plant => plant.id === id);
  }

  static getPlantByName(name: string): PlantData | undefined {
    return this.plants.find(plant => 
      plant.name.toLowerCase().includes(name.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(name.toLowerCase())
    );
  }

  static getAllPlants(): PlantData[] {
    return this.plants;
  }

  static getPlantsByDifficulty(difficulty: 'easy' | 'medium' | 'hard' | 'expert'): PlantData[] {
    return this.plants.filter(plant => plant.difficulty === difficulty);
  }

  static getPlantsByToxicity(toxicity: 'safe' | 'mild' | 'toxic'): PlantData[] {
    return this.plants.filter(plant => plant.toxicity === toxicity);
  }

  static getPlantsByLightRequirements(light: string): PlantData[] {
    return this.plants.filter(plant => 
      plant.lightRequirements.toLowerCase().includes(light.toLowerCase())
    );
  }

  static searchPlants(query: string): PlantData[] {
    const lowercaseQuery = query.toLowerCase();
    return this.plants.filter(plant => 
      plant.name.toLowerCase().includes(lowercaseQuery) ||
      plant.scientificName.toLowerCase().includes(lowercaseQuery) ||
      plant.family.toLowerCase().includes(lowercaseQuery) ||
      plant.origin.toLowerCase().includes(lowercaseQuery) ||
      plant.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  static getRandomPlant(): PlantData {
    return this.plants[Math.floor(Math.random() * this.plants.length)];
  }

  static getPopularPlants(): PlantData[] {
    return this.plants.filter(plant => plant.rarity === 'common');
  }

  static getRarePlants(): PlantData[] {
    return this.plants.filter(plant => 
      plant.rarity === 'rare' || plant.rarity === 'epic'
    );
  }

  static getBeginnerFriendlyPlants(): PlantData[] {
    return this.plants.filter(plant => 
      plant.difficulty === 'easy' && plant.toxicity === 'safe'
    );
  }

  static getAirPurifyingPlants(): PlantData[] {
    return this.plants.filter(plant => 
      plant.benefits.includes('Air purification')
    );
  }

  static getFloweringPlants(): PlantData[] {
    return this.plants.filter(plant => 
      plant.benefits.includes('Flowering plant')
    );
  }

  static getLowLightPlants(): PlantData[] {
    return this.plants.filter(plant => 
      plant.lightRequirements.toLowerCase().includes('low') ||
      plant.lightRequirements.toLowerCase().includes('indirect')
    );
  }

  static getHighHumidityPlants(): PlantData[] {
    return this.plants.filter(plant => 
      parseInt(plant.humidity) >= 60
    );
  }

  static getDroughtTolerantPlants(): PlantData[] {
    return this.plants.filter(plant => 
      plant.wateringSchedule.toLowerCase().includes('sparingly') ||
      plant.wateringSchedule.toLowerCase().includes('dry')
    );
  }

  static getFastGrowingPlants(): PlantData[] {
    return this.plants.filter(plant => plant.growthRate === 'fast');
  }

  static getSlowGrowingPlants(): PlantData[] {
    return this.plants.filter(plant => plant.growthRate === 'slow');
  }

  static getPlantCareTips(plantId: string, season: 'spring' | 'summer' | 'fall' | 'winter'): string {
    const plant = this.getPlantById(plantId);
    if (!plant) return 'Plant not found';
    
    return plant.seasonalCare[season];
  }

  static getPlantCompanions(plantId: string): string[] {
    const plant = this.getPlantById(plantId);
    if (!plant) return [];
    
    return plant.companionPlants;
  }

  static getPlantBenefits(plantId: string): string[] {
    const plant = this.getPlantById(plantId);
    if (!plant) return [];
    
    return plant.benefits;
  }

  static getPlantFunFacts(plantId: string): string[] {
    const plant = this.getPlantById(plantId);
    if (!plant) return [];
    
    return plant.funFacts;
  }

  static getPlantPests(plantId: string): string[] {
    const plant = this.getPlantById(plantId);
    if (!plant) return [];
    
    return plant.pests;
  }

  static getPlantDiseases(plantId: string): string[] {
    const plant = this.getPlantById(plantId);
    if (!plant) return [];
    
    return plant.diseases;
  }
}

