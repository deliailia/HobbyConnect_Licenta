import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

const StartFile = () => {
  const router = useRouter();
  
  const [username, setUsername] = useState("");  
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const handleStartTest = () => {
    if (username.trim() === "") {
      alert("Please enter a username to start the test.");
      return;
    }

    router.push('/testIndex');
  };

  return (
    <LinearGradient
      colors={['#FFF7AD', '#FF9F9A']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <View style={{ alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'ibold', textAlign: 'center', marginBottom: 20 }}>
        You have to answer to a few questions for each group of hobbies. 
    
        </Text>

        <TextInput
          style={{
            height: 50,
            width: 300,
            borderColor: 'black',
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: 30,
            marginTop: 30,
            paddingLeft: 10,
            fontSize: 18,
          }}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
        />

        
<TouchableOpacity
          style={{
            backgroundColor: isButtonPressed ? 'rgba(255, 255, 255, 0.6)' : '#CE4D8D', 
            borderWidth: 2,
            borderColor: '#CE4D8D',
            borderRadius: 10,
            paddingVertical: 12,
            paddingHorizontal: 40,
            marginBottom: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={handleStartTest}
          onPressIn={() => setIsButtonPressed(true)}  
          onPressOut={() => setIsButtonPressed(false)} 
        >
         <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontWeight: 'bold',
            }}
          >
            Start Test
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default StartFile;
