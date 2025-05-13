import { View, Text, TextInput, TextInputProps } from 'react-native'
import React from 'react'


const CustomInputField = (props) => {
    return (
        <View className="mb-4 px-4">
            <Text className="text-black text-lg font-bold mb-2 ml-1">
              <Text className='text-red-500'>*</Text>
              {props.label}:
            </Text>
            <View className={`${props.wid} h-12 border-2 border-black rounded-full overflow-hidden bg-transparent focus:border-blue-600`}>
              <TextInput
                className="flex-1 px-4 text-balance text-black overflow-hidden"
                secureTextEntry={props.label === "Password"}
                {...props}
              />
            </View>
        </View>
    )
}

export default CustomInputField