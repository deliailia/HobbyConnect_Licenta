import { View, Text } from 'react-native'
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';


const ForumLayout = () => {
  return (
    
    <LinearGradient
      colors={['#FFF7AD', '#FF9F9A']}
      style={{flex: 1}}>
      
      <Stack
        options={{headerShown: false}}>
        
         <Stack.Screen options={{headerShown: false}}
          name="musicForum"
          
        />

          <Stack.Screen options={{headerShown: false}}
          name="membersPage"
          
        />
        <Stack.Screen options={{headerShown: false}}
          name="LanguageForum"
          
        />
        <Stack.Screen options={{headerShown: false}}
          name="SportsForum"
          
        />
        <Stack.Screen options={{headerShown: false}}
          name="OutdoorsForum"
          
        />


      
      </Stack>
      <StatusBar backgroundColor="#FFF7AD" style="dark"  />
      
    </LinearGradient>
    
  )
}

export default ForumLayout