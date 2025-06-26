import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { ngrokLink } from '../ngrokLink';




////////NETESTAT INCA 
const ngrokBaseUrl = ngrokLink;// Asigură-te că ai această cale corectă

const MembersPage = () => {
  const route = useRoute();
  const { groupName, subcategoryName } = route.params;

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Functia pentru a obtine datele utilizatorilor (imaginea de profil)
  const fetchUserData = async (username) => {
    try {
      
        const response = await fetch(`${ngrokBaseUrl}/users/${username}`);
        const data = await response.json();
        return data; // Returnează datele utilizatorului
      } catch (error) {
        console.error('Eroare la obținerea datelor utilizatorului:', error);
        return { profileImage: 'default-image-url' }; // Imagine de fallback în caz de eroare
      }
    };
  

  useEffect(() => {
    if (!groupName || !subcategoryName) {
      console.log('Parametrii lipsă:', groupName, subcategoryName);
      setErrorMsg('Parametrii lipsă.');
      setLoading(false);
      return;
    }

    const fetchMembers = async () => {
      const url = `${ngrokBaseUrl}/arts/${groupName}/${subcategoryName}`;
      console.log('URL-ul complet:', url);

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json(); 
        console.log('Răspunsul serverului:', data);

        
        

    if (data?.members) {
      // Fetchăm datele utilizatorilor pentru fiecare membru
      const membersWithData = await Promise.all(data.members.map(async (member) => {
        const userData = await fetchUserData(member.username);
        return {
          ...member,
          profileImage: userData.profileImage || 'default-image-url', // Asigură-te că obții imaginea de profil
        };
      }));

      setMembers(membersWithData);
    } else {
      setErrorMsg('Nu s-au găsit membri.');
    }

        setLoading(false);
      } catch (error) {
        console.error('Eroare la fetch:', error);
        setErrorMsg('Eroare la încărcarea membrilor.');
        setLoading(false);
      }
    };

    fetchMembers();
  }, [groupName, subcategoryName]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <LinearGradient 
      colors={['#FFF7AD', '#FF9F9A']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}>
      <View>
        <Text style={styles.title}>Members in {subcategoryName}</Text>
        <FlatList
          data={members}
          keyExtractor={(item, index) => item._id || index.toString()} // Folosim _id pentru chei unice
          renderItem={({ item }) => {
            console.log('Profile Image URL:', item.profileImage);  // Aici logăm URL-ul pentru a-l verifica
            return (
              <View style={styles.memberCard}>
                <Image
                  source={{
                    uri: item.profileImage || `https://api.dicebear.com/7.x/thumbs/svg?seed=${item.username}`, // Folosim Dicebear ca fallback
                  }}
                  style={styles.avatar}
                />
                <View style={styles.memberInfo}>
                  <Text style={styles.username}>{item.username}</Text>
                  <Text style={styles.joinedAt}>Joined: {new Date(item.joinedAt).toLocaleDateString()}</Text>
                </View>
              </View>
            );
          }}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50,
    marginLeft: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  memberInfo: {
    flexDirection: 'column',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  joinedAt: {
    fontSize: 14,
    color: '#555',
  },
});

export default MembersPage;
