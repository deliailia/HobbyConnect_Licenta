import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { ngrokLink } from '../ngrokLink';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ngrokBaseUrl = ngrokLink;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [username, setUsername] = useState('');
  const [aboutMe, setAboutMe] = useState('');

  const getUserDetails = async () => {
    try {
      // Obține email-ul utilizatorului din AsyncStorage
      const email = JSON.parse(await AsyncStorage.getItem('userEmail'));
      console.log('Email retrieved from AsyncStorage:', email); // Adaugă acest log

      if (!email) throw new Error('No user email found');
      console.log('User email:', email);
     // console.log('Fetching user details from:', `${ngrokBaseUrl}/users/by-email/${email}`);
  
      const url = `${ngrokBaseUrl}/users/by-email/${email}`;
   // console.log('Fetching user details from:', url);
      // Apelăm API-ul pentru a obține detaliile utilizatorului
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from API:', errorData);
        throw new Error('Failed to fetch user details');
      }
  
      const data = await response.json();
      //console.log('User details fetched from API:', data);
      console.log('Fetched user details:', data);
      console.log('Image URI:', imageUri);


      // Setează datele utilizatorului în starea componentei
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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const saveChanges = async () => {
    try {
      const formData = new FormData();
  
      // Adaugă email-ul utilizatorului
      const email = JSON.parse(await AsyncStorage.getItem('userEmail'));
      if (!email) throw new Error('No user email found');
      formData.append('email', email);
      console.log('Email to be sent:', email); // Adaugă acest log
  
      // Adaugă username și aboutMe în FormData
      if (username) formData.append('username', username);
      console.log('Username to be sent:', username); // Adaugă acest log
      if (aboutMe) formData.append('aboutMe', aboutMe);
      console.log('AboutMe to be sent:', aboutMe); // Adaugă acest log  
  
      // Adaugă imaginea de profil în FormData, dacă există
      if (imageUri) {
        const fileType = imageUri.split('.').pop(); // Extrage extensia fișierului
        formData.append('image', {
          uri: imageUri,
          name: `profile.${fileType}`,
          type: `image/${fileType}`,
        });
      }
  
      console.log('FormData to be sent:', formData);
  
      // Trimite cererea către backend
      const response = await fetch(`${ngrokBaseUrl}/users/update-profile`, {
        method: 'PATCH',
        headers: {
          //'Accept': 'application/json', // Acceptă răspunsuri JSON
          // Nu adăugăm 'Content-Type', deoarece `fetch` îl setează automat pentru `FormData`
        },
        body: formData,
      });
  
      const responseText = await response.text(); // Obține răspunsul ca text
console.log('Raw server response:', responseText);
let result;
try {
  result = JSON.parse(responseText); // Încearcă să parsezi răspunsul ca JSON
} catch (error) {
  console.error('Error parsing JSON:', error);
  Alert.alert('Error', 'Server response is not valid JSON');
  return;
}

console.log('Parsed server response:', result);

  
      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully!');
        // Actualizează starea utilizatorului cu noile date
        setUser((prevUser) => ({
          ...prevUser,
          username,
          aboutMe,
          profileImage: imageUri || prevUser.profileImage,
        }));
      } else {
        Alert.alert('Error', result.message || 'Could not update profile.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Something went wrong while saving your profile.');
    }
  };

  return (
    <LinearGradient colors={['#FFF7AD', '#FF9F9A']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={{ flex: 1, padding: 5 }}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 120 }}>
        <View className="items-center mb-5">
          <View className="w-36 h-36 rounded-full overflow-hidden mb-4">
            <Image source={imageUri ? { uri: imageUri } : require('../../assets/images/defaultProfilePic.png')} className="w-full h-full rounded-full" />
          </View>
          <Text className="text-2xl font-bold text-gray-700">{user?.username}</Text>
        </View>

        <View className="w-full p-5">
  <Text className="text-lg text-gray-800 mb-3">Email: {user?.email || 'No email available'}</Text>
  <Text className="text-lg text-gray-800 mb-3 mt-5">Username:</Text>
  <TextInput
    style={{ borderWidth: 1, borderColor: 'pink', padding: 15, marginBottom: 7, width: '100%', borderRadius: 5 }}
    value={username}
    onChangeText={setUsername}
  />
  <Text className="text-lg text-gray-800 mb-3 mt-5">About me:</Text>
  <TextInput
    style={{ borderWidth: 1, borderColor: 'pink', padding: 15, marginBottom: 7, width: '100%', borderRadius: 5 }}
    value={aboutMe}
    onChangeText={setAboutMe}
  />
</View>

        <View className="items-center justify-center w-full mt-5 flex-center">
          <TouchableOpacity onPress={pickImage} style={{ backgroundColor: '#FFB6C1', padding: 10, borderRadius: 5, width: '80%', marginBottom: 10 }}>
            <Text className="text-center text-white">Upload photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePhoto} style={{ backgroundColor: '#FFB6C1', padding: 10, borderRadius: 5, width: '80%', marginBottom: 20 }}>
            <Text className="text-center text-white">Take photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={saveChanges} style={{ backgroundColor: '#FF69B4', padding: 20, borderRadius: 5, width: '80%' }}>
            <Text className="text-center text-white">Save changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Profile;