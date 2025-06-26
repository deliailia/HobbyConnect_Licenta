import 'react-native-url-polyfill/auto';
import { StyleSheet, Text, View } from 'react-native'
import {SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font'
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "InriaSans-Bold": require("../assets/fonts/InriaSans-Bold.ttf"),
    "InriaSans-BoldItalic": require("../assets/fonts/InriaSans-BoldItalic.ttf"),
    "InriaSans-Regular": require("../assets/fonts/InriaSans-Regular.ttf"),
    "InriaSans-Italic": require("../assets/fonts/InriaSans-Italic.ttf"),
    "InriaSans-Light": require("../assets/fonts/InriaSans-Light.ttf"),
    "InriaSans-LightItalic": require("../assets/fonts/InriaSans-LightItalic.ttf"),
  });

  useEffect(() => {
    if(error) throw error;

    if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error])

  if(!fontsLoaded && !error) return null;
 
 
  return (
    <Stack>
       <Stack.Screen name="index" options={{headerShown: false}} />
       <Stack.Screen name="(auth)" options={{headerShown: false}} />
       <Stack.Screen name="(tabs)" options={{headerShown: false}} />
       <Stack.Screen name="(languages)" options={{headerShown: false}} />
       <Stack.Screen name="(sports)" options={{headerShown: false}} />
       <Stack.Screen name="(outdoor)" options={{headerShown: false}} />
       <Stack.Screen name="(indoor)" options={{headerShown: false}} />
       <Stack.Screen name="(art)" options={{headerShown: false}} />
       <Stack.Screen name="(test)" options={{headerShown: false}} />
       <Stack.Screen name="(forums)" options={{headerShown: false}} />
       <Stack.Screen name="(memberArt)/MemberArt" options={{headerShown: false}} />
       <Stack.Screen name="(memberArt)/MemberArtLocation" options={{headerShown: false}} />
       <Stack.Screen name="(memberArt)/maps" options={{headerShown: false}} />
       <Stack.Screen name="(pages)/testResults" options={{headerShown: false}} />
       <Stack.Screen name="(pages)/otherPersonalities" options={{headerShown: false}} />
       <Stack.Screen name="(pages)/userReqDet" options={{headerShown: false}} />

    </Stack>
  )
}

export default RootLayout

