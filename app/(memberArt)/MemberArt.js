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
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { ngrokLink } from '../ngrokLink';
import {icons} from '../../constants';
import {images} from '../../constants';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Switch } from 'react-native';
import  Colors  from '../../constants/colors';

const ngrokBaseUrl = ngrokLink;


const MemberArt = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(null); 
  const [params, setParams] = useState({ groupName: null, subcategoryName: null });
  const [paramsLoaded, setParamsLoaded] = useState(false); 
  const flatListRef = useRef();
  const [subName, setSubName] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [images, setImages] = useState([]);
  const [isGreenTheme, setIsGreenTheme] = useState(false);
  const [toggled, setToggled] = useState(false);
 const [theme, setTheme] = useState({
   background: '#fff', // default light yellow
   messageBubble: 'pink', // default mesaj utilizator curent
   messageText: '#fff', // text alb
 });
  const [userProfile, setUserProfile] = useState({}); // { username: { userImageUrl, ... } }
const [combinedItems, setCombinedItems] = useState([]);


  const route = useRoute();

const getColorBySubcategory = (subcategoryName) => {
  if (!subcategoryName) return '#fff';

  const subcatKey = subcategoryName.trim().toLowerCase();

  for (const group in Colors) {
    if (Colors[group] && Colors[group][subcatKey]) {
      return Colors[group][subcatKey];
    }
  }

  console.warn(`Color not found for subcategory: "${subcatKey}"`);
  return '#fff'; 
};
  const handleToggle = () => {
    const bgColor = getColorBySubcategory(params.subcategoryName);

    if (!toggled) {
    setTheme({
      background: bgColor,        
      messageBubble: '#fff',     
      messageText: bgColor,     
    });
  } else {
    setTheme({
      background: '#fff',
      messageBubble: bgColor,
      messageText: '#fff',
    });
  }
  
    setToggled(!toggled);
  };
  

  
  const loadParams = async () => {
    try {
      const { groupName, subcategoryName } = route.params || {};
      const storedParams = await AsyncStorage.getItem('extraParams');
      const parsedParams = storedParams ? JSON.parse(storedParams) : {};

      const finalSubcategoryName =subcategoryName || parsedParams.subcategoryName;
      const finalGroupName =groupName || parsedParams.groupName;

      setParams({ groupName: finalGroupName, subcategoryName: finalSubcategoryName });
      setSubName(finalSubcategoryName);
      //console.log('params',params.subcategoryName)
      setParamsLoaded(true);
    } catch (error) {
      console.error('Erorr loading params:', error);
    } finally {
      setParamsLoaded(true);
    }
  };

  
  const fetchUserInfo = async () => {
    try {
      const email = JSON.parse(await AsyncStorage.getItem('userEmail'));
      const url = `${ngrokBaseUrl}/users/by-email/${email}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user details');
      }
  
      const data = await response.json();
      setUserDetails(data);  
      if (data && data.username) {
        setUsername(data.username);  
      }
      return data;
    } catch (error) {
      Alert.alert('Error', `Unable to fetch user data: ${error.message}`);
    }
  };
  useEffect(() => {
    loadParams();
    fetchUserInfo(); // Obține informațiile utilizatorului fără token
    fetchMessages();
  }, []);


  const fetchMessagesWithUserProfiles = async () => {
  try {
    const { groupName, subcategoryName } = params;
    if (!groupName || !subcategoryName) return;

    const url = `${ngrokBaseUrl}/messages/${groupName}/${subcategoryName}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch messages');
    const messagesData = await response.json();

    const messagesWithProfiles = await Promise.all(
      messagesData.map(async (msg) => {
        try {
          const userRes = await fetch(`${ngrokBaseUrl}/users/by-username/${msg.username}`);
        
          if (!userRes.ok) throw new Error('Failed to fetch user');
          const userData = await userRes.json();
              console.log("User profile data:", userData);

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
        const errorData = await response.json();
        console.error('API Error response:', errorData);
        throw new Error('Error at getting messages');
      }
  
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error getting messages:', error);
    } finally {
      setLoading(false);
    }
  };


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




  const requestPermissions = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (
      cameraStatus.status !== 'granted' ||
      mediaStatus.status !== 'granted'
    ) {
      Alert.alert(
        'Need Permissions',
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
  
  const takePhoto = async () => {
    const granted = await requestPermissions();
    if (!granted) return;
  
    const result = await ImagePicker.launchCameraAsync({
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
      console.log('Server response:', text);
  
      if (!response.ok) {
        throw new Error(`Trimiterea imaginii a eșuat: ${text}`);
      }
  
      const responseData = JSON.parse(text);
      setMessages((prevMessages) => [...prevMessages, responseData.data]);
    } catch (error) {
      console.error('Eroare la trimiterea imaginii:', error);
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
      console.log('Request body:', requestBody); // Log pentru debugging

      const url = `${ngrokBaseUrl}/messages/send`;
      console.log('Sending message to URL:', url); // Log pentru debugging


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
  if (messages.length > 0 || images.length > 0) {
    // transformă imaginile să aibă același format, ex:
    const formattedImages = images.map(img => ({
      ...img,
      isImage: true,        // pentru a ști că e o imagine
      id: img._id,          // id comun, ca să-l folosești în keyExtractor
      createdAt: img.createdAt,
      username: img.username,
      imageUrl: img.imageUrl // important să păstrezi url-ul imaginii
    }));

    const formattedMessages = messages.map(msg => ({
      ...msg,
      isImage: false,
      id: msg._id,
      createdAt: msg.createdAt
    }));

    // concatenează și sortează după createdAt
    const combined = [...formattedMessages, ...formattedImages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    setCombinedItems(combined);
  }
}, [messages, images]);

  // Render mesaj
  const renderMessageItem = ({ item }) => {
    const isCurrentUser = item.username === username;
    const bubbleColor = getColorBySubcategory(params.subcategoryName);
const userImage = item.userDetails?.profileImage;
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        {!isCurrentUser && (
          <Image source={userImage ? { uri: userImage } : images.defaultProfilePic}
          style={styles.avatar}
        />
        )}
        <View style={[ styles.messageBubble,
          {
            backgroundColor: isCurrentUser ? theme.messageBubble : '#eee', 
            alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
          },
        ]}
        >
          {!isCurrentUser && item.username ? (
    <Text style={styles.usernameText}>{item.username}</Text>) : null}

 {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: 200, height: 200, borderRadius: 10 }}
            resizeMode="cover"
          />
        ) : (
          <Text style={[styles.messageText, { color: isCurrentUser ? theme.messageText : '#000' }]}>
            {item.text}
          </Text>
        )}


        </View>
           
      </View>
    );
  };

  useEffect(() => {
    loadParams();
    fetchUserInfo();
    fetchMessages();
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
          data={combinedItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderMessageItem}
          style={styles.messageList}
        />
       <View style={styles.inputContainer}>
  
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

export default MemberArt;