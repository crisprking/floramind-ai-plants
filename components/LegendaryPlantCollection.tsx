import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { SupabaseService, UserPlant } from '../services/SupabaseService';
import { LegendaryPlantDatabase } from '../services/LegendaryPlantDatabase';

interface LegendaryPlantCollectionProps {
  userId: string;
  onPlantSelect: (plant: UserPlant) => void;
}

export const LegendaryPlantCollection: React.FC<LegendaryPlantCollectionProps> = ({
  userId,
  onPlantSelect,
}) => {
  const [userPlants, setUserPlants] = useState<UserPlant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [availablePlants, setAvailablePlants] = useState<any[]>([]);

  useEffect(() => {
    loadUserPlants();
    loadAvailablePlants();
  }, []);

  const loadUserPlants = async () => {
    try {
      const plants = await SupabaseService.getUserPlants(userId);
      setUserPlants(plants);
    } catch (error) {
      console.error('Error loading user plants:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailablePlants = async () => {
    try {
      const plants = await LegendaryPlantDatabase.getAllPlants();
      setAvailablePlants(plants.slice(0, 50)); // Show first 50 plants
    } catch (error) {
      console.error('Error loading available plants:', error);
    }
  };

  const addPlantToCollection = async (plant: any) => {
    try {
      const userPlant: Omit<UserPlant, 'id' | 'created_at' | 'updated_at'> = {
        user_id: userId,
        plant_id: plant.id,
        plant: plant,
        location: 'Home',
        health_status: 'good',
        growth_stage: 'young',
      };

      await SupabaseService.addUserPlant(userPlant);
      await loadUserPlants();
      setShowAddPlant(false);
      Alert.alert('Success', 'Plant added to your collection!');
    } catch (error) {
      console.error('Error adding plant:', error);
      Alert.alert('Error', 'Failed to add plant to collection');
    }
  };

  const updatePlantHealth = async (plantId: string, healthStatus: 'excellent' | 'good' | 'fair' | 'poor') => {
    try {
      await SupabaseService.updateUserPlant(plantId, { health_status: healthStatus });
      await loadUserPlants();
    } catch (error) {
      console.error('Error updating plant health:', error);
    }
  };

  const renderPlantCard = ({ item }: { item: UserPlant }) => (
    <TouchableOpacity
      style={styles.plantCard}
      onPress={() => onPlantSelect(item)}
    >
      <LinearGradient
        colors={['#2E7D32', '#4CAF50']}
        style={styles.plantCardGradient}
      >
        <View style={styles.plantImageContainer}>
          <Ionicons name="leaf" size={40} color="white" />
        </View>
        <View style={styles.plantInfo}>
          <Text style={styles.plantName}>{item.plant?.name || 'Unknown Plant'}</Text>
          <Text style={styles.plantScientific}>
            {item.plant?.scientific_name || 'Unknown'}
          </Text>
          <View style={styles.plantStatus}>
            <View style={[
              styles.statusDot,
              { backgroundColor: getHealthColor(item.health_status) }
            ]} />
            <Text style={styles.statusText}>
              {item.health_status.charAt(0).toUpperCase() + item.health_status.slice(1)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => onPlantSelect(item)}
        >
          <Ionicons name="chevron-forward" size={20} color="white" />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderAvailablePlant = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.availablePlantCard}
      onPress={() => addPlantToCollection(item)}
    >
      <View style={styles.availablePlantInfo}>
        <Text style={styles.availablePlantName}>{item.name}</Text>
        <Text style={styles.availablePlantScientific}>{item.scientific_name}</Text>
        <Text style={styles.availablePlantCare}>
          Care Level: {item.care_level.charAt(0).toUpperCase() + item.care_level.slice(1)}
        </Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={20} color="#4CAF50" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#8BC34A';
      case 'fair': return '#FF9800';
      case 'poor': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your plant collection...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Plant Collection</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddPlant(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {userPlants.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="leaf-outline" size={60} color="#9E9E9E" />
          <Text style={styles.emptyTitle}>No plants yet</Text>
          <Text style={styles.emptySubtitle}>
            Start building your plant collection by adding your first plant!
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => setShowAddPlant(true)}
          >
            <Text style={styles.emptyButtonText}>Add Your First Plant</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={userPlants}
          renderItem={renderPlantCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.plantsList}
        />
      )}

      <Modal
        visible={showAddPlant}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Plant to Collection</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAddPlant(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search plants..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          </View>

          <FlatList
            data={availablePlants.filter(plant =>
              plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              plant.scientific_name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            renderItem={renderAvailablePlant}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            style={styles.availablePlantsList}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 24,
  },
  emptyButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 30,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  plantsList: {
    padding: 20,
  },
  plantCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  plantCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  plantImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  plantInfo: {
    flex: 1,
  },
  plantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  plantScientific: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  plantStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  moreButton: {
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  closeButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 10,
  },
  availablePlantsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  availablePlantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  availablePlantInfo: {
    flex: 1,
  },
  availablePlantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  availablePlantScientific: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  availablePlantCare: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});
