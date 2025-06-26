import { View, Text, StyleSheet, ScrollView} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient';
import { images } from '../../constants';
import { Image } from 'react-native';
import CustomButtonGroup from '../../components/CustomButtonGroup.jsx'

const arta = () => {
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
            source={images.draw2}
            className="max-w-[350px] w-full h-[270px] ml-10 mt-12"
            resizeMode="contain"
        />

         <Text className="text-[32px] text-center font-ibold ml-5 p-6 mb-12">Art TM</Text>
         
         <View className="flex-row justify-start mb-12 ">
        <CustomButtonGroup
          
          handlePress={() => router.push('/choreo')}
          imageSource={images.choreo1}
          title="Choreo"
          containerStyles={`bg-[#f1e087]`}
          addText="see group ->"
          imageStyle={{ width: 160, height: 100 }}
        />
        <CustomButtonGroup
          handlePress={() => router.push('/writing')}
          imageSource={images.art1}
          title="Writing"
          containerStyles={`bg-[#ffd788]`}
          addText="see group ->"
          imageStyle={{ width: 160, height: 100 }}
        />
      </View>

      
      <View className="flex-row justify-start mb-12">
        <CustomButtonGroup
          handlePress={() => router.push('/photo')}
          imageSource={images.photo1}
          title="Photo"
          containerStyles={`bg-[#ffce93]`}
          addText="see group ->"
          imageStyle={{ width: 160, height: 100 }}
        />
        <CustomButtonGroup
          handlePress={() => router.push('/draw')}
          imageSource={images.draw1}
          title="Draw"
          containerStyles={`bg-[#ffc4a8]`}
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

export default arta