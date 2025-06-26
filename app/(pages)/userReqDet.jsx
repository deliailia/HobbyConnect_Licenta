import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { ngrokLink } from '../ngrokLink';
import { Image } from 'react-native';

export const options = {
  headerShown: false,
};

const ngrokBaseUrl = ngrokLink;

const Details = () => {
  const route = useRoute();
  const navigation = useNavigation();  
  const [paramsLoaded, setParamsLoaded] = useState(false);
  const [params, setParams] = useState({
    username: null,
    adminId: null,
    userReqId:null,
    categoryName: null,
    subcategoryName: null,
    profileImage: null,
  });

  const [requests, setRequests] = useState([
   
  ]);

  useEffect(() => {
    const loadParams = async () => {
      try {
        const {  username, adminId, userReqId, categoryName, subcategoryName, profileImage} = route.params || {};
        console.log('Received params:', route.params);

        const storedParams = await AsyncStorage.getItem('extraParams');
        const parsedParams = storedParams ? JSON.parse(storedParams) : {};

        setParams({
          username: username || parsedParams.username || 'Unknown User',
          adminId: adminId || parsedParams.adminId || 'Unknown Admin',
          userReqId: userReqId || parsedParams.userReqId || 'Unknown req',
          categoryName: categoryName || parsedParams.categoryName || 'Unknown Category',
          subcategoryName: subcategoryName || parsedParams.subcategoryName || 'Unknown Subcategory',
          profileImage: profileImage || parsedParams.profileImage || null,

        });
      } catch (error) {
        console.error('Error loading params', error);
      } finally {
        setParamsLoaded(true);
      }
    };

    loadParams();
  }, [route.params]);

  if (!paramsLoaded) {
    return (
      <LinearGradient colors={['#FFF7AD', '#FF9F9A']} className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="text-base mt-4">Loading params...</Text>
      </LinearGradient>
    );
  }

 

  const handleAcceptRequest = async () => {
    try {
      const data = {
        username: params.username, categoryName: params.categoryName, adminId: params.adminId, 
        userReqId: params.userReqId, subcategoryName: params.subcategoryName,
        joinedAt: new Date().toISOString(),
      };
      const url = `${ngrokBaseUrl}/arts/add-user`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error adding user: ${response.statusText}`);
      }
      const result = await response.json();  
      Toast.show({
        type: 'success',
        text1: 'Request approved',
        text2: `${params.username} added to group`,
        visibilityTime: 1000,
        onHide: () => {
          navigation.goBack();
        },
      });
      setRequests((prevRequests) => {
        return prevRequests.filter((request) => request.username !== params.username);
      });

    } catch (error) {
      console.error('Error accepting request:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not add user',
        visibilityTime: 3000,
      });
    }
  };

  const deleteRequest = async (userReqId) => {
  try {
    if (!userReqId) {
      console.warn('userReqId is required to delete a request.');
      return;
    }
    const url = `${ngrokBaseUrl}/requests/delete-request/${userReqId}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete request.');
    }
    const result = await response.json();

Toast.show({
      type: 'success',
      text1: 'Request denied',
      visibilityTime: 100,
      onHide: () => {
        navigation.goBack(); 
      },
    });
  } catch (error) {
    console.error('Error deleting request:', error);
  }
};


  return (
    <LinearGradient colors={['#FFF7AD', '#FF9F9A']} className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-9 mt-9">
        <View className="items-center">
         {params.profileImage ? (
  <Image
    source={{ uri: params.profileImage }}
    className="w-24 h-24 rounded-full mb-4"
  />
) : (
  <View className="w-24 h-24 rounded-full bg-gray-200 justify-center items-center mb-4">
    <Text className="text-3xl font-ibold text-gray-500">{params.username?.charAt(0)}</Text>
  </View>
)}

          <Text className="text-2xl font-ibold text-gray-800 mb-2">
            {params.username}
          </Text>
          <Text className="text-lg text-gray-700 mb-1 font-light">
            <Text className="font-ibold">Group name: </Text>
            {params.categoryName}
          </Text>
          
         
          <Text className="text-2xl text-gray-700 mt-12 flex-wrap font-light mb-24">
            <Text className="font-ibold text-3xl">{params.username} </Text>
             has requested to participate in group <Text className="font-bold text-3xl">{params.subcategoryName}</Text>.
          </Text>
          
          <TouchableOpacity
            onPress={handleAcceptRequest}
            className="bg-green-500 text-white rounded-lg mt-6 px-8 py-3"
          >
            <Text className="text-center font-ibold text-xl text-gray-700">Accept Request</Text>
          </TouchableOpacity>
          <TouchableOpacity
  onPress={() => {
    console.log('Deleting request with userReqId:', params.userReqId);
    deleteRequest(params.userReqId)}}
             className="bg-red-500 text-white rounded-lg mt-6 px-8 py-3"

>
  <Text className="text-center font-ibold text-xl text-gray-700">
    Delete Request
  </Text>
</TouchableOpacity>

        </View>
      </ScrollView>
    </LinearGradient>
  );
};

Details.options = {
  headerShown: false,  
};

export default Details;
