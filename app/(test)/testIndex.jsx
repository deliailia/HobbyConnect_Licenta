import { View, Text } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native'
import  CustomButton  from '../../components/CustomButton';
import {useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'


const testIndex = () => {
  const router = useRouter();
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  
    return (
        <LinearGradient 
          colors={['#FFF7AD', '#FF9F9A']}
          start={{x: 0, y:1}}
          end={{x:1, y:1 }}
          style={{flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
          <ScrollView>
            <View className="w-full px-5 py-0">
              <Text className="mt-12 text-black-100 text-3xl font-ibold  text-center"> 
              Pick a main group between these options:
              </Text>
            </View>
            <View style={{ padding: 19, justifyContent: 'center', alignItems: 'center'}}>
              <CustomButton
                title="Languages"
                handlePress={() => router.push('/languages')}
                containerStyles=" bg-lcol "
              />
               <CustomButton
                title="Sports"
                handlePress={() => router.push('/sports')}
                containerStyles=" bg-scol "
              />
               <CustomButton
                title="Outdoor"
                handlePress={() => router.push('/outdoor')}
                containerStyles=" bg-ocol "
              />
               <CustomButton
                title="Indoor"
                handlePress={() => router.push('/indoor')}
                containerStyles=" bg-icol "
              />
               <CustomButton
                title="Give me random questions"
                handlePress={() => router.push('/random')}
                containerStyles=" bg-rcol "
              />
              <CustomButton
                title="Art"
                handlePress={() => router.push('/art')}
                containerStyles=" bg-acol "
              />
              
           
        
        
            </View>
    
        
           
          </ScrollView>
          
          
        </SafeAreaView>
        
        </LinearGradient>
      
    )
}

export default testIndex