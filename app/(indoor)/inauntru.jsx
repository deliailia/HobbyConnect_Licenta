import { View, Text, StyleSheet, ScrollView} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient';
import { images } from '../../constants';
import { Image } from 'react-native';
import CustomButtonGroup from '../../components/CustomButtonGroup.jsx'

const inauntru = () => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#FFF7AD', '#FF9F9A']}
      start={{x: 0, y:1}}
      end={{x:1, y:1}}
      style={{flex: 1}}
      >
      <ScrollView>
    <SafeAreaView>
      <View className="flex-1 ">
        <Image
            source={images.music3}
            className="max-w-[350px] w-full h-[270px] ml-10 mt-12"
            resizeMode="contain"
        />

         <Text className="text-[32px] text-center font-ibold ml-5 p-6 mb-12">Indoor Activitities</Text>
         
         <View className="flex-row justify-start mb-12 ">
        <CustomButtonGroup
          
          handlePress={() => router.push('/music')}
          imageSource={images.music1}
          title="Music"
          containerStyles={`bg-[#9793fe]`}
          addText="see group ->"
          imageStyle={{ width: 160, height: 100 }}
        />
        <CustomButtonGroup
          handlePress={() => router.push('/gaming')}
          imageSource={images.gaming1}
          title="Gaming"
          containerStyles={`bg-[#a5a0ff]`}
          addText="see group ->"
          imageStyle={{ width: 160, height: 100 }}
        />
      </View>

      
      <View className="flex-row justify-start mb-12">
        <CustomButtonGroup
          handlePress={() => router.push('/movies')}
          imageSource={images.movie1}
          title="Movies"
          containerStyles={`bg-[#7d7ce4]`}
          addText="see group ->"
          imageStyle={{ width: 160, height: 100 }}
        />
        
      </View>


      

    </View>
      
    </SafeAreaView>
    </ScrollView>
    </LinearGradient>
   
  )
}

export default inauntru