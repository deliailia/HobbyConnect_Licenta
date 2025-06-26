import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native'
import { useState } from 'react'
import { icons } from '../constants'

const FormField = ({title, value, placeholder, onTextChange, style, ...restProps}) => {
    const [showPass,setShowPass] = useState(false);
   
  return (
    <View className={`space-y-2 ${style}`}>
      <Text className="text-base text-black-100 font-iregular mt-2">{title}</Text>

      <View className="w-full h-11 px-4  rounded-2xl
        items-center flex-row  border-transparent
        focus-within:border-blue-500 transition-al duration-300 " style={{backgroundColor: 'rgba(216,116,221,0.36)'}}>
       <TextInput
        className="flex-1 text-black-100 font-ibold text-sm"
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#7b7b8b"
        onChangeText={onTextChange}
        secureTextEntry={title==='Password' && !showPass}
       />

       {title==='Password' && (
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Image source={showPass ? icons.eyeh : icons.eye}
                className="w-6 h-6" resizeMode="contain"
            />
        </TouchableOpacity>
       )}
      </View>
      
    </View>
  )
}


export default FormField