import { View , Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import logo from "../assets/ok3.jpeg"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Redirect, router } from 'expo-router'
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated'
import { SignedIn, SignedOut , useUser  } from '@clerk/clerk-expo'


const index = () => {
  const { user } = useUser()
  return (
    <Animated.View entering={FadeIn} exiting={SlideInDown} className="flex-1">
      <SignedIn>
        <Redirect href={'../(screens)/Home'} />
      </SignedIn>
      <SignedOut>
      <Image source={logo} style={{width:Dimensions.get("screen").width,height:Dimensions.get("screen").height,objectFit:"center"}}/>
      <TouchableOpacity activeOpacity={0.5} onPress={()=>router.push("./(auth)/Signin")} className='bg-black blur-lg w-[70%] absolute bottom-[3%] ml-[17%] rounded-xl p-2 flex-row border-4 items-center justify-center border-black elevation-sm focus:border-blue-600'>
        <Text className='text-[#DAC098] text-center text-5xl font-bold border-white'>{'>>>>>>>'}{' '}</Text>
        <MaterialCommunityIcons name="magnify-expand" size={36} color="white" />
      </TouchableOpacity>
      </SignedOut>
    </Animated.View>
  )
}

export default index