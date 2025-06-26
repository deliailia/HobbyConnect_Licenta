// Search Filter Enhancement Component
import { View, Text, Modal, TouchableOpacity, FlatList, TextInput } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { ngrokLink } from '../ngrokLink';
import { Image, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';



const ngrokBaseUrl = ngrokLink;

const groupsData = [
  { id: '1', name: 'Language', route: '/limbi', subgroups: ['korean', 'italian', 'norvegian', 'spanish', 'french'], category: 'languages'},
  { id: '2', name: 'Sport', route: '/sporturi', subgroups: ['basket', 'soccer', 'volley', 'pilates'], category: 'sport'},
  { id: '3', name: 'Indoor', route: '/inauntru', subgroups: ['gaming', 'movie', 'music'], category: 'indoor'},
  { id: '4', name: 'Outdoor', route: '/afara', subgroups: ['coffee', 'food', 'travelling', 'walking'], category: 'outdoor'},
  { id: '5', name: 'Art', route: '/art', subgroups: ['choreo', 'draw', 'photo', 'writing'], category: 'art'},
];

const keywords = {
  asia: ['korean'],
  europe: ['italian', 'norvegian', 'spanish', 'french'],
  ball: ['soccer', 'basket', 'volley'],
};

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
 // const [userGroups, setUserGroups] = useState(['Languages TM', 'Indoor TM']);
  const router = useRouter();

  const [user, setUser] = useState({});
  const [username, setUsername] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [imageUri, setImageUri] = useState(null);


  const [groupImageModalVisible, setGroupImageModalVisible] = useState(false);
  const [userSubgroups, setUserSubgroups] = useState([]); // asta vine de la backend ideal
  const [selectedSubgroup, setSelectedSubgroup] = useState(null);
  const [groupImages, setGroupImages] = useState([]);
const [showImagesModal, setShowImagesModal] = useState(false);

const [showRecommendations, setShowRecommendations] = useState(false);

const [modalMode, setModalMode] = useState('none'); // 'none' | 'myGroupImages' | 'recommended'
const [selectedGroup, setSelectedGroup] = useState(null);
const [searchMessagesQuery, setSearchMessagesQuery] = useState('');

const [messages, setMessages] = useState([]);
const [loadingMessages, setLoadingMessages] = useState(false);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const toggleCategory = (category) => {
    const updatedFilters = activeFilters.includes(category)
      ? activeFilters.filter(f => f !== category)
      : [...activeFilters, category];
    setActiveFilters(updatedFilters);
  };

  const getFilteredSubgroups = () => {
    let result = groupsData.flatMap(group =>
      group.subgroups.map(sub => ({ subgroup: sub, groupName: group.name, category: group.category }))
    );

    if (searchQuery.trim()) {
      result = result.filter(({ subgroup }) =>
        subgroup.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeFilters.includes('asia')) {
      result = result.filter(({ subgroup }) => keywords.asia.includes(subgroup));
    }
    if (activeFilters.includes('europe')) {
      result = result.filter(({ subgroup }) => keywords.europe.includes(subgroup));
    }
    if (activeFilters.includes('ball')) {
      result = result.filter(({ subgroup }) => keywords.ball.includes(subgroup));
    }
    if (activeFilters.includes('creative')) {
      result = result.filter(({ groupName }) => groupName === 'Art');
    }
    if (activeFilters.includes('online')) {
      result = result.filter(({ groupName }) => ['Language', 'Indoor'].includes(groupName));
    }
    if (activeFilters.includes('offline')) {
      result = result.filter(({ groupName }) => ['Sport', 'Outdoor'].includes(groupName));
    }

    return shuffleArray(result);
  };

  const handlePressSubgroup = (subgroup) => {
    router.push(`/${subgroup}`);
  };

  const getUserDetails = async () => {
  try {
    const email = JSON.parse(await AsyncStorage.getItem('userEmail'));
    if (!email) throw new Error('No user email found');

    const url = `${ngrokBaseUrl}/users/by-email/${email}`;
    console.log('Fetching user details from:', url);
    const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user details');
    }

    const data = await response.json();
    setUser(data);
    setUsername(data.username || '');
    setAboutMe(data.aboutMe || '');
    setImageUri(data.profileImage || null);

  } catch (error) {
    console.error('Error fetching user details:', error.message);
    Alert.alert('Error', `Unable to fetch user data: ${error.message}`);
  }
};
useEffect(() => {
  getUserDetails();
}, []);


const fetchUserSubgroups = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please login again.');
      return;
    }
    const foundSubgroups = [];
    for (const group of groupsData) {
      for (const subgroup of group.subgroups) {
        const url = `${ngrokBaseUrl}/arts/${group.name}/${subgroup}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          const memberExists = data.members.some(member => member.userReqId === userId);

          if (memberExists) {
            if (!foundSubgroups.includes(subgroup)) {
              foundSubgroups.push(subgroup);
            }
          }
        } else {
          console.error(`Error fetching ${url}:`, response.status);
        }
      }
    }

    if (foundSubgroups.length > 0) {
      setUserSubgroups(foundSubgroups);
      //setGroupImageModalVisible(true);
    } else {
      setUserSubgroups([]);
      setGroupImageModalVisible(false);
    }
  } catch (error) {
    console.error('Error verifying members:', error);
    setUserSubgroups([]);
    setGroupImageModalVisible(false);
  }
};


  useEffect(() => {
    fetchUserSubgroups();
  }, []);

  
  
  const fetchImagesFromCloudinary = async (subgroup) => {
  try {
    const group = groupsData.find(g => g.subgroups.includes(subgroup));
    if (!group) {
      throw new Error('Group not found for the selected subgroup');
    }

    setUserSubgroups(group.subgroups);
    setGroupImageModalVisible(true);

    const url = `${ngrokBaseUrl}/messages/images/${group.name}/${subgroup}`;
    console.log('endpoint:', url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erorr fetch: ${response.status}`);
    }
    const data = await response.json();

    const urls = data.images.map(img => img.imageUrl);
    setGroupImages(urls);
  } catch (error) {
    console.error('Error image:', error);
    alert('Error fetching images: ' + error.message);
  }
};

