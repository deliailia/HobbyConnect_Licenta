import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet } from 'react-native';

const MemberArtLayout = () => {
  const groupName = "Numele Grupului"; // aici poți primi din props sau din context/rute

  return (
    <LinearGradient colors={['#FFF7AD', '#FF9F9A']} style={{ flex: 1 }}>
      {/* HEADER PERSONALIZAT */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{groupName}</Text>
      </View>

      {/* STACK fără header nativ */}
      <Stack screenOptions={{ headerShown: false }} />

      <StatusBar backgroundColor="#FFF7AD" style="dark" />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#FFF7AD',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingTop: 15, // pentru status bar pe iOS
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default MemberArtLayout;
