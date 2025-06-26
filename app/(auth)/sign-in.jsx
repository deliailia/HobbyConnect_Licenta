import { View, Text, ScrollView, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import Custombutton from '../../components/CustomButton';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ngrokLink } from '../ngrokLink'; // Import ngrok link

const ngrokBaseUrl = ngrokLink; // Use the ngrok link

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [loadSubmit, setLoadSubmit] = useState(false);
  const router = useRouter();

  const submit = async () => {
    console.log('User credentials', form);
    setLoadSubmit(true);
    console.log("Form submitted:", form);

    // Check if email and password are provided
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please enter both email and password.');
      setLoadSubmit(false);
      return;
    }

    try {
      // Send login request to the backend
      const response = await fetch(`${ngrokBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await response.json();

      if (response.ok  && data.user) {
        // Save the token and user data in AsyncStorage
        //await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('userEmail', JSON.stringify(data.user.email));


        console.log('User email data saved in AsyncStorage:', data.user.email);

        // Navigate to the home page after successful login
        setTimeout(() => {
          router.push('/home');
        }, 1000);
      } else {
        Alert.alert('Login failed', data.message || 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Login failed', error.message || 'Something went wrong. Please try again.');
    }

    setLoadSubmit(false);
  };

  return (
    <LinearGradient 
      colors={['#FFF7AD', '#FF9F9A']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View style={{ width: '100%', padding: 9 }}>
            <Image source={images.hclogo} resizeMode="contain" style={{ maxWidth: 380, width: '100%', height: 265 , marginLeft: 11}} />
            <Text className="mt-3 text-center text-[20px] text-black font-ibold">SIGN IN</Text>
            <FormField
              title="Email"
              value={form.email}
              onTextChange={(e) => setForm({ ...form, email: e })}
              style={{ marginTop: 15 }}
              keyboardType="email-address"
            />
            <FormField
              title="Password"
              value={form.password}
              onTextChange={(e) => setForm({ ...form, password: e })}
              style={{ marginTop: 15 }}
              secureTextEntry={true}
            />
          </View>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Custombutton 
              title="Sign In"
              handlePress={submit}
              containerStyles="bg-secondary min-w-[120px] h-[57px] justify-center items-center"
              load={loadSubmit}
            />
          </View>

          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, flexDirection: 'row', gap: 5 }}>
            <Text className="text-[18px] text-black font-iregular">Don't have an account?</Text>
            <Link href="/sign-up" style={{ fontSize: 18, color: '#FF6F61', fontWeight: 'bold' }}>SIGN UP</Link>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SignIn;