import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, ActivityIndicator, Modal, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useSearchParams } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { ngrokLink } from '../ngrokLink';
const ngrokBaseUrl = ngrokLink; // Linkul ngrok pentru backend

const NEWS_API_KEY = '4b657695e699417baf3b36b650704941'; // API key pentru News API

const LanguageForum = () => {
  const route = useRoute();
  const router = useRouter();

  const { groupName, subcategoryName } = route.params;

  const [articles, setArticles] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false); // Pentru meniul de profil
  const [showModal, setShowModal] = useState(false); // Pentru confirmarea ieșirii din grup

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
  useEffect(() => {
    if ( !subcategoryName) {
      console.error('Missing parameters:', { groupName, subcategoryName });
    } else {
      console.log('Parameters loaded:', { groupName, subcategoryName });
    }
  }, [groupName, subcategoryName]);

  
  // Fetch news based on subcategoryName
  useEffect(() => {
    if ( !subcategoryName) return;

    const fetchNews = async () => {
      try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            q: subcategoryName,
            apiKey: NEWS_API_KEY,
            language: 'en',
          },
        });
        setArticles(response.data.articles);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchNews();
  }, [ subcategoryName]);

  

  const handleChatButtonPress = () => {
    console.log("➡️ Navigating to MemberArt with params:", {
      groupName,
      subcategoryName
    });
      router.push({
        pathname: '/(memberArt)/MemberArt',
        params: { groupName, subcategoryName,    
        //locationLat: location.latitude.toString(),
        //locationLong: location.longitude.toString(), 
      },
      });
    };

  const toggleMenu = () => {
    setMenuVisible((prevState) => !prevState);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const handleSeeMembers = () => {
      router.push({
        pathname: '(forums)/membersPage',
        params: { groupName, subcategoryName },
      });
    };

  const handleLeaveGroup = () => {
    setShowModal(true);
  };

  const confirmLeaveGroup = async () => {
    try {
      const userDetails = await getUserDetails(); // Asigură-te că această funcție returnează un obiect cu username-ul
    if (!userDetails || !userDetails.username) {
      console.warn('Username not found');
      return;
    }

    const username = userDetails.username;
    const url = `${ngrokBaseUrl}/arts/remove-user`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryName: groupName,
          subcategoryName,
          username,
        }),
      });

      if (!response.ok) {
        throw new Error('Error leaving group');
      }

      console.log('Successfully left the group');
      router.push('/'); // Navighează către pagina principală
    } catch (error) {
      console.error('Error leaving group:', error);
    } finally {
      setShowModal(false);
    }
  };
  const cancelLeaveGroup = () => {
    setShowModal(false);
  };

  

  if (!groupName || !subcategoryName) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Missing parameters: {groupName || 'undefined'} {subcategoryName || 'undefined'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profil Menu */}
      <View style={styles.profileMenu}>
        <TouchableOpacity style={styles.profileButton} onPress={toggleMenu}>
          <MaterialCommunityIcons name="account-circle" size={40} color="#fff" />
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={handleSeeMembers} style={styles.menuItem}>
            <Text style={styles.menuItemText}>See Members</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLeaveGroup} style={styles.menuItem}>
            <Text style={styles.menuItemText}>Leave Group</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={closeMenu} style={styles.menuItem}>
            <Text style={styles.menuItemText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal pentru confirmarea ieșirii din grup */}
      <Modal
        transparent={true}
        visible={showModal}
        animationType="fade"
        onRequestClose={cancelLeaveGroup}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Are you sure you want to leave the group?</Text>
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={cancelLeaveGroup} />
              <Button title="Yes" onPress={confirmLeaveGroup} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Secțiunea cu știri */}
      <ScrollView style={styles.newsContainer}>
        <Text style={styles.title}>Welcome to the {subcategoryName} Forum</Text>
        <Text style={styles.sectionTitle}>Latest News</Text>
        {loadingNews ? (
          <Text style={styles.loadingText}>Loading news...</Text>
        ) : (
          articles.map((article, index) => (
            <View key={index} style={styles.card}>
              {article.urlToImage && (
                <Image source={{ uri: article.urlToImage }} style={styles.image} />
              )}
              <Text style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.articleDescription}>{article.description}</Text>
              <TouchableOpacity onPress={() => Linking.openURL(article.url)}>
                <Text style={styles.readMore}>Read more</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Butonul de chat */}
      <TouchableOpacity style={styles.chatButton} onPress={handleChatButtonPress}>
        <MaterialCommunityIcons name="chat" size={40} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Stiluri similare cu cele din MusicForum
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileMenu: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  profileButton: {
    backgroundColor: '#6a1b9a',
    borderRadius: 50,
    padding: 10,
  },
  menuContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
    zIndex: 100,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 20,
    color: '#6a1b9a',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  newsContainer: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  articleDescription: {
    fontSize: 14,
    color: '#555',
  },
  readMore: {
    fontSize: 14,
    color: '#007BFF',
    marginTop: 5,
  },
  chatButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#6a1b9a',
    borderRadius: 50,
    padding: 15,
    elevation: 10,
  },
});

export default LanguageForum;