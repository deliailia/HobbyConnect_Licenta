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
          name="french"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="italian"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="korean"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="norvegian"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="spanish"
         
        />
       
        <Stack.Screen options={{headerShown: false}}
          name="limbi"
         
        />
        
        
        
         

      
      </Stack>
      <StatusBar backgroundColor="#FFF7AD" style="dark"  />
      
    </LinearGradient>
    
  )
}

export default LanguagesLayout