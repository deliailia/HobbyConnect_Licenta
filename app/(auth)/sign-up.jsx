import { View, Text, ScrollView, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants'; // Asigură-te că ai importul corect
import FormField from '../../components/FormField';
import Custombutton from '../../components/CustomButton'; 
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../../firebaseConfig'; // Asigură-te că ai importat corect configurația Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Corect importul pentru createUserWithEmailAndPassword
import { ngrokLink } from '../ngrokLink'; // Importă corect link-ul ngrok
import AsyncStorage from '@react-native-async-storage/async-storage'; // Asigură-te că ai importul corect pentru AsyncStorage

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '', // Adăugăm confirmarea parolei
  });

  const [loadSubmit, setLoadSubmit] = useState(false);  // Starea de încărcare pentru submit
  const router = useRouter();
const ngrokBaseUrl = ngrokLink;
  // Funcția de submit pentru crearea unui cont
  const submit = async () => {
    console.log('User credentials', form);
    setLoadSubmit(true); // Setăm încărcarea activă

    // Verificăm dacă parolele se potrivesc
    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      setLoadSubmit(false);
      return;
    }

    if (form.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      setLoadSubmit(false);
      return;
    }

    try {
      // Creăm utilizatorul folosind Firebase
      // const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      // const user = userCredential.user;
      // console.log('User created:', user);
      // const token = await user.getIdToken();
      // await AsyncStorage.setItem('token', token);

      // Dacă utilizatorul este creat cu succes, afișăm un mesaj de succes
      // Alert.alert("Success", "User created successfully!", [
      //   { text: "OK", onPress: () => console.log("User created!") }
      // ]);
      const response = await fetch(`${ngrokBaseUrl}/auth/signup`, {  // Folosim URL-ul definit de ngrok
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        //  'Authorization': `Bearer ${token}`, // Include token-ul în header
        },
        body: JSON.stringify({ email: form.email, password: form.password, username:form.username }), // Adăugăm username-ul în cererea de creare a utilizatorului
      });
      // După 1.5 secunde, navigăm către pagina de login
      setTimeout(() => {
        router.push('/sign-in'); // Navigăm la pagina de login
      }, 1500);
    } catch (error) {
      console.error('Error creating user:', error);
      // Afișăm un mesaj de eroare în caz de eșec
      Alert.alert("Error", error.message || 'Signup failed. Please try again.');
    } finally {
      setLoadSubmit(false); // Resetăm starea de încărcare
    }
  };

  return (
    <LinearGradient 
      colors={['#FFF7AD', '#FF9F9A']}
      start={{x: 0, y:1}}
      end={{x:1, y:1 }}
      style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          <View style={{ width: '100%', padding: 9 }}>
            <Image source={images.hclogo} resizeMode='contain' style={{ maxWidth: 380, width: '100%', height: 265 , marginLeft: 11}} />
            <Text className="mt-3 text-center text-[20px] text-black font-ibold">
              SIGN UP
            </Text>
            <FormField
              title="Username"
              value={form.username}
              onTextChange={(e) => setForm({ ...form, username: e })}
              style={{ marginTop: 8 }}
            />
            <FormField
              title="Email"
              value={form.email}
              onTextChange={(e) => setForm({ ...form, email: e })}
              style={{ marginTop: 10 }}
              keyboardType="email-address"
            />
            <FormField
              title="Password"
              value={form.password}
              onTextChange={(e) => setForm({ ...form, password: e })}
              style={{ marginTop: 9 }}
              secureTextEntry={true} // Protejăm parola
            />
            <FormField
              title="Confirm Password"
              value={form.confirmPassword}
              onTextChange={(e) => setForm({ ...form, confirmPassword: e })}
              style={{ marginTop: 15 }}
              secureTextEntry={true} // Confirmăm parola
            />
          </View>

          {/* Butonul de sign up */}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Custombutton 
              title="Sign Up"
              handlePress={submit}
              containerStyles="bg-secondary min-w-[120px] h-[57px] justify-center items-center"
              load={loadSubmit} // Afișăm indicatorul de încărcare
            />
          </View>

          {/* Link pentru logare în cazul în care utilizatorul deja are un cont */}
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, flexDirection: 'row', gap: 5 }}>
            <Text style={{ fontSize: 18, color: '#000' }}>Have an account already?</Text>
            <Link href="/sign-in" style={{ fontSize: 18, color: '#FF6F61', fontWeight: 'bold' }}>SIGN IN</Link>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SignUp;
