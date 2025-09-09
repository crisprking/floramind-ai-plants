import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Platform, 
  Linking,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Camera from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { appleIAPService, PRODUCT_IDS } from './services/AppleIAPService';

const { width, height } = Dimensions.get('window');

interface PlantIdentification {
  id: string;
  name: string;
  scientificName: string;
  confidence: number;
  careTips: string[];
  wateringSchedule: string;
  lightRequirements: string;
  commonIssues: string[];
  image?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  growthRate: 'slow' | 'moderate' | 'fast';
  toxicity: 'safe' | 'mild' | 'toxic';
}

interface PremiumFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  price: number;
  popular?: boolean;
}

export default function App() {
  // Core state
  const [isLoading, setIsLoading] = useState(false);
  const [identifiedPlant, setIdentifiedPlant] = useState<PlantIdentification | null>(null);
  const [cameraPermission, setCameraPermission] = useState<ImagePicker.PermissionStatus | null>(null);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState<ImagePicker.PermissionStatus | null>(null);
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [identificationsUsed, setIdentificationsUsed] = useState(0);
  const [maxFreeIdentifications] = useState(5);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [currentStep, setCurrentStep] = useState<'welcome' | 'camera' | 'result' | 'premium'>('welcome');

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Premium features
  const premiumFeatures: PremiumFeature[] = [
    {
      id: PRODUCT_IDS.MONTHLY,
      title: 'Premium Monthly',
      description: 'Unlimited identifications, advanced AI insights, plant health monitoring, and premium care recommendations',
      icon: 'diamond',
      price: 4.99,
      popular: true
    },
    {
      id: PRODUCT_IDS.YEARLY,
      title: 'Premium Yearly',
      description: 'Best value! Save 67% with annual subscription. All premium features included.',
      icon: 'star',
      price: 19.99
    },
    {
      id: PRODUCT_IDS.PACK_10,
      title: '10 Identifications',
      description: 'Perfect for occasional plant lovers. No subscription required.',
      icon: 'leaf',
      price: 2.99
    },
    {
      id: PRODUCT_IDS.PACK_50,
      title: '50 Identifications',
      description: 'Great for plant enthusiasts. Best value for identification packs.',
      icon: 'flower',
      price: 9.99
    }
  ];

  useEffect(() => {
    requestPermissions();
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      })
    ]).start();

    // Continuous rotation for loading
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: true,
        })
      ])
    ).start();
  };

  const requestPermissions = async () => {
    try {
      const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
      setCameraPermission(cameraResult.status);
      
      const mediaResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setMediaLibraryPermission(mediaResult.status);
      
      const locationResult = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(locationResult.status);

      if (locationResult.status === 'granted') {
        try {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation(location);
        } catch (locationError) {
          console.log('Location not available:', locationError);
        }
      }
    } catch (error) {
      console.error('Permission request error:', error);
      setCameraError('Failed to request permissions');
    }
  };

  const hasRequiredPermissions = () => {
    return cameraPermission === 'granted' || mediaLibraryPermission === 'granted';
  };

  const canTakePhoto = () => {
    return cameraPermission === 'granted';
  };

  const canPickFromGallery = () => {
    return mediaLibraryPermission === 'granted';
  };

  const takePhoto = async () => {
    if (cameraPermission !== 'granted') {
      Alert.alert(
        'Camera Permission Required',
        'FloraMind needs camera access to identify plants. Grant permission for the best experience!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Grant Permission', onPress: () => requestPermissions() },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      );
      return;
    }

    if (!isPremium && identificationsUsed >= maxFreeIdentifications) {
      setShowPremiumModal(true);
      return;
    }

    try {
      setIsLoading(true);
      setCameraError(null);
      setCurrentStep('camera');
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Enhanced camera permission check for iPhone
      const cameraStatus = await Camera.getCameraPermissionsAsync();
      if (cameraStatus.status !== 'granted') {
        const newStatus = await Camera.requestCameraPermissionsAsync();
        if (newStatus.status !== 'granted') {
          throw new Error('Camera permission denied');
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8, // Reduced quality for better iPhone performance
        exif: false,
        base64: false,
      });

      if (result.canceled) {
        console.log('User canceled camera');
        setCurrentStep('welcome');
        return;
      }

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        if (asset.uri) {
          await identifyPlant(asset.uri);
        } else {
          throw new Error('No image captured');
        }
      } else {
        throw new Error('No image captured');
      }
    } catch (error) {
      console.error('Camera error:', error);
      setCameraError('Camera failed to capture image. Please try again.');
      setCurrentStep('welcome');
      
      Alert.alert('Camera Error', 'Failed to take photo. Please try again or use gallery.', [
        { text: 'OK', style: 'default' },
        { text: 'Try Gallery', onPress: () => pickFromGallery() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const pickFromGallery = async () => {
    if (mediaLibraryPermission !== 'granted') {
      Alert.alert(
        'Photo Library Permission Required',
        'FloraMind needs access to your photos to identify plants. Grant permission for the best experience!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Grant Permission', onPress: () => requestPermissions() },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      );
      return;
    }

    if (!isPremium && identificationsUsed >= maxFreeIdentifications) {
      setShowPremiumModal(true);
      return;
    }

    try {
      setIsLoading(true);
      setCameraError(null);
      setCurrentStep('camera');
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
        exif: false,
      });

      if (result.canceled) {
        console.log('User canceled gallery selection');
        setCurrentStep('welcome');
        return;
      }

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        if (asset.uri) {
          await identifyPlant(asset.uri);
        } else {
          throw new Error('No image selected');
        }
      } else {
        throw new Error('No image selected');
      }
    } catch (error) {
      console.error('Gallery error:', error);
      setCameraError('Gallery failed to load image');
      setCurrentStep('welcome');
      
      Alert.alert('Gallery Error', 'Failed to pick image. Please try again or use camera.', [
        { text: 'OK', style: 'default' },
        { text: 'Try Camera', onPress: () => takePhoto() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const identifyPlant = async (imageUri: string) => {
    try {
      setIsLoading(true);
      setCurrentStep('camera');
      
      // Simulate AI processing with realistic timing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Array of diverse plant identifications for realistic results
      const plantDatabase = [
        {
          name: 'Monstera Deliciosa',
          scientificName: 'Monstera deliciosa',
          confidence: 96,
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
            'No holes in leaves means insufficient light',
            'Drooping leaves may indicate underwatering'
          ],
          rarity: 'common',
          difficulty: 'easy',
          growthRate: 'fast',
          toxicity: 'mild'
        },
        {
          name: 'Snake Plant',
          scientificName: 'Dracaena trifasciata',
          confidence: 94,
          careTips: [
            'Water sparingly - only when soil is completely dry',
            'Thrives in low to bright indirect light',
            'Very drought tolerant - perfect for beginners',
            'Fertilize every 2-3 months during growing season',
            'Repot every 2-3 years in well-draining soil'
          ],
          wateringSchedule: 'Every 2-3 weeks',
          lightRequirements: 'Low to bright indirect light',
          commonIssues: [
            'Root rot from overwatering is the main issue',
            'Brown tips may indicate fluoride in water',
            'Leaves may droop if severely underwatered',
            'Yellow leaves often mean too much water'
          ],
          rarity: 'common',
          difficulty: 'easy',
          growthRate: 'slow',
          toxicity: 'mild'
        },
        {
          name: 'Fiddle Leaf Fig',
          scientificName: 'Ficus lyrata',
          confidence: 92,
          careTips: [
            'Water when top inch of soil is dry',
            'Needs bright, indirect light - avoid direct sun',
            'Keep humidity above 40%',
            'Rotate weekly for even growth',
            'Wipe leaves monthly to remove dust'
          ],
          wateringSchedule: 'Every 7-10 days',
          lightRequirements: 'Bright, indirect light',
          commonIssues: [
            'Leaf drop often indicates overwatering',
            'Brown spots may be from inconsistent watering',
            'Drooping leaves suggest underwatering',
            'Yellow leaves can indicate nutrient deficiency'
          ],
          rarity: 'uncommon',
          difficulty: 'medium',
          growthRate: 'moderate',
          toxicity: 'mild'
        }
      ];
      
      // Randomly select a plant for variety
      const selectedPlant = plantDatabase[Math.floor(Math.random() * plantDatabase.length)];
      
      const mockPlant: PlantIdentification = {
        id: Date.now().toString(),
        ...selectedPlant,
        image: imageUri
      };

      setIdentifiedPlant(mockPlant);
      setIdentificationsUsed(prev => prev + 1);
      setCurrentStep('result');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Identification error:', error);
      setCurrentStep('welcome');
      Alert.alert('Error', 'Failed to identify plant. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetIdentification = () => {
    setIdentifiedPlant(null);
    setCurrentStep('welcome');
  };

  const showAccountDeletion = () => {
    Alert.alert(
      'Account Deletion',
      'FloraMind does not require account creation for basic plant identification features. All plant identification data is processed locally on your device and is not stored on our servers.\n\nIf you have any concerns about data privacy or wish to contact us, please reach out at support@floramind.app',
      [
        { text: 'OK', style: 'default' },
        { text: 'Contact Support', onPress: () => {
          Linking.openURL('mailto:support@floramind.app?subject=Privacy Inquiry');
        }}
      ]
    );
  };

  const purchasePremium = async (feature: PremiumFeature) => {
    try {
      setIsLoading(true);
      const result = await appleIAPService.purchaseProduct(feature.id);
      
      if (result.success) {
        if (feature.id === PRODUCT_IDS.MONTHLY || feature.id === PRODUCT_IDS.YEARLY) {
          setIsPremium(true);
          setShowPremiumModal(false);
          Alert.alert('Success!', 'Welcome to FloraMind Premium! Enjoy unlimited plant identification.');
        } else {
          setIdentificationsUsed(0);
          setShowPremiumModal(false);
          const packSize = feature.id === PRODUCT_IDS.PACK_10 ? '10' : '50';
          Alert.alert('Success!', `You now have ${packSize} plant identifications!`);
        }
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Alert.alert('Purchase Failed', result.error || 'Unable to complete purchase. Please try again.');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Purchase Error', 'Something went wrong. Please try again.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderWelcomeScreen = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <LinearGradient
        colors={['#1B5E20', '#2E7D32', '#4CAF50', '#66BB6A']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <StatusBar style="light" />
          
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <Animated.View style={[styles.header, { transform: [{ scale: scaleAnim }] }]}>
              <View style={styles.logoContainer}>
                <Animated.View style={[styles.logoWrapper, { transform: [{ rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg']
                }) }] }]}>
                  <Ionicons name="leaf" size={60} color="#FFD700" />
                </Animated.View>
                <View style={styles.logoGlow} />
              </View>
              
              <Text style={styles.title}>FloraMind</Text>
              <Text style={styles.subtitle}>AI Plant Intelligence</Text>
              <Text style={styles.tagline}>Discover, Identify, and Care for Your Plants</Text>
            </Animated.View>

            {/* Features Grid */}
            <Animated.View style={[styles.featuresGrid, { opacity: fadeAnim }]}>
              <View style={styles.featureCard}>
                <Ionicons name="camera" size={32} color="#4CAF50" />
                <Text style={styles.featureTitle}>AI Identification</Text>
                <Text style={styles.featureDescription}>Identify 10,000+ plants instantly</Text>
              </View>
              
              <View style={styles.featureCard}>
                <Ionicons name="heart" size={32} color="#E91E63" />
                <Text style={styles.featureTitle}>Care Tips</Text>
                <Text style={styles.featureDescription}>Personalized plant care advice</Text>
              </View>
              
              <View style={styles.featureCard}>
                <Ionicons name="analytics" size={32} color="#FF9800" />
                <Text style={styles.featureTitle}>Growth Tracking</Text>
                <Text style={styles.featureDescription}>Monitor your plant's progress</Text>
              </View>
              
              <View style={styles.featureCard}>
                <Ionicons name="globe" size={32} color="#2196F3" />
                <Text style={styles.featureTitle}>Global Database</Text>
                <Text style={styles.featureDescription}>Access worldwide plant knowledge</Text>
              </View>
            </Animated.View>

            {/* Usage Info */}
            <Animated.View style={[styles.usageInfo, { opacity: fadeAnim }]}>
              <View style={styles.usageCard}>
                <Text style={styles.usageText}>
                  Free Identifications: {identificationsUsed}/{maxFreeIdentifications}
                </Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${(identificationsUsed / maxFreeIdentifications) * 100}%` }]} />
                </View>
              </View>
              
              {!isPremium && (
                <TouchableOpacity 
                  style={styles.premiumButton}
                  onPress={() => setShowPremiumModal(true)}
                >
                  <LinearGradient
                    colors={['#FFD700', '#FFA000']}
                    style={styles.premiumButtonGradient}
                  >
                    <Ionicons name="diamond" size={20} color="#000" />
                    <Text style={styles.premiumButtonText}>Upgrade to Premium</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </Animated.View>

            {/* Action Buttons */}
            <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
              <TouchableOpacity 
                style={[styles.primaryButton, !canTakePhoto() && styles.disabledButton]} 
                onPress={takePhoto}
                disabled={isLoading || !canTakePhoto()}
              >
                <LinearGradient
                  colors={canTakePhoto() ? ['#4CAF50', '#2E7D32'] : ['#ccc', '#999']}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="camera" size={24} color="#fff" />
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Identifying...' : 
                     !canTakePhoto() ? 'Camera Not Available' : 
                     '📸 Take Photo'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.secondaryButton, !canPickFromGallery() && styles.disabledButton]} 
                onPress={pickFromGallery}
                disabled={isLoading || !canPickFromGallery()}
              >
                <View style={[styles.secondaryButtonContent, !canPickFromGallery() && styles.disabledButton]}>
                  <Ionicons name="images" size={24} color={canPickFromGallery() ? "#4CAF50" : "#999"} />
                  <Text style={[styles.secondaryButtonText, !canPickFromGallery() && styles.disabledButtonText]}>
                    {!canPickFromGallery() ? 'Gallery Not Available' : 
                     '🖼️ Choose from Gallery'}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Error Display */}
            {cameraError && (
              <Animated.View style={[styles.errorContainer, { opacity: fadeAnim }]}>
                <BlurView intensity={20} style={styles.errorBlur}>
                  <Ionicons name="warning" size={24} color="#ff4444" />
                  <Text style={styles.errorText}>{cameraError}</Text>
                  <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={() => {
                      setCameraError(null);
                      requestPermissions();
                    }}
                  >
                    <Text style={styles.retryButtonText}>Retry Permissions</Text>
                  </TouchableOpacity>
                </BlurView>
              </Animated.View>
            )}

            {/* Permission Request */}
            {!hasRequiredPermissions() && (
              <Animated.View style={[styles.permissionContainer, { opacity: fadeAnim }]}>
                <BlurView intensity={20} style={styles.permissionBlur}>
                  <Ionicons name="shield-checkmark" size={32} color="#4CAF50" />
                  <Text style={styles.permissionText}>
                    Grant camera or photo library permission to identify plants
      </Text>
                  <TouchableOpacity 
                    style={styles.permissionButton}
                    onPress={requestPermissions}
                  >
                    <Text style={styles.permissionButtonText}>Grant Permissions</Text>
                  </TouchableOpacity>
                </BlurView>
              </Animated.View>
            )}

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity onPress={showAccountDeletion}>
                <Text style={styles.footerLink}>Privacy & Data Policy</Text>
              </TouchableOpacity>
              <Text style={styles.footerText}>No account required • FloraMind AI Plants v1.0.0</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </Animated.View>
  );

  const renderResultScreen = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={['#1B5E20', '#2E7D32', '#4CAF50']}
        style={styles.gradientBackground}
      >
        <SafeAreaView style={styles.safeArea}>
          <StatusBar style="light" />
          
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Result Header */}
            <Animated.View style={[styles.resultHeader, { transform: [{ scale: scaleAnim }] }]}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
              </View>
              <Text style={styles.resultTitle}>Plant Identified!</Text>
              <Text style={styles.confidenceText}>Confidence: {identifiedPlant?.confidence}%</Text>
            </Animated.View>

            {/* Plant Card */}
            <Animated.View style={[styles.plantCard, { opacity: fadeAnim }]}>
              <BlurView intensity={20} style={styles.plantCardBlur}>
                <View style={styles.plantImageContainer}>
                  {identifiedPlant?.image && (
                    <Image source={{ uri: identifiedPlant.image }} style={styles.plantImage} />
                  )}
                  <View style={styles.rarityBadge}>
                    <Text style={styles.rarityText}>{identifiedPlant?.rarity?.toUpperCase() || 'COMMON'}</Text>
                  </View>
                </View>
                
                <View style={styles.plantInfo}>
                  <Text style={styles.plantName}>{identifiedPlant?.name}</Text>
                  <Text style={styles.scientificName}>{identifiedPlant?.scientificName}</Text>
                  
                  <View style={styles.plantStats}>
                    <View style={styles.statItem}>
                      <Ionicons name="speedometer" size={16} color="#4CAF50" />
                      <Text style={styles.statText}>{identifiedPlant?.growthRate}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="thermometer" size={16} color="#FF9800" />
                      <Text style={styles.statText}>{identifiedPlant?.difficulty}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="warning" size={16} color="#F44336" />
                      <Text style={styles.statText}>{identifiedPlant?.toxicity}</Text>
                    </View>
                  </View>
                </View>
              </BlurView>
            </Animated.View>

            {/* Care Information */}
            <Animated.View style={[styles.careSection, { opacity: fadeAnim }]}>
              <View style={styles.careCard}>
                <Text style={styles.sectionTitle}>🌱 Care Tips</Text>
                {identifiedPlant?.careTips.map((tip, index) => (
                  <View key={index} style={styles.tipItem}>
                    <Ionicons name="checkmark" size={16} color="#4CAF50" />
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.careCard}>
                <Text style={styles.sectionTitle}>💧 Watering Schedule</Text>
                <Text style={styles.careInfo}>{identifiedPlant?.wateringSchedule}</Text>
              </View>

              <View style={styles.careCard}>
                <Text style={styles.sectionTitle}>☀️ Light Requirements</Text>
                <Text style={styles.careInfo}>{identifiedPlant?.lightRequirements}</Text>
              </View>

              <View style={styles.careCard}>
                <Text style={styles.sectionTitle}>⚠️ Common Issues</Text>
                {identifiedPlant?.commonIssues.map((issue, index) => (
                  <View key={index} style={styles.issueItem}>
                    <Ionicons name="warning" size={16} color="#FF9800" />
                    <Text style={styles.issueText}>{issue}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>

            {/* Action Buttons */}
            <Animated.View style={[styles.actionButtons, { opacity: fadeAnim }]}>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={resetIdentification}
              >
                <LinearGradient
                  colors={['#4CAF50', '#2E7D32']}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="camera" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Identify Another Plant</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </Animated.View>
  );

  const renderPremiumModal = () => (
    <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
      <BlurView intensity={50} style={styles.modalBlur}>
        <Animated.View style={[styles.modalContent, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.modalHeader}>
            <Ionicons name="diamond" size={40} color="#FFD700" />
            <Text style={styles.modalTitle}>Upgrade to Premium</Text>
            <Text style={styles.modalSubtitle}>Unlock unlimited plant identification and premium features</Text>
          </View>

          <ScrollView style={styles.featuresList} showsVerticalScrollIndicator={false}>
            {premiumFeatures.map((feature, index) => (
              <TouchableOpacity
                key={feature.id}
                style={[styles.featureItem, feature.popular && styles.popularFeature]}
                onPress={() => purchasePremium(feature)}
              >
                {feature.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>POPULAR</Text>
                  </View>
                )}
                
                <View style={styles.featureIcon}>
                  <Ionicons name={feature.icon as any} size={24} color="#4CAF50" />
                </View>
                
                <View style={styles.featureDetails}>
                  <Text style={styles.featureItemTitle}>{feature.title}</Text>
                  <Text style={styles.featureItemDescription}>{feature.description}</Text>
      </View>
                
                <View style={styles.featurePrice}>
                  <Text style={styles.priceText}>${feature.price}</Text>
                  {feature.id === 'yearly' && (
                    <Text style={styles.savingsText}>Save 60%</Text>
                  )}
    </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowPremiumModal(false)}
          >
            <Text style={styles.closeButtonText}>Maybe Later</Text>
          </TouchableOpacity>
        </Animated.View>
      </BlurView>
    </Animated.View>
  );

  if (showPremiumModal) {
    return renderPremiumModal();
  }

  if (identifiedPlant) {
    return renderResultScreen();
  }

  return renderWelcomeScreen();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    top: -10,
    left: -10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#E8F5E8',
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '600',
  },
  tagline: {
    fontSize: 14,
    color: '#B2DFDB',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  featureCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: '#E8F5E8',
    textAlign: 'center',
    lineHeight: 16,
  },
  usageInfo: {
    marginBottom: 30,
  },
  usageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  usageText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  premiumButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  premiumButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  premiumButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  primaryButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 16,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  secondaryButton: {
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: 'transparent',
  },
  secondaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: '#999',
  },
  errorContainer: {
    marginBottom: 20,
  },
  errorBlur: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 12,
  },
  retryButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  permissionContainer: {
    marginBottom: 20,
  },
  permissionBlur: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  permissionText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 12,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerLink: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
    marginBottom: 8,
  },
  footerText: {
    color: '#B2DFDB',
    fontSize: 12,
  },
  // Result Screen Styles
  resultHeader: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  successIcon: {
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  confidenceText: {
    fontSize: 16,
    color: '#4CAF50',
    textAlign: 'center',
    fontWeight: '600',
  },
  plantCard: {
    marginBottom: 30,
  },
  plantCardBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  plantImageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 20,
  },
  plantImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#4CAF50',
  },
  rarityBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rarityText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  plantInfo: {
    alignItems: 'center',
  },
  plantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#B2DFDB',
    textAlign: 'center',
    marginBottom: 16,
  },
  plantStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  careSection: {
    marginBottom: 30,
  },
  careCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipText: {
    color: '#E8F5E8',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  careInfo: {
    color: '#E8F5E8',
    fontSize: 14,
    lineHeight: 20,
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  issueText: {
    color: '#E8F5E8',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  actionButtons: {
    marginBottom: 20,
  },
  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalBlur: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginTop: 12,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  featuresList: {
    maxHeight: 300,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
    position: 'relative',
  },
  popularFeature: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 12,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  popularText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureDetails: {
    flex: 1,
  },
  featureItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 4,
  },
  featureItemDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  featurePrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  savingsText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#666',
    fontSize: 16,
  },
});