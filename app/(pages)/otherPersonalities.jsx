import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const personalities = [
  'ESTP', 'INFP', 'ENTJ', 'ISFJ', 'ENFP', 'ISTJ', 'INTJ', 'ESFP',
  'INFJ', 'ENFJ', 'ISTP', 'ISFP', 'ESTJ', 'INTP', 'ESFJ', 
];

const OtherPersonalities = () => {
  const router = useRouter();
  const paramsFromRoute = useLocalSearchParams();

  const [finalActivity, setFinalActivity] = useState('');
  const [paramsLoaded, setParamsLoaded] = useState(false);

  // Load finalActivity from params or AsyncStorage
  useEffect(() => {
    const loadParams = async () => {
      try {
        const { finalActivity: activityFromRoute } = paramsFromRoute || {};
        const storedParams = await AsyncStorage.getItem('extraParams');
        const parsedParams = storedParams ? JSON.parse(storedParams) : {};
        const resolvedFinalActivity = activityFromRoute || parsedParams.finalActivity || 'Necunoscut';
        setFinalActivity(resolvedFinalActivity);
      } catch (error) {
        setFinalActivity('Eroare');
      } finally {
        setParamsLoaded(true);
      }
    };
    loadParams();
  }, [paramsFromRoute]);

  const goToTestResults = (personality) => {
    if ( personality === finalActivity ) {
        return;
    }
    router.push({
      pathname: '/testResults',
      params: { finalActivity: personality },
    });
  };

  if (!paramsLoaded) {
    // Poți pune un loading simplu aici, dacă vrei
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
      <LinearGradient colors={['#FFF7AD', '#FF9F9A']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text className="text-3xl font-ibold text-red-500 mb-6 text-center mt-14">
        Other Personalities MBTI
      </Text>
      <View className="flex-row flex-wrap justify-center">
        {personalities
          .filter((personality) => personality !== finalActivity) // Exclude current personality
          .map((personality) => (
            <TouchableOpacity
              key={personality}
              onPress={() => goToTestResults(personality)}
              activeOpacity={0.7}
              className="bg-red-500 rounded-lg m-2 px-6 py-3 shadow-md"
            >
              <Text className="text-white font-ibold text-lg">{personality}</Text>
            </TouchableOpacity>
          ))}
      </View>
    </ScrollView>
    </LinearGradient>
  );
};

export default OtherPersonalities;
