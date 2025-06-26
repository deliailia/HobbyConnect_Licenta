import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { images } from '../../constants';
import { ngrokLink } from '../ngrokLink';
import Colors from '../../constants/colors';



const ngrokBaseUrl = ngrokLink;


const Choreo = () => {
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(false);
  const subcategoryName = 'choreo';
  const categoryName = 'Art';
  const adminId = '68193030cb5b2880e10b9832';
  const router = useRouter();

  const getUserDetails = async () => {
    try {
      // Obține email-ul utilizatorului din AsyncStorage
      const email = JSON.parse(await AsyncStorage.getItem('userEmail'));
      //console.log('Email retrieved from AsyncStorage:', email); // Log pentru debugging
  
      if (!email) throw new Error('No user email found');
      //console.log('Fetching user details from:', `${ngrokBaseUrl}/users/by-email/${email}`);
  
      const url = `${ngrokBaseUrl}/users/by-email/${email}`;
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
      console.log('User details fetched from API:', data); // Log pentru debugging
      return data;
     
      
    } catch (error) {
      console.error('Error fetching user details:', error.message);
      Alert.alert('Error', `Unable to fetch user data: ${error.message}`);
    }
  };
  useEffect(() => {
    getUserDetails();
  }, []);

  const checkMembership = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found. Please login again.');
        return;
      }
      const url = `${ngrokBaseUrl}/arts/${categoryName}/${subcategoryName}`;

      const response = await fetch(
        url,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (response.status === 200) {
        const memberExists = data.members.some((member) => member.userReqId === userId);
        setIsMember(memberExists);
      } else {
        console.error('Erorr checking members:', data.message);
      }
    } catch (error) {
      console.error('Erorr verifying members:', error);
    }
  };

  useEffect(() => {
    checkMembership();
  }, []);

  useEffect(() => {
    if (isMember) {
      setTimeout(() => {
        router.push({
          pathname: '/(forums)/LanguageForum',
          params: { groupName: 'Art', subcategoryName: 'choreo' },
        });
      }, 2000);
    }
  }, [isMember]);

   const sendRequestToAdmin = async () => {
            try {
              const userInfo = await getUserDetails();
              if (!userInfo) {
                return; // Dacă nu se pot obține informațiile utilizatorului, ieșim din funcție
              }
          
              const { username, userId: userReqId } = userInfo; // Extragem username-ul și userReqId din răspuns
              console.log('Username:', username); // Log pentru debugging
              console.log('UserReqId:', userReqId); // Log pentru debugging
          
              setLoading(true);
          
              const url = `${ngrokBaseUrl}/requests/send-request`;
              console.log('Sending request to URL:', url); // Log pentru debugging
          
              const requestBody = {
                username: username,
                adminId: adminId, // Specific pentru grup
                userReqId: userReqId,
                categoryName: categoryName, // Specific pentru grup
                subcategoryName: subcategoryName, // Specific pentru grup
              };
              console.log('Request body:', requestBody); // Log pentru debugging
          
              const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
              });
          
              const data = await response.json();
              console.log('Response data:', data); // Log pentru debugging
          
              if (response.status === 201) {
                Alert.alert('Success', 'Request has been sent!');
              } else {
                Alert.alert('Error', data.message || 'Could not send the request.');
              }
            } catch (error) {
              console.error('Error sending request:', error); // Log pentru debugging
              Alert.alert('Error', 'Internal issue.');
            } finally {
              setLoading(false);
            }
          };
  

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.art.choreo,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 130,
        position: 'relative',
      }}
    >
      <Image
        source={images.choreo2} 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '120%',
          opacity: 0.3,
        }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingTop: 10,
        }}
      >
        <Image
          source={images.choreo1}
          style={{
            width: 308,
            height: 283,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: '#fff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
          }}
        />

        <Text
          style={{
            fontSize: 40,
            color: '#000',
            marginTop: 100,
            fontFamily: 'Arial',
            textAlign: 'center',
          }}
        >
          Choreography
        </Text>
        <ScrollView>
        <Text
          style={{
            fontSize: 24,
            color: '#000',
            marginTop: 40,
            fontFamily: 'Arial',
            textAlign: 'center',
            lineHeight: 36,
          }}
          numberOfLines={25}
        >
          For the movers and dreamers! Whether you are into hip hop, contemporary, K-pop, or freestyle, this group is for sharing choreography, discovering new moves, and connecting through dance. No matter your level — just bring your energy
        </Text>
        </ScrollView>

        {!isMember && (
          <TouchableOpacity
            style={{
              backgroundColor: '#FF9F9A',
              padding: 20,
              position: 'absolute',
              bottom: 75,
              borderRadius: 15,
              width: '80%',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
            }}
            onPress={sendRequestToAdmin}
            disabled={loading}
          >
            {loading ? (
              <Text style={{ fontSize: 25, color: '#fff' }}>Sending request...</Text>
            ) : (
              <Text style={{ fontSize: 25, color: '#fff' }}>Send Request</Text>
            )}
          </TouchableOpacity>
        )}

        {isMember && (
          <Text
            style={{
              fontSize: 20,
              color: '#008000',
              marginTop: 30,
              fontFamily: 'Arial',
              textAlign: 'center',
            }}
          >
            You are already a member of this group!
          </Text>
        )}
      </View>
    </View>
  );
};

export default Choreo;
