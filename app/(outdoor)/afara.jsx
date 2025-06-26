import { View, Text, StyleSheet, ScrollView} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient';
import { images } from '../../constants';
import { Image } from 'react-native';
import CustomButtonGroup from '../../components/CustomButtonGroup.jsx'
import Colors from '../../constants/colors';

const afara = () => {
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
            source={images.walking2}
            className="max-w-[350px] w-full h-[270px] ml-10 mt-12"
            resizeMode="contain"
        />

         <Text className="text-[32px] text-center font-ibold ml-5 p-6 mb-12">Outdoor Activities TM</Text>
         
         <View className="flex-row justify-start mb-12 ">
        <CustomButtonGroup
          
          handlePress={() => router.push('/coffee')}
          imageSource={images.coffee1}
          title="Coffee Tasting"
          containerStyles={`bg-[#216e8f]`}
          addText="see group ->"
          imageStyle={{ width: 160, height: 100 }}
        />
        <CustomButtonGroup
          handlePress={() => router.push('/food')}
          imageSource={images.food1}
          title="Food Tasting"
          containerStyles={`bg-[#004b6a]`}
          addText="see group ->"
          imageStyle={{ width: 160, height: 100 }}
        />
      </View>

      
      <View className="flex-row justify-start mb-12">
        <CustomButtonGroup
          handlePress={() => router.push('/travelling')}
          imageSource={images.travelling1}
          title="Travelling"
          containerStyles={`bg-[#4f93b6]`}
          addText="see group ->"
          imageStyle={{ width: 160, height: 100 }}
        />
        <CustomButtonGroup
          handlePress={() => router.push('/walking')}
          imageSource={images.walking1}
          title="Walking"
          containerStyles={`bg-[#78BADE]`}
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

export default afara