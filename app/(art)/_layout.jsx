import { View, Text } from 'react-native'
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';


const ArtLayout = () => {
  return (
    
    <LinearGradient
      colors={['#FFF7AD', '#FF9F9A']}
      style={{flex: 1}}>
      
      <Stack
        options={{headerShown: false}}>
        
        <Stack.Screen options={{headerShown: false}}
          name="arta"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="choreo"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="draw"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="photo"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="writing"
         
        />
      

      
      </Stack>
      <StatusBar backgroundColor="#FFF7AD" style="dark"  />
      
    </LinearGradient>
    
  )
}

export default ArtLayout