const fetchMyGroupImages = async () => {
  if (!userSubgroups.length) {
    alert('Not a member of any subgroup');
    return;
  }

  try {
    let allImages = [];

    for (const subgroup of userSubgroups) {
      const group = groupsData.find(g => g.subgroups.includes(subgroup));
      if (!group) continue;

      const url = `${ngrokBaseUrl}/api/images/${group.category}/${subgroup}`;
      const response = await fetch(url);
      if (!response.ok) continue;

      const data = await response.json();
      const urls = data.images.map(img => img.imageUrl);
      allImages = [...allImages, ...urls];
    }

    setGroupImages(allImages);
    setGroupImageModalVisible(true); 
  } catch (error) {
    console.error('Error fetching images:', error);
    alert('Error fetching images: ' + error.message);
  }
};


  const showRecommended = () => {
    alert('Showing recommended subgroups based on activity.');
  };
  const fetchRecommendedSubgroups = async () => {
  try {
    setShowRecommendations(true);
    // exemplu endpoint, schimbă cu cel real
    const url = `${ngrokBaseUrl}/recommendations`; 
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch recommendations');
    }
    const data = await response.json();

    // Presupunem că data are forma [{ subgroup: 'korean', groupName: 'Language', category: 'languages' }, ...]
    if (data.length === 0) {
      alert('No recommendations found');
      setRecommendedSubgroups([]);
      setShowRecommendations(false);
      return;
    }
    setRecommendedSubgroups(data);
  } catch (error) {
    alert('Error fetching recommendations: ' + error.message);
    setShowRecommendations(false);
  }
};

