import "../../global.css";
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen name="Home" />
      <Stack.Screen name="Onboarding" />
      <Stack.Screen name="CameraScreen"/>
      <Stack.Screen name="Map"/>
    </Stack>
  )
}

export default _layout