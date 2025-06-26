import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButtonHome from '../../components/CustomButtonHome';
import { images } from '../../constants';
import { ngrokLink } from '../ngrokLink';
import { Modal } from 'react-native';





const ngrokBaseUrl = ngrokLink;

const Home = () => {
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  
  
  const getUserDetails = async () => {
    try {
      // Obține token-ul din AsyncStorage
     
      const email = JSON.parse(await AsyncStorage.getItem('userEmail'));
      //console.log("Email retrieved from AsyncStorage:", email);

      if (!email) {
        console.error("Email not found in AsyncStorage!");
        Alert.alert('Authentication error', 'No email found. Please login again.');
        router.push('/sign-in');
        return;
      }
  
      // Trimiterea cererii GET către backend pentru a obține detaliile utilizatorului pe baza email-ului
      const url = `${ngrokBaseUrl}/users/by-email/${email}`;
      //console.log('Fetching user details from:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          //'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Error fetching user details');
      }
  
      const data = await response.json();
      //console.log('User details:', data);
  
      // Actualizează starea cu datele utilizatorului
      if (data.role) {
        await AsyncStorage.setItem('userRole', data.role);
      setRole(data.role);
      } else {
        console.error('Role not found!');
      }
  
      if (data.username) {
        setUserName(data.username);
      } else {
        console.error('Username not found!');
      }
       // Salvează userId în AsyncStorage
    if (data.userId) {
      await AsyncStorage.setItem('userId', data.userId);
      console.log('UserId saved:', data.userId);
    } else {
      console.error('UserId not found in response.');
    }
  
    } catch (error) {
      console.error('Error fetching user details:', error);
      Alert.alert('Error', 'Unable to fetch user details');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    const fetchRoleAndUserName = async () => {
      try {
        await getUserDetails();

        const savedRole = await AsyncStorage.getItem('userRole');
        console.log("Role from AsyncStorage:", savedRole);
        if (savedRole) {
          if (savedRole === 'user') {
            setShowModal(true); // înlocuiește Alert.alert
          } else if (savedRole === 'admin_master') {
            //console.log("Role is admin_master");
            Alert.alert('Welcome back, Admin!', 'You have admin access!');
          }
        }

        await getUserDetails();
      } catch (error) {
        console.error('Error at username or role', error);
      }
    };

    fetchRoleAndUserName();
  }, []);

  return (
    <LinearGradient
      colors={['#FFF7AD', '#FF9F9A']}
      start={{x: 0, y:1}}
      end={{x:1, y:1}}
      style={{flex: 1}}
    >
      <ScrollView>
        <SafeAreaView>
          <View className="flex-1">
            <Text className="text-[32px] font-ibold ml-5 p-6 mb-12">
              Welcome, {userName} !
            </Text>

            <View className="flex-row justify-start mb-4">
              <CustomButtonHome
                title="Languages TM"
                handlePress={() => router.push('/(languages)/limbi')}
                imageSource={images.languages}
                addText="- spanish, italian and more"
              />
              <CustomButtonHome
                title="Sports TM"
                handlePress={() => router.push('/(sports)/sporturi')}
                imageSource={images.sports}
                addText="- soccer, basket and more"
              />
            </View>

            <View className="flex-row justify-start mb-4">
              <CustomButtonHome
                title="Outdoor TM"
                handlePress={() => router.push('/(outdoor)/afara')}
                imageSource={images.walking2}
                addText="- travelling, going out and more"
              />
              <CustomButtonHome
                title="Art TM"
                handlePress={() => router.push('/(art)/arta')}
                imageSource={images.draw2}
                addText="- photography, drawing and more"
              />
            </View>

            <View className="flex-row justify-start mb-4">
              <CustomButtonHome
                title="Indoor TM"
                handlePress={() => router.push('/(indoor)/inauntru')}
                imageSource={images.gaming2}
                addText="- music, gaming and more"
              />
            </View>
          </View>

          <Modal
          visible={showModal}
          animationType="fade"
          transparent
          onRequestClose={() => setShowModal(false)}
          >
          <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-pinkbg rounded-2xl p-6 w-11/12 mx-auto">
          <Text className="text-lg font-ibold text-black mb-4 text-center">
              Do you want to take a Hobby Test?
          </Text>
          <Text className="text-base font-iregular text-black text-center mb-6">
          (It has a lot of questions, but if you are not sure which group is suitable for you we can redirect you to the one that fits your personality)

          </Text>

          <View className="flex-row justify-between">
          <TouchableOpacity
            className="bg-white px-4 py-2 rounded-xl mr-2 flex-1"
            onPress={() => setShowModal(false)}
          >
            <Text className="text-center font-iregular text-black">Maybe later</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-secondary px-4 py-2 rounded-xl ml-2 flex-1"
            onPress={() => {
              setShowModal(false);
              router.push('/(test)/MBTI');
            }}
          >
          <Text className="text-center font-ibold text-black">TEST ME NOW →</Text>
          </TouchableOpacity>
          </View>
          </View>
          </View>
          </Modal>

        </SafeAreaView>
      </ScrollView>
    </LinearGradient>
  );
};

export default Home;
