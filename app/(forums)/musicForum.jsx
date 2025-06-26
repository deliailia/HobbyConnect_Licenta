import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, Modal, Button } from 'react-native';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Importăm pentru iconițe
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { ngrokLink } from '../ngrokLink'; // Importăm link-ul ngrok
const ngrokBaseUrl = ngrokLink; // Link-ul ngrok pentru API

const NEWS_API_KEY = '4b657695e699417baf3b36b650704941'; // API key pentru News API
const YOUTUBE_API_KEY = 'AIzaSyBGM6B_KBn17UnliK6GC4ZV2TFceFs70Yw'; // API key personalizat pentru YouTube
const MUSIC_QUERY = 'music'; // Căutăm termeni generali legati de muzică

const MusicForum = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoUrls, setVideoUrls] = useState([]);
  const [titles, setTitles] = useState([]);  // Array pentru titluri
  const [loadingMusic, setLoadingMusic] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false); // Pentru a controla vizibilitatea meniului
  const [showModal, setShowModal] = useState(false); // Stare pentru a controla modalul

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
  // Funcția pentru a aduna știri despre muzică
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            q: 'music',
            apiKey: NEWS_API_KEY,
            language: 'en',
          },
        });
        setArticles(response.data.articles);
        setLoading(false);
      } catch (error) {
        console.error('Eroare la obținerea știrilor:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const fetchMusicVideos = async () => {
      try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            part: 'snippet',
            maxResults: 5,
            q: MUSIC_QUERY,
            type: 'video',
            key: YOUTUBE_API_KEY,
          },
        });
  
        const fetchedVideoUrls = [];
        const fetchedTitles = [];
        
        response.data.items.forEach(item => {
          const videoId = item.id.videoId;
          const title = item.snippet.title;
          fetchedVideoUrls.push(`https://www.youtube.com/embed/${videoId}`);
          fetchedTitles.push(title); 
        });
        
        setTitles(fetchedTitles);
        if (fetchedVideoUrls.length > 0) {
          setVideoUrls(fetchedVideoUrls);
          setLoadingMusic(false);
        } else {
          setLoadingMusic(false);
        }
      } catch (error) {
        console.error('Eroare la obtinerea melodiilor:', error);
        setLoadingMusic(false);
      }
    };
  
    fetchMusicVideos();
  }, []);

  const handleChatButtonPress = () => {
    router.push({
      pathname: '/(memberArt)/MemberArt',
      params: { groupName:'Indoor', subcategoryName:'music' },
    });
  };

  const toggleMenu = () => {
    setMenuVisible(prevState => !prevState); 
  };
  
  const closeMenu = () => {
    setMenuVisible(false); 
  };

  const handleSeeMembers = () => {
    router.push({
      pathname: '/membersPage',
      params: { groupName:'Indoor', subcategoryName:'music' },
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
    setShowModal(false); // Închide modalul dacă se anulează
  };

  return (
    <View style={styles.container}>
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

      {/* Modalul pentru confirmarea ieșirii din grup */}
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

      {/* Restul UI-ului rămâne neschimbat */}
      <Text style={styles.musicQuestion}>What music to listen to today?</Text>

      {/* Recomandările muzicale */}
      <View style={styles.musicSection}>
        {loadingMusic ? (
          <Text style={styles.loading}>Loading music...</Text>
        ) : videoUrls.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {videoUrls.map((url, index) => (
              <View key={index} style={styles.videoContainer}>
                <WebView
                  source={{ uri: url }}
                  style={styles.webview}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.error}>No music video found, please try again.</Text>
        )}
      </View>

      {/* Secțiunea cu știri */}
      <ScrollView contentContainerStyle={styles.newsContainer}>
        <Text style={styles.sectionTitle}>Latest Music News</Text>

        {loading ? (
          <Text style={styles.loading}>Loading news...</Text>
        ) : (
          articles.map((article, index) => (
            <View key={index} style={styles.card}>
              {article.urlToImage && (
                <Image source={{ uri: article.urlToImage }} style={styles.image} />
              )}
              <View style={styles.textContainer}>
                <Text style={styles.title}>{article.title}</Text>
                <Text style={styles.description}>{article.description}</Text>
                <TouchableOpacity onPress={() => Linking.openURL(article.url)}>
                  <Text style={styles.readMore}>Read more...</Text>
                </TouchableOpacity>
              </View>
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
  container: {
    flex: 1,
    backgroundColor: '#9793FE',
  },
  profileMenu: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
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
  musicQuestion: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
    marginTop: 110,
  },
  musicSection: {
    marginBottom: 30,
    paddingHorizontal: 15,
  },
  videoContainer: {
    width: 300,
    height: 200,
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  newsContainer: {
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
    padding: 15,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  textContainer: {
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a148c',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 15,
    color: '#333',
    marginBottom: 10,
    lineHeight: 22,
  },
  readMore: {
    fontSize: 16,
    color: '#6a1b9a',
    textDecorationLine: 'underline',
  },
  loading: {
    textAlign: 'center',
    fontSize: 18,
    color: '#555',
  },
  error: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
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

export default MusicForum;
