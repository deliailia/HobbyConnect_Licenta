import 'react-native-url-polyfill/auto';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import { Image } from 'react-native';
import  CustomButton  from '../components/CustomButton';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';

export default function App() {
 
  return (
    <LinearGradient
      colors={['#FFF7AD', '#FF9F9A']}
      start={{x: 0, y:1}}
      end={{x:1, y:1}}
      style={{flex: 1}}
      >
    <SafeAreaView className=" h-full">
     <ScrollView contentContainerStyle={{ height:'100%'}}>
      <View className="w-full  min-h-[90vh] px-4 flex justify-center items-center">
        
        <Image
          source={images.hclogo}
          className="max-w-[380px] w-full h-[300px]"
          resizeMode="contain" 
        
        /> 
        <View className="relative mt-5">
          <Text className="text-xl text-black font-ibold text-center">
            WELCOME TO {' '}
            <Text className="text-secondary">
            HOBBYCONNECT
            </Text>
          </Text>
        </View>
        <Text className="text-xl font-ibold text-black-100 mt-7 text-center">
         Here you can discover your passions as well as other people like you!
        </Text>
        <View className="w-full mt-10 pl-5">
        <Text className="text-lg font-iregular text-black-100 mt-8 ">
        Connect with HobbyConnect
        </Text>
        </View>

        <CustomButton
          title="Go to Email ->"
          handlePress={() => router.push('/sign-in')}
          containerStyles=" bg-primary "
        />

        
        
      </View>
     </ScrollView>
     <StatusBar backgroundColor='#FFF7AD' style='dark'/> 
     
    </SafeAreaView>
    </LinearGradient>
    
  );
}


