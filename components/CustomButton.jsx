import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'


const CustomButton = (props) => {
  return (
    <View className='w-full items-center mt-4 gap-1'>
            <TouchableOpacity className='w-[50%] bg-black rounded-xl py-2 items-center justify-center border focus:border-blue-600' onPress={props.hpress}>
              <Text className='text-white font-bold text-2xl'>{props.label}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={props.hpress2}>
              <Text className='text-blue-600 underline'>{props.label2}</Text>
            </TouchableOpacity>
            </View>
  )
}

export default CustomButton