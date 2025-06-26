import { View, Text } from 'react-native'
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';


const sportsLayout = () => {
  return (
    
    <LinearGradient
      colors={['#FFF7AD', '#FF9F9A']}
      style={{flex: 1}}>
      
      <Stack
        options={{headerShown: false}}>
        
        <Stack.Screen options={{headerShown: false}}
          name="sporturi"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="soccer"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="basket"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="volley"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="pilates"
         
        />
       
       

      
      </Stack>
      <StatusBar backgroundColor="#FFF7AD" style="dark"  />
      
    </LinearGradient>
    
  )
}

export default sportsLayout