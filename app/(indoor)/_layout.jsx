import { View, Text } from 'react-native'
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';


const inauntruLayout = () => {
  return (
    
    <LinearGradient
      colors={['#FFF7AD', '#FF9F9A']}
      style={{flex: 1}}>
      
      <Stack
        options={{headerShown: false}}>
        
        <Stack.Screen options={{headerShown: false}}
          name="inauntru"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="music"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="gaming"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="movies"
         
        />
       
      

      
      </Stack>
      <StatusBar backgroundColor="#FFF7AD" style="dark"  />
      
    </LinearGradient>
    
  )
}

export default inauntruLayout