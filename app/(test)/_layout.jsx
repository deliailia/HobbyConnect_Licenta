import { View, Text } from 'react-native'
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';


const testLayout = () => {
  return (
    
    <LinearGradient
      colors={['#FFF7AD', '#FF9F9A']}
      style={{flex: 1}}>
      
      <Stack
        options={{headerShown: false}}>
        
        <Stack.Screen options={{headerShown: false}}
          name="testIndex"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="languages"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="sports"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="art"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="indoor"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="outdoor"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="startFile"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="random"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="MBTI"
         
        />
       
       
      

      
      </Stack>
      <StatusBar backgroundColor="#FFF7AD" style="dark"  />
      
    </LinearGradient>
    
  )
}

export default testLayout