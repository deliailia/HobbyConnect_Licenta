import { View, Text } from 'react-native'
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';


const LanguagesLayout = () => {
  return (
    
    <LinearGradient
      colors={['#FFF7AD', '#FF9F9A']}
      style={{flex: 1}}>
      
      <Stack
        options={{headerShown: false}}>
        
        <Stack.Screen options={{headerShown: false}}
          name="afara"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="travelling"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="walking"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="coffee"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="food"
         
        />
      

      
      </Stack>
      <StatusBar backgroundColor="#FFF7AD" style="dark"  />
      
    </LinearGradient>
    
  )
}

export default LanguagesLayout