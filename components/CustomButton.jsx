import { TouchableOpacity, View, Text } from 'react-native'
import React from 'react'

const CustomButton = ({title, handlePress, containerStyles, load}) => {
 
  return (
    <View style={{ padding:25 }}>
      <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.7}
      
      className={` min-w-[350px] min-h-[47px] p-3  mb-0 
       ${ containerStyles} ${load ? 'opacity-50' : ''} flex `}
       disabled={load}
       style={{ borderRadius: 15 }} >
        
        
        <Text className="text-black-100 font-ibold text-lg  ">{title}</Text>
      </TouchableOpacity>

    

    </View>
  )
}

export default CustomButton;