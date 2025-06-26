import { View, Text } from 'react-native'
import React from 'react'
import { Tabs, Redirect} from 'expo-router';
import {Image} from 'react-native';
import {icons} from '../../constants';

 

const TabIcon= ({ icon, color, name, focused}) => {
    return (
        <View className="items-center justify-center ">
            <Image 
            source={icon}
            resizeMode="contain"
            tintColor={color}
            className="w-6 h-6"
           // style={{ width: 25, height: 25}} //varianta alternativa in caz ca nu vreau clase tailwind

            />
            <Text className={`${focused ? 'font-ibold' : 'font-ilight'} text-s`} 
                style={{ color: color, textAlign: 'center', fontSize: 10, marginTop: 1}}
                numberOfLines= {name === "Messages" && !focused ? 1: 2} >
                {name}
            </Text>
        </View>
    )
}
const TabsLayout= () => {
  return (
    <>
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#1F85DE',
                tabBarInactiveTintColor: '#000000',
                tabBarStyle: {
                    backgroundColor: 'rgba(211, 211, 211, 0.4)',
                    height: 90,
                    position: 'absolute',
                    paddingBottom: 10, 
                    paddingTop: 10, 

                }, 
                

            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color, focused}) => (
                        <TabIcon
                        icon={icons.HomeIcon}
                        color={color}
                        name="Home"
                        focused={focused}
                        />

                    ),
                    
                 
                }}
                />
             <Tabs.Screen
                name="search" 
                options={{
                    title: 'Search',
                    headerShown: false,
                    tabBarIcon: ({ color, focused}) => (
                        <TabIcon
                        icon={icons.SearchIcon}
                        color={color}
                        name="Search"
                        focused={focused}
                        />

                    )
                }}
                
                />
             <Tabs.Screen
                name="notifications"
                options={{
                    title: 'Notifications',
                    headerShown: false,
                    tabBarIcon: ({ color, focused}) => (
                        <TabIcon
                        icon={icons.NotificationIcon}
                        color={color}
                        name="Messages"
                        focused={focused}
                        />

                    )
                }}
                />
             <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ color, focused}) => (
                        <TabIcon
                        icon={icons.ProfileIcon}
                        color={color}
                        name="Profile"
                        focused={focused}
                        />

                    )
                }}
                />
            
         </Tabs>
    </> 
  )
}

export default TabsLayout