const fetchMessagesWithUserProfiles = async () => {
  if (!selectedGroup || !selectedSubgroup) return;

  setLoadingMessages(true);
  try {
    const url = `${ngrokBaseUrl}/messages/${selectedGroup.name}/${selectedSubgroup}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch messages');
    const messagesData = await response.json();

    // Filtrează după searchMessagesQuery, dacă vrei căutare pe client
    const filteredMessages = messagesData.filter(msg =>
      msg.text.toLowerCase().includes(searchMessagesQuery.toLowerCase())
    );

    const messagesWithProfiles = await Promise.all(
      filteredMessages.map(async (msg) => {
        try {
          const userRes = await fetch(`${ngrokBaseUrl}/users/by-username/${msg.username}`);
          if (!userRes.ok) throw new Error('Failed to fetch user');
          const userData = await userRes.json();
          console.log('User data for message:', userData);

          return { ...msg, userDetails: userData };
        } catch (err) {
          console.error('Error fetching user for message:', msg, err);
          return { ...msg, userDetails: null };
        }
      })
    );

    setMessages(messagesWithProfiles);
  } catch (err) {
    console.error('Error fetching messages with profiles:', err);
  } finally {
    setLoadingMessages(false);
  }
};
const handleNavigateToConversation = (message) => {
 
 Alert.alert('Navigate to Conversation', `Do you want to start a conversation with ${message.userDetails?.username || message.username}?`, );
};


  const resetFilters = () => {
    setSearchQuery('');
    setActiveFilters([]);
    setShowFilters(false);
  };

  const buttonStyle = (isSelected) => ({
    backgroundColor: isSelected ? '#FF9F9A' : '#FF91AF',
    borderColor: isSelected ? '#000000' : '#CCCCCC',
    borderWidth: 1,
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  });

  const filtersActive = searchQuery.trim() !== '' || activeFilters.length > 0;

  return (
  <LinearGradient colors={['#FFF7AD', '#FF9F9A']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
    <SafeAreaView className="flex-1 px-4 mt-9">

      {/* Search input + filter button */}
      <View className="flex-row items-center mb-4">
        <TextInput
          className="h-10 border border-gray-300 rounded-md px-4 flex-1 bg-white"
          placeholder="Search for subgroups..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity className="ml-2 bg-gray-300 p-2 rounded-md" onPress={() => setShowFilters(true)}>
          <Text>Filters</Text>
        </TouchableOpacity>
      </View>

      {showFilters && (
        /* păstrează modalul de filtre */
        <Modal transparent animationType="slide" visible={showFilters} onRequestClose={() => setShowFilters(false)}>
          <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }} activeOpacity={1}>
            <View style={{ backgroundColor: 'pink', padding: 20, borderRadius: 10, minWidth: 250 }}>
              <Text className="text-lg font-bold mb-2">Choose filters</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {['asia', 'europe', 'creative', 'online', 'offline', 'ball'].map(category => (
                  <TouchableOpacity key={category} onPress={() => toggleCategory(category)}>
                    <View style={buttonStyle(activeFilters.includes(category))}>
                      <Text className="text-lg capitalize">{category}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity onPress={resetFilters}>
                <Text className="text-sm text-red-600 text-center mt-3">Remove all filters</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Text className="text-xl mt-4 text-center text-pink-600">Apply</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Afișare bazată pe filtersActive */}
      {!filtersActive ? (
        <View className="mt-4">
          <View className="flex-row justify-around mb-4">
            <TouchableOpacity
              className="bg-blue-500 px-4 py-2 rounded"
              onPress={() => {
                setModalMode('myGroupImages');
                setSelectedSubgroup(null);
                setSelectedGroup(null);
                setGroupImageModalVisible(true);
                setShowImagesModal(true);
              }}
            >
              <Text className="text-white font-semibold">My Group Images</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-purple-500 px-4 py-2 rounded"
              onPress={() => {
                setModalMode('recommended');
                setSelectedSubgroup(null);
                setSelectedGroup(null);
                setShowRecommendations(true);
                setGroupImageModalVisible(true);
              }}
            >
              <Text className="text-white font-semibold">Recommended</Text>
            </TouchableOpacity>
          </View>

          {/* Modal comun pentru ambele situații */}
          <Modal
            transparent
            animationType="fade"
            visible={groupImageModalVisible}
            onRequestClose={() => {
              setGroupImageModalVisible(false);
              setSelectedSubgroup(null);
              setSelectedGroup(null);
              setModalMode('none');
              setGroupImages([]);
              setShowRecommendations(false);
              setSearchMessagesQuery('');
            }}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '90%', maxHeight: '70%' }}>

                {/* Mod myGroupImages: lista de subgrupuri user */}
                {modalMode === 'myGroupImages' && (
                  <>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>Select your subgroup</Text>
                    {userSubgroups.length === 0 ? (
                      <Text style={{ textAlign: 'center', color: 'gray', marginBottom: 10 }}>No subgroups found for you.</Text>
                    ) : (
                      <ScrollView style={{ maxHeight: '100%' }}>
                        {userSubgroups.map(sub => (
                          <TouchableOpacity
                            key={sub}
                            onPress={() => {
                              setSelectedSubgroup(sub);
                              fetchImagesFromCloudinary(sub);
                            }}
                          >
                            <View style={{ backgroundColor: '#f472b6', padding: 12, marginVertical: 6, borderRadius: 6 }}>
                              <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, textTransform: 'capitalize' }}>{sub}</Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    )}
                    <TouchableOpacity
                      onPress={() => setGroupImageModalVisible(false)}
                      style={{ marginTop: 20 }}
                    >
                      <Text style={{ textAlign: 'center', color: 'red' }}>Close</Text>
                    </TouchableOpacity>
                    

                    {/* Arată imaginile când selectăm un subgroup */}
                    {selectedSubgroup && groupImages.length > 0 && (
                      <>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 12, textTransform: 'capitalize' }}>
                          {selectedSubgroup} images
                        </Text>
                        <ScrollView style={{ maxHeight: '100%' }}>
                          {groupImages.map((imgUrl, index) => (
                            <Image
                              key={index}
                              source={{ uri: imgUrl }}
                              style={{ width: '100%', height: 200, marginBottom: 10, borderRadius: 10 }}
                              resizeMode="cover"
                            />
                          ))}
                        </ScrollView>
                      </>
                    )}
                  </>
                )}

                {/* Mod recommended: select grup, apoi subgrup, apoi căutare */}
                {modalMode === 'recommended' && (
                  <>
                    {!selectedGroup ? (
                      <>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>Select a group</Text>
                        <ScrollView style={{ maxHeight: '100%' }}>
                          {groupsData.map(group => (
                            <TouchableOpacity
                              key={group.id}
                              onPress={() => setSelectedGroup(group)}
                              style={{ backgroundColor: '#a78bfa', padding: 12, marginVertical: 6, borderRadius: 6 }}
                            >
                              <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>{group.name}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                        <TouchableOpacity
                          onPress={() => setGroupImageModalVisible(false)}
                          style={{ marginTop: 20 }}
                        >
                          <Text style={{ textAlign: 'center', color: 'red' }}>Close</Text>
                        </TouchableOpacity>
                      </>
                    ) : !selectedSubgroup ? (
                      <>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>Select a subgroup in {selectedGroup.name}</Text>
                        <ScrollView style={{ maxHeight: '100%' }}>
                          {selectedGroup.subgroups.map(sub => (
                            <TouchableOpacity
                              key={sub}
                              onPress={() => setSelectedSubgroup(sub)}
                              style={{ backgroundColor: '#a78bfa', padding: 12, marginVertical: 6, borderRadius: 6 }}
                            >
                              <Text style={{ color: 'white', fontSize: 16, textAlign: 'center', textTransform: 'capitalize' }}>{sub}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                        <TouchableOpacity
                          onPress={() => setSelectedGroup(null)}
                          style={{ marginTop: 20 }}
                        >
                          <Text style={{ textAlign: 'center', color: '#2563eb' }}>Back to groups</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
                          Search messages in {selectedSubgroup}
                        </Text>
                        <TextInput
                          style={{ borderColor: 'gray', borderWidth: 1, padding: 8, borderRadius: 6, marginBottom: 10 }}
                          placeholder="Type message keywords..."
                          value={searchMessagesQuery}
                          onChangeText={setSearchMessagesQuery}
                        />
                        {/* Aici poți pune un buton pentru fetch mesaje, sau un listă cu rezultate */}
                        {messages.length === 0 ? (
  <>
    <TouchableOpacity
      onPress={fetchMessagesWithUserProfiles}
      style={{ backgroundColor: '#8b5cf6', padding: 12, borderRadius: 6 }}
    >
      <Text style={{ color: 'white', textAlign: 'center' }}>Search</Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => setSelectedSubgroup(null)}
      style={{ marginTop: 20 }}
    >
      <Text style={{ textAlign: 'center', color: '#2563eb' }}>Back to subgroups</Text>
    </TouchableOpacity>
  </>
) : (
  <>
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
      style={{ maxHeight: '50%', marginTop: 10 }}
      renderItem={({ item }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
          <Image
source={{ uri: item.userDetails?.profileImage || 'https://via.placeholder.com/40' }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
          />

          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.userDetails?.username || item.username}</Text>
            <Text>{item.text}</Text>
          </View>
          <TouchableOpacity
    onPress={() => handleNavigateToConversation(item)}
    style={{ padding: 10 }}
  >
    <Ionicons name="arrow-forward" size={24} color="#8b5cf6" />
  </TouchableOpacity>
        </View>
        
      )}
      ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No messages found</Text>}
    />
    <TouchableOpacity
      onPress={() => {
        setMessages([]);
      }}
      style={{ marginTop: 20 }}
    >
      <Text style={{ textAlign: 'center', color: '#2563eb' }}>Search again</Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => setSelectedSubgroup(null)}
      style={{ marginTop: 10 }}
    >
      <Text style={{ textAlign: 'center', color: '#2563eb' }}>Back to subgroups</Text>
    </TouchableOpacity>
  </>
)}

                      </>
                    )}
                  </>
                )}
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <FlatList
          data={getFilteredSubgroups()}
          keyExtractor={(item) => item.subgroup}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handlePressSubgroup(item.subgroup)}
              style={{ backgroundColor: Colors[item.category]?.[item.subgroup] || '#ccc', padding: 16, borderRadius: 12, marginBottom: 8 }}>
              <Text className="text-lg font-bold text-white">{item.subgroup}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text className="text-center text-black text-lg mt-5 p-24">No results found</Text>}
        />
      )}

    </SafeAreaView>
  </LinearGradient>
);
  
};

export default Search;