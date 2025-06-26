import { View, Text, StyleSheet, ScrollView} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient';
import { images } from '../../constants';
import { Image } from 'react-native';
import CustomButtonGroup from '../../components/CustomButtonGroup.jsx'

const sporturi = () => {
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
            source={images.sports}
            className="max-w-[350px] w-full h-[270px] ml-10 mt-12"
            resizeMode="contain"
        />

         <Text className="text-[32px] text-center font-ibold ml-5 p-6 mb-12">Sports TM</Text>
         
         <View className="flex-row justify-start mb-12 ">
        <CustomButtonGroup
          
          handlePress={() => router.push('/soccer')}
          imageSource={images.soccer1}
          title="Soccer"
          containerStyles={`bg-[#b4ec9f]`}
          addText="see group ->"
          imageStyle={{ width: 160, height: 100 }}
        />
        <CustomButtonGroup
          handlePress={() => router.push('/basket')}
          imageSource={images.basket1}
          title="Basket"
          containerStyles={`bg-[#84ba71]`}
          addText="see group ->"
          imageStyle={{ width: 160, height: 100 }}
        />
      </View>

      
      <View className="flex-row justify-start mb-12">
        <CustomButtonGroup
          handlePress={() => router.push('/volley')}
          imageSource={images.volley1}
          title="Volley"
          containerStyles={`bg-[#568b45]`}
          addText="see group ->"
          imageStyle={{ width: 160, height: 100 }}
        />
        <CustomButtonGroup
          handlePress={() => router.push('/pilates')}
          imageSource={images.pilates1}
          title="Pilates"
          containerStyles={`bg-[#93ca7f]`}
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

export default sporturi