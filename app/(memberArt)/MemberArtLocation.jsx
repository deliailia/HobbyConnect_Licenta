import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Linking, Modal } from 'react-native';
import { ngrokLink } from '../ngrokLink';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location'; 
import { router } from 'expo-router';
import { useRouter } from 'expo-router';
import { Switch } from 'react-native';
import  Colors  from '../../constants/colors';
import {images} from '../../constants/images';
import {icons} from '../../constants';

import * as ImagePicker from 'expo-image-picker';
import PollMessage from './createEvents';



const ngrokBaseUrl = ngrokLink;

const MemberArtLocation = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(null); 
  const [params, setParams] = useState({ groupName: null, subcategoryName: null, locationLat: null, locationLong: null });
  const [paramsLoaded, setParamsLoaded] = useState(false); 
  const flatListRef = useRef();
  const [modalVisible, setModalVisible] = useState(true); 
  const [locationAllowed, setLocationAllowed] = useState(null); // null = nedecis, true = acceptat, false = refuzat
const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
const [location, setLocation] = useState(null); // State pentru a stoca coordonatele utilizatorului
const [showSeeEvents, setShowSeeEvents] = useState(false);

  const [userProfile, setUserProfile] = useState({}); // { username: { userImageUrl, ... } }
const [combinedItems, setCombinedItems] = useState([]);
  const [images, setImages] = useState([]);
  const [userDetails, setUserDetails] = useState(null);

  const [pollModalVisible, setPollModalVisible] = useState(false);
const [pollQuestion, setPollQuestion] = useState('');
const [pollSubgroup, setPollSubgroup] = useState(params.subcategoryName || '');
const [loadingPoll, setLoadingPoll] = useState(false);
const [pollGroup, setPollGroup] = useState(params.groupName || '');
const [pollCreatedBy, setPollCreatedBy] = useState(username || ''); // username-ul curent
const [pollOptions, setPollOptions] = useState(['']);
const [polls, setPolls] = useState([]); // State pentru poll-uri

const [toggled, setToggled] = useState(false);
const [theme, setTheme] = useState({
  background: '#fff', // default light yellow
  messageBubble: 'green', // default mesaj utilizator curent
  messageText: '#fff', // text alb
});


  const route = useRoute();
  const router = useRouter(); // Obține instanța router-ului
  
  
