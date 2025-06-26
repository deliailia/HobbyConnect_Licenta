import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Button,
  Keyboard,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Linking } from 'react-native';
import { ngrokLink } from '../ngrokLink'; // Import ngrok link
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ngrokBaseUrl = ngrokLink; // Use the ngrok link

const Maps = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [eventMarker, setEventMarker] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]); // Lista evenimentelor salvate
  const [currentUser, setCurrentUser] = useState(null); // Utilizatorul curent

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      setLoading(false);
    })();

    const fetchEvents = async () => {
      try {
        const response = await fetch(`${ngrokBaseUrl}/events`);
        const data = await response.json();
        setAllEvents(data.events);
        setFilteredEvents(data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    // Obține detaliile utilizatorului logat
    getUserDetails();

    fetchEvents();
  }, []);

  const getUserDetails = async () => {
    try {
      const email = JSON.parse(await AsyncStorage.getItem('userEmail'));
      if (!email) {
        console.error('Email not found in AsyncStorage!');
        return;
      }

      const url = `${ngrokBaseUrl}/users/by-email/${email}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Error fetching user details');
      const data = await response.json();
      setCurrentUser(data.username); // Salvează username-ul utilizatorului
      fetchSavedEvents();
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (text.length > 0) {
      const filtered = allEvents.filter((item) =>
        item.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(allEvents);
    }
  };
  const handleSelectEvent = (event) => {
    setEventMarker(event);
    setSearch('');
    setFilteredEvents(allEvents);
    setShowModal(true);
    Keyboard.dismiss();
  };
  const saveEvent = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to save events');
      return;
    }
    const savedEvent = {
        eventId: eventMarker._id, 
        username: currentUser, 
    };
    try {
        const response = await fetch(`${ngrokBaseUrl}/saved-events/${savedEvent.eventId}/${savedEvent.username}`, {
            method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok) {
          console.log('Event saved successfully:', data); 
        } else {
          console.log('Error saving event:', data); 
        }
      } catch (error) {
        console.error('Error fetching saved events:', error);
      }
  };
  useEffect(() => {
    if (currentUser) {
      fetchSavedEvents(); 
    }
  }, [currentUser]); 
  

  const fetchSavedEvents = async () => {
    const url = `${ngrokBaseUrl}/saved-events`;
  console.log('Fetching saved events from URL:', url);

    try {
      const response = await fetch(`${ngrokBaseUrl}/saved-events`)
        const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      setSavedEvents(data); 
    } else {
      const text = await response.text();
      console.error('Received non-JSON response:', text);
    }
  } catch (error) {
    console.error('Error fetching saved events:', error);
  }
};

  if (loading || !location) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={location}
          title="You are here"
          description="Current location"
        />
        {eventMarker && (
          <Marker
            coordinate={eventMarker.location}
            title={eventMarker.title}
            description={eventMarker.subcategory}
            pinColor="blue"
          />
        )}
      </MapView>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search events..."
          style={styles.searchInput}
          value={search}
          onChangeText={handleSearch}
          onSubmitEditing={() => {
            if (filteredEvents.length > 0) {
              handleSelectEvent(filteredEvents[0]);
            }
          }}
        />
        {search.length > 0 && filteredEvents.length > 0 && (
          <FlatList
            data={filteredEvents}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelectEvent(item)}
              >
                <Text>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.eventTitle}>{eventMarker?.title}</Text>
            <Text style={styles.eventAuthor}>Creat de: {eventMarker?.creator}</Text>
            <View style={styles.modalButtons}>
              <Button title="Save Event" onPress={saveEvent} />
              <Button
                title="Get Directions"
                onPress={() => {
                  const lat = eventMarker.location.latitude;
                  const lng = eventMarker.location.longitude;
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                  Linking.openURL(url).catch((err) =>
                    console.error('Failed to open directions:', err)
                  );
                }}
              />
            </View>
            <Button title="Close" onPress={() => setShowModal(false)} color="red" />
          </View>
        </View>
      </Modal>

      {/* Modal pentru evenimentele salvate */}
      <Modal
        visible={savedEvents.length > 0}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSavedEvents([])}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.eventTitle}>Saved Events</Text>
            <FlatList
              data={savedEvents}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.savedEventItem}>
                  <Text>{item.title}</Text>
                </View>
              )}
            />
            <Button title="Close" onPress={() => setSavedEvents([])} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    position: 'absolute',
    top: 50,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  searchInput: {
    height: 40,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  suggestionItem: {
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
   

  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventAuthor: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
});

export default Maps;
