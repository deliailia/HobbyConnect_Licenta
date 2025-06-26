import { View, Text, StyleSheet, ScrollView} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient';
import { images } from '../../constants';
import { Image } from 'react-native';
import CustomButtonGroup from '../../components/CustomButtonGroup.jsx'

const limbi = () => {
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
            source={images.languages}
            className="max-w-[350px] w-full h-[270px] ml-10 mt-12"
            resizeMode="contain"
        />

         <Text className="text-[32px] text-center font-ibold ml-5 p-6 mb-12">Languages TM</Text>
         
         <View className="flex-row justify-start mb-12 ">
        <CustomButtonGroup
          
          handlePress={() => router.push('/korean')}
          imageSource={images.korean2}
          title="Korean"
          containerStyles={`bg-[#d082bb]`}
          addText="see group ->"
          imageStyle={{ width: 160, height: 100 }}
        />
        <CustomButtonGroup
          handlePress={() => router.push('/italian')}
          imageSource={images.italian2}
          title="Italian"
          containerStyles={`bg-[#a35890]`}
          addText="see group ->"
          imageStyle={{ width: 160, height: 100 }}
        />
      </View>

      
      <View className="flex-row justify-start mb-12">
        <CustomButtonGroup
          handlePress={() => router.push('/spanish')}
          imageSource={images.spanish2}
          title="Spanish"
          containerStyles={`bg-[#783067]`}
          addText="see group ->"
          imageStyle={{ width: 160, height: 100 }}
        />
        <CustomButtonGroup
          handlePress={() => router.push('/french')}
          imageSource={images.french2}
          title="French"
          containerStyles={`bg-[#4f0341]`}
          addText="see group ->"
          imageStyle={{ width: 160, height: 100 }}
        />
      </View>


      <View className="flex-row justify-start mb-12">
        <CustomButtonGroup
          
          handlePress={() => router.push('/norvegian')}
          imageSource={images.norvegian2}
          title="Norwegian"
          containerStyles={`bg-[#e35dc4] bg-opacity-10`}
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

export default limbi