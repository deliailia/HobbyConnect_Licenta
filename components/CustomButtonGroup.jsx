import React from 'react'
import { TouchableOpacity, Text, View, Image } from 'react-native';


const CustomButtonGroup = ({title, handlePress, containerStyles, load, imageSource, addText, imageStyle}) => {
  return (
    <View>

    <TouchableOpacity 
    onPress={handlePress}
    activeOpacity={0.7}
    
    className={`w-[160px]  min-h-[180px] p-4  ml-6 mr-5
        ${ containerStyles} ${load ? 'opacity-50' : ''} 
         flex justify-center items-center
          `}
     disabled={load}
     style={{ borderRadius: 15 }} 
    >
    <View className="flex flex-col items-center justify-start">
    
        <Image
            source={imageSource} 
            style={[{ width: 100, height: 100, borderRadius: 15 }, imageStyle]}

        />
      
      
      
      <Text className="text-white font-iregular text-[20px] text-center mt-2">{addText}</Text>
      </View>
    </TouchableOpacity>
    <View className="mt-1 items-center">
        <Text className="text-black-100 font-ibold text-lg">{title}</Text>
       
      </View>
    </View>






  )
}

export default CustomButtonGroup;