const getColorBySubcategory = (subcategoryName) => {
  if (!subcategoryName) return '#ccc';

  const subcatKey = subcategoryName.trim().toLowerCase();

  for (const group in Colors) {
    if (Colors[group] && Colors[group][subcatKey]) {
      return Colors[group][subcatKey];
    }
  }

  console.warn(`Color not found for subcategory: "${subcatKey}"`);
  return '#fff'; // fallback
};
const handleToggle = () => {
  const bgColor = getColorBySubcategory(params.subcategoryName);

  if (!toggled) {


  setTheme({
    background: '#fff',         // ecran alb
    messageBubble: bgColor,     // culoarea subgrupului
    messageText: '#fff',     // contrast dinamic
  });
} else {
  // Tema default când toggle e off
  setTheme({
    background: bgColor,
    messageBubble: '#fff',
    messageText: bgColor,
  });
}

  setToggled(!toggled);
};


  const loadParams = async () => {
    try {
      const { groupName, subcategoryName } = route.params || {};
      console.log('Route params:', route.params); // Log pentru debugging
  
      if (subcategoryName === 'soccer' || subcategoryName === 'basket' || subcategoryName === 'volley' ||
        subcategoryName === 'coffee' || subcategoryName === 'food' || subcategoryName === 'travelling' ||
        subcategoryName === 'walking') {
        
        setParams({
          groupName: groupName,
          subcategoryName: subcategoryName,
        });
      } else {
        console.warn('Params ignored');
        setParams({
          groupName: groupName,
          subcategoryName: subcategoryName,
        });
      }
  
      
      setParamsLoaded(true);
    } catch (error) {
      console.error('Error loading params', error);
      setParamsLoaded(true); 
    }
  };

  useEffect(() => {
    loadParams();
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        //console.log("Permission request status:", status); 

        if (status === 'granted') {
          setLocationPermissionGranted(true);
          const userLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High, 
          });
          setLocation(userLocation.coords);
          //console.log('Location found:', userLocation.coords); 
        } else if (status === 'denied') {
          setLocationPermissionGranted(false);
          Alert.alert('Permission denied', 'No access to location');
        } else {
          
          Alert.alert('Location permission', 'Please grant location access in settings');
        }
      } catch (error) {
        console.error('Error requesting location permission:', error);
        Alert.alert('Error', 'An error occurred while requesting location permission');
      }
    };

    requestLocationPermission();
  }, []); 

  useEffect(() => {
    if (locationAllowed === false) {
      setShowSeeEvents(true); // Arată butonul "See Events" când locația este refuzată
     // console.log("Location access denied, showing 'See Events' button");
    }
  }, [locationAllowed]);
  useEffect(() => {
    if (location) {
     // console.log('Location refresh', location); 
    }
  }, [location]);

  

  const fetchUserInfo = async () => {
    try {
      // Obține email-ul din AsyncStorage
      const email =JSON.parse( await AsyncStorage.getItem('userEmail'));
      if (!email) {
        console.error("Email not found in AsyncStorage!");
        Alert.alert('Authentication error', 'No email found. Please login again.');
        router.push('/sign-in');
        return;
      }
  
      // Trimiterea cererii GET către backend pentru a obține detaliile utilizatorului pe baza email-ului
      const url = `${ngrokBaseUrl}/users/by-email/${email}`;
      console.log('Fetching user details from:', url);
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Verifică dacă răspunsul nu este OK
      if (!response.ok) {
        throw new Error(`Error fetching user details: ${response.statusText}`);
      }
  
      const data = await response.json();
     // console.log('User details fetched:', data);
  
     
      if (data.username) {
        setUsername(data.username);
      } else {
        console.error('Username not found!');
      }
  
      
  
    } catch (error) {
      console.error('Error fetching user details:', error);
      Alert.alert('Error', 'Unable to fetch user details');
    } finally {
      setLoading(false);
    }
  };
  const fetchMessagesWithUserProfiles = async () => {
    try {
      const { groupName, subcategoryName } = params;
      if (!groupName || !subcategoryName) return;
  
      const url = `${ngrokBaseUrl}/messages/${groupName}/${subcategoryName}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const messagesData = await response.json();
  
      // Pentru fiecare mesaj, adaugă detaliile userului
      const messagesWithProfiles = await Promise.all(
        messagesData.map(async (msg) => {
          try {
            const userRes = await fetch(`${ngrokBaseUrl}/users/by-username/${msg.username}`);
          
            if (!userRes.ok) throw new Error('Failed to fetch user');
            const userData = await userRes.json();
                //console.log("User profile data:", userData);
  
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
    }
  };
  useEffect(() => {
    if (paramsLoaded && params.groupName && params.subcategoryName) {
      fetchMessagesWithUserProfiles();
      fetchImages();
    }
  }, [paramsLoaded, params]);
  
  const fetchMessages = async () => {
    const { groupName, subcategoryName } = params;
  
    if (!groupName || !subcategoryName) {
      console.warn('groupName or subcategoryName is missing. Fetch will not be called.');
      return;
    }
  
    setLoading(true);
    try {
      console.log('Fetching messages for groupName:', groupName, 'subcategoryName:', subcategoryName);
      const url = `${ngrokBaseUrl}/messages/${groupName}/${subcategoryName}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Error getting messages');
      }
  
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error getting messages:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (paramsLoaded) {
      fetchMessages();
    }
  }, [paramsLoaded]);

 


  const fetchImages = async () => {
      const { groupName, subcategoryName } = params;
    
      if (!groupName || !subcategoryName) {
        console.warn('groupName or subcategoryName is missing. Fetch will not be called.');
        return;
      }
      try {
        console.log('Fetching images for groupName:', groupName, 'subcategoryName:', subcategoryName);
        const url = `${ngrokBaseUrl}/messages/images/${groupName}/${subcategoryName}`;
        const response = await fetch(url);
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error fetching images:', errorText);
          throw new Error('Failed to fetch images');
        }
        const result = await response.json();
        setImages(result.images || []);
        console.log('Fetched images:', result.images);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    const fetchImagesWithUserProfiles = async () => {
    try {
      const { groupName, subcategoryName } = params;
      if (!groupName || !subcategoryName) return;
  
      const url = `${ngrokBaseUrl}/messages/images/${groupName}/${subcategoryName}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch images');
      const imagesData = await response.json();
  
      const imagesWithProfiles = await Promise.all(
        imagesData.images.map(async (img) => {
          try {
            const userRes = await fetch(`${ngrokBaseUrl}/users/by-username/${img.username}`);
            if (!userRes.ok) throw new Error('Failed to fetch user');
            const userData = await userRes.json();
            return { ...img, userDetails: userData };
          } catch (err) {
            console.error('Error fetching user for image:', img, err);
            return { ...img, userDetails: null };
          }
        })
      );
  
      setImages(imagesWithProfiles);
    } catch (err) {
      console.error('Error fetching images with profiles:', err);
    }
  };
  useEffect(() => {
    if (paramsLoaded && params.groupName && params.subcategoryName) {
      fetchMessagesWithUserProfiles();
      fetchImagesWithUserProfiles();
    }
  }, [paramsLoaded, params]);

  const openPollModal = () => setPollModalVisible(true);
  const closePollModal = () => setPollModalVisible(false);
const createPoll = async () => {
  if (!pollQuestion.trim()) {
    Alert.alert('Erorr', 'Event is mandatory.');
    return;
  }

  const filteredOptions = pollOptions.filter(opt => opt.trim() !== '');
  if (filteredOptions.length < 2) {
    Alert.alert('Erorr', 'Add at least two options.');
    return;
  }

  if (!pollSubgroup.trim()) {
    Alert.alert('Erorr', 'Subgroup is mandatory.');
    return;
  }

  if (!pollGroup.trim()) {
    Alert.alert('Erorr', 'Group is mandatory.');
    return;
  }

  if (!pollCreatedBy.trim()) {
    Alert.alert('Erorr', 'Creator is mandatory.');
    return;
  }

  setLoadingPoll(true);

  const payload = {
    question: pollQuestion,
    groupName: pollGroup,
    subcategoryName: pollSubgroup,
    createdBy: pollCreatedBy,
    options: filteredOptions,
  };

 // console.log('Trimitem payload poll:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(`${ngrokBaseUrl}/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    //console.log('Răspuns backend poll:', data);

    if (!response.ok) throw new Error(data.error || 'Erorr creating poll');

    Alert.alert('Succes', 'Poll created successfully!');
    setPollModalVisible(false);
    setPollQuestion('');
    setPollOptions(['']);
  } catch (err) {
    console.error('Error creating poll:', err);
    Alert.alert('Erorr', err.message);
  } finally {
    setLoadingPoll(false);
  }
};


const addOption = () => {
  setPollOptions([...pollOptions, '']);
};
const updateOption = (text, index) => {
  const newOptions = [...pollOptions];
  newOptions[index] = text;
  setPollOptions(newOptions);
};


  const requestPermissions = async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
      if (
        cameraStatus.status !== 'granted' ||
        mediaStatus.status !== 'granted'
      ) {
        Alert.alert(
          'Permissions necessary',
          'You need to grant camera and media library permissions to use this feature.',
        );
        return false;
      }
    
      return true;
    };
    
    const pickImage = async () => {
      const granted = await requestPermissions();
      if (!granted) return;
    
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    
      if (!result.canceled && result.assets?.length > 0) {
        sendImage(result.assets[0].uri);
      }
    };

    const sendImage = async (uri) => {
        try {
          const formData = new FormData();
          const fileType = uri.split('.').pop();
      
          formData.append('image', {
            uri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
          });
          formData.append('username', username);
          formData.append('groupName', params.groupName);
          formData.append('subcategoryName', params.subcategoryName);
      
          const response = await fetch(`${ngrokBaseUrl}/messages/send-image`, {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          });
      
          const text = await response.text();
         // console.log('Server response:', text);
      
          if (!response.ok) {
            throw new Error(`Sending image failed ${text}`);
          }
      
          const responseData = JSON.parse(text);
          setMessages((prevMessages) => [...prevMessages, responseData.data]);
        } catch (error) {
          console.error('Erorr at sending image', error);
        }
      };
      
      
      
      useEffect(() => {
        if (paramsLoaded && params.groupName && params.subcategoryName) {
          fetchMessages();
          fetchImages();
    
        }
      }, [paramsLoaded, params]);
  
 
