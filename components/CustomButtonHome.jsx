import React from 'react'
import { TouchableOpacity, Text, View, Image } from 'react-native';


const CustomButtonHome = ({title, handlePress, containerStyles, load, imageSource, addText}) => {
  return (
    <TouchableOpacity 
    onPress={handlePress}
    activeOpacity={0.7}
    
    className={`w-[180px]  min-h-[200px] p-4  ml-4 
        ${ containerStyles} ${load ? 'opacity-50' : ''} 
        flex justify-center items-center
        bg-transparent border-2 border-black `}
     disabled={load}
     style={{ borderRadius: 15 }} 
    >
    <View className="flex flex-col items-center">
    
        <Image
            source={imageSource} 
            style={{ width: 164, height: 130, marginBottom: 10 }} 
        />
      
      
      
      <Text className="text-black-100 font-ibold text-lg  ">{title}</Text>
      <Text className="text-black font-iregular text-[15px] text-center">{addText}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default CustomButtonHome;