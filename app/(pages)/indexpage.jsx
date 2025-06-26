import { View, Text } from 'react-native'
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

export const options = {
  headerShown: false,
};

const PagesLayout = () => {
  return (
    
    <LinearGradient
      colors={['#FFF7AD', '#FF9F9A']}
      style={{flex: 1}}>
      
      <Stack
        options={{headerShown: false}}>
        
        <Stack.Screen options={{headerShown: false}}
          name="userReqDet"
         
        />
        <Stack.Screen options={{headerShown: false}}
          name="testResults"
         
        />
         <Stack.Screen options={{headerShown: false}}
          name="oterPersonalities"
         
        />
       
        

      
      </Stack>
      <StatusBar backgroundColor="#FFF7AD" style="dark"  />
      
    </LinearGradient>
    
  )
}

export default PagesLayout