const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);
      

      const requestBody = {
        username: username,
        groupName: params.groupName,
        subcategoryName: params.subcategoryName,
        messageText: message,
      };
      //console.log('Request body:', requestBody); // Log pentru debugging

      const url = `${ngrokBaseUrl}/messages/send`;
      //console.log('Sending message to URL:', url); // Log pentru debugging


      const response = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error('Erorr sending messages');
      }

      const responseData = await response.json();
      setMessages((prevMessages) => [...prevMessages, responseData.data]);
      setMessage('');
    } catch (error) {
      console.error('Erorr sending message', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (messages.length > 0 || images.length > 0 || polls.length > 0) {
    // Formatează imaginile
    const formattedImages = images.map(img => ({
      ...img,
      isImage: true,
      isPoll: false,
      id: img._id,
      createdAt: img.createdAt,
      username: img.username,
      imageUrl: img.imageUrl
    }));

    // Formatează mesajele text
    const formattedMessages = messages.map(msg => ({
      ...msg,
      isImage: false,
      isPoll: false,
      id: msg._id,
      createdAt: msg.createdAt,
      username: msg.username,
      text: msg.text
    }));

    // Formatează poll-urile
    const formattedPolls = polls.map(poll => ({
      ...poll,
      isPoll: true,
      isImage: false,
      id: poll._id,
      createdAt: poll.createdAt,
      username: poll.username,
      question: poll.question,
      options: poll.options,
    }));

    // Combină toate elementele și sortează după createdAt
    const combined = [...formattedMessages, ...formattedImages, ...formattedPolls].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    setCombinedItems(combined);
  }
}, [messages, images, polls]);


  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${params.locationLat},${params.locationLong}`;
    Linking.openURL(url).catch(err => console.error("Error opening Google Maps: ", err));
  };
  useEffect(() => {
    //console.log("Location allowed:", locationAllowed);
    //console.log("Modal visible:", modalVisible);
  }, [locationAllowed, modalVisible]);
  const handleSeeEvents = () => {
    //console.log('Navigating to Maps...'); // Adăugăm log pentru debugging
    router.push('/maps'); // Navighează către pagina Maps
  };
 const fetchPolls = async () => {
  try {
    const response = await fetch(`${ngrokBaseUrl}/polls/${params.groupName}/${params.subcategoryName}`);
    const data = await response.json();
    console.log('Fetched polls:', data);
    setPolls(data.polls || []);

    if (!response.ok) {
      console.log('Poll fetch failed:', data);
      setPolls([]); 
      throw new Error(data.error || 'Eroare la preluarea poll-urilor');
    }

    const formattedPolls = data.map(poll => ({
      _id: `poll-${poll._id}`,
      type: 'poll',
      poll,
      createdAt: poll.createdAt,
      username: poll.createdBy,
      userDetails: { profileImage: null },
    }));
console.log('Formatted polls:', formattedPolls); // Log pentru debugging
    return formattedPolls;
    
  } catch (err) {
    console.error('Eroare la fetchPolls:', err.message);
    return [];
  }
};
useEffect(() => {
  fetchPolls();
  
}, []);



useEffect(() => {
  if ((messages && messages.length) || (images && images.length) || (polls && polls.length)) {
    // Formatează fiecare tip pentru a avea aceleași proprietăți comune (ex: id, createdAt, type)
    const formattedMessages = (messages || []).map(msg => ({
      ...msg,
      id: msg._id,
      createdAt: msg.createdAt,
      type: 'message',
      isImage: false,
      isPoll: false,
    }));

    const formattedImages = (images || []).map(img => ({
      ...img,
      id: img._id,
      createdAt: img.createdAt,
      type: 'image',
      isImage: true,
      isPoll: false,
    }));

    const formattedPolls = (polls || []).map(poll => ({
      ...poll,
      id: poll._id,
      createdAt: poll.createdAt,
      type: 'poll',
      isImage: false,
      isPoll: true,
    }));

    // Combină toate itemele și sortează după createdAt
    const combined = [...formattedMessages, ...formattedImages, ...formattedPolls].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    setCombinedItems(combined);
  }
}, [messages, images, polls]);


const renderMessageItem = ({ item }) => {
  const isCurrentUser = item.username === username;

  if (item.isImage) {
    return (
      <View>
        <Image
          source={{ uri: item.imageUrl }}
          style={{ width: 200, height: 200, borderRadius: 10 }}
          resizeMode="cover"
        />
      </View>
    );
  }

  if (item.isPoll) {
    return (
      <View style={{ padding: 10, backgroundColor: '#ddd', borderRadius: 8, marginVertical: 5 }}>
        <Text style={{ fontWeight: 'bold' }}>{item.poll.question}</Text>
        {/* Aici poți pune opțiunile poll-ului */}
        {item.poll.options && item.poll.options.map((opt, i) => (
          <Text key={i}>- {opt}</Text>
        ))}
      </View>
    );
  }

  // Default: mesaj text
  return (
    <View
      style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
      ]}
    >
      {!isCurrentUser && (
        <Image
          source={item.userDetails?.profileImage ? { uri: item.userDetails.profileImage } : images.defaultProfilePic}
          style={styles.avatar}
        />
      )}
      <View
        style={[
          styles.messageBubble,
          {
            backgroundColor: isCurrentUser ? theme.messageBubble : '#eee',
            alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
          },
        ]}
      >
        {!isCurrentUser && item.username ? (
          <Text style={styles.usernameText}>{item.username}</Text>
        ) : null}

        <Text style={[styles.messageText, { color: isCurrentUser ? theme.messageText : '#000' }]}>
          {item.text}
        </Text>
      </View>
    </View>
  );
};

  
    useEffect(() => {
      loadParams();
      fetchUserInfo();
      fetchMessages();
      fetchImages();
    }, []);
  
    if (!paramsLoaded) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Se încarcă parametrii...</Text>
        </View>
      );
    }
  return (
     <SafeAreaView style={{ flex: 1}}>
     <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
          <View style={styles.innerContainer}>
              <View style={styles.customHeader}>
        
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Switch
          value={toggled}
          onValueChange={handleToggle}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={toggled ? '#0f0' : '#f4f3f4'}
          style={{ marginRight: 10, justifyContent: 'right' }}
        />
        
            
            <Text style={styles.subHeaderText}>{params.subcategoryName || ''}</Text>
            </View>
          </View>
          

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderMessageItem}
          style={styles.messageList}
        />
        {locationAllowed === false && showSeeEvents && (
  <TouchableOpacity
    style={{
      backgroundColor: '#4CAF50',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      margin: 10,
    }}
    onPress={handleSeeEvents}
  >
    <Text style={{ fontSize: 16, color: '#fff' }}>See Events</Text>
  </TouchableOpacity>
)}

{locationAllowed=== false && (
          <Text style={{ color: 'green' }}></Text>
        )}

        {locationAllowed === true && (
          <Text style={{ color: 'red' }}></Text>
        )}

       

        <View style={styles.inputContainer}>
        <TouchableOpacity
  onPress={() => setPollModalVisible(true)}
  style={{
    position: 'absolute',
    bottom: 150,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4ade80',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  }}
>
  <Text style={{ fontSize: 28, color: 'white', fontWeight: 'bold' }}>+</Text>
</TouchableOpacity>


<Modal visible={pollModalVisible} animationType="slide" transparent={true} onRequestClose={() => setPollModalVisible(false)}>
  <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: '90%', backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Create poll</Text>

      <TextInput
        placeholder="Event/Poll Question"
        placeholderTextColor="#666"
        value={pollQuestion}
        onChangeText={setPollQuestion}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 15 }}
      />
      <TextInput
        placeholder="Subgroup"
        placeholderTextColor="#666"
        value={pollSubgroup}
        onChangeText={setPollSubgroup}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginTop: 15 }}
      />

      <TextInput
        placeholder="Group"
        placeholderTextColor="#666"
        value={pollGroup}
        onChangeText={setPollGroup}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginTop: 15 }}
      />

      <TextInput
        placeholder="Your username"
        placeholderTextColor="#666"
        value={pollCreatedBy}
        onChangeText={setPollCreatedBy}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginTop: 15, marginBottom: 15 }}
      />

      {pollOptions.map((option, index) => (
        <TextInput
          key={index}
          placeholder={`Option ${index + 1}`}
          placeholderTextColor="#666"
          value={option}
          onChangeText={(text) => updateOption(text, index)}
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 10 }}
        />
      ))}

      <Button title="Add option" onPress={addOption} />

      <Button title={loadingPoll ? 'Creating...' : 'Create Poll'} onPress={createPoll} disabled={loadingPoll} />

      <Button title="Cancel" color="red" onPress={() => setPollModalVisible(false)} />
    </View>
  </View>
</Modal>


          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message..."
            returnKeyType="send"
            onSubmitEditing={handleSendMessage}
          />

          <TouchableOpacity onPress={pickImage}>
              <Image source={icons.photo} style={styles.photoIcon} />
            </TouchableOpacity>
          <Button title="Send" onPress={handleSendMessage} disabled={loading} />
        </View>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)',}}
        >
          <View
            style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center',}}
          >
            <Text style={{ fontSize: 17, marginBottom: 20 }}>
              Allow HobbyConnect to access your location. Location is necessary for this type of group.
            </Text>

          <TouchableOpacity
              style={{ backgroundColor: '#FF9F9A', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginBottom: 10,}}
              onPress={() => {
                setModalVisible(false);
                setLocationAllowed(true);
                Location.requestForegroundPermissionsAsync().then(({ status }) => {
                if (status === 'granted') {
                  Location.getCurrentPositionAsync().then(location => {
                  setLocation(location.coords);
                  //console.log('User location:', location.coords);
                });
                } else {
                  Alert.alert('Permission denied', 'No access to location');
                }
    });
  }}
>
  <Text style={{ fontSize: 18, color: '#fff' }}>Don't Allow</Text>
</TouchableOpacity>

<TouchableOpacity
  style={{
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  }}
  onPress={() => {
    setModalVisible(false);
    setLocationAllowed(false);
    //console.log('User allowed location access');
  }}
>
  <Text style={{ fontSize: 18, color: '#000' }}> Allow</Text>
</TouchableOpacity>
{locationAllowed=== true && (
  <View style={{ padding: 10, alignItems: 'center' }}>
    <TouchableOpacity
      style={{
        backgroundColor: '#4caf50',
        padding: 12,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
        marginVertical: 10,
      }}
      onPress={handleSeeEvents}
    >
      <Text style={{ color: 'white', fontSize: 16 }}>See Events</Text>
    </TouchableOpacity>



    


  </View>
)}



          </View>
        </View>
      </Modal>
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1E087',
  },
  innerContainer: {
    flex: 1,
  },
  messageList: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  currentUserMessage: {
    justifyContent: 'flex-end',
  },
  otherUserMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 15,
  },
  currentUserBubble: {
    backgroundColor: '#F1B42F',
    alignSelf: 'flex-end',
  },
  otherUserBubble: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 25,
    marginRight: 10,
    fontSize: 16,
  },
  usernameText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  locationContainer: {
    padding: 10,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
  },
  photoIcon: {
  width: 24,
  height: 24,
  marginRight: 10,
},
customHeader: {
  backgroundColor: '#fff',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderBottomWidth: 1,
  borderBottomColor: '#ddd',
  alignItems: 'center',
  justifyContent: 'center',
  // optional shadow pentru iOS
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  // elevatie pentru Android
  elevation: 3,
},
headerText: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#333',
  textAlign: 'center',
  marginLeft: 29,
},
subHeaderText: {
  fontSize: 20,
  color: '#666',
  fontWeight: 'bold',

  marginTop: 4,
  textAlign: 'center',
  marginLeft: 29,
},
currentUserBubbleGreen: {
  backgroundColor: 'green',
  alignSelf: 'flex-end',
},
currentUserTextGreen: {
  color: 'white',
},
currentUserBubbleRedBlue: {
  backgroundColor: 'red',
  alignSelf: 'flex-end',
},
currentUserTextRedBlue: {
  color: 'blue',
},

});

export default MemberArtLocation;