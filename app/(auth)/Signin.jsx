import { View, Text, Image, Dimensions, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native'
import React from 'react'
import logo from "../../assets/ok3.jpeg"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import CustomInputField from '../../components/CustomInputField'
import CustomButton from '../../components/CustomButton'
import { router, useRouter } from 'expo-router'
import Animated, { SlideInDown, SlideInLeft, SlideInRight, SlideInUp } from 'react-native-reanimated'
import { useSignIn } from '@clerk/clerk-expo'


const Signin = () => {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [Username, setusername] = React.useState('')
  const [password, setPassword] = React.useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: Username,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("../(screens)/Home");
      } else {
        // If the status isn't complete, show why in an alert.
        Alert.alert(
          "Sign-In Incomplete",
          `Status: ${signInAttempt.status}\nDetails: ${JSON.stringify(signInAttempt, null, 2)}`
        );
      }
    } catch (err) {
      // Handle Clerk errors and show the long_message in an alert.
      const errorMessage ="Your Email or Password May Be Incorrect...!";
      Alert.alert("Authentication Error", errorMessage);
    }
  }, [isLoaded, Username, password])
  return (
    <Animated.View entering={SlideInRight} exiting={SlideInRight} className='flex-1'>
      <Image source={logo} blurRadius={70} style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height, objectFit: "cover" }} />
      <View className="items-center w-full h-full justify-center absolute bottom-[1%]">
        <View className='border-4 border-black  p-4 w-[85%] h-[70%]  rounded-xl overflow-hidden'>
          <ScrollView>
            <View className='flex-row items-center justify-center mt-7'>
              <MaterialCommunityIcons name="magnify-expand" size={30} color="black" />
              <Text className='text-3xl font-bold ml-2'>Sign-in</Text>
            </View>
            <View className="mt-12">
              <CustomInputField wid="w-full" label="Email / Username" placeholder='Enter Your Username' value={Username} onChangeText={(Username) => setusername(Username)}
              />
              <CustomInputField wid="w-full" label="Password" placeholder='Enter Your Password' value={password} onChangeText={(password) => setPassword(password)}
              />
              <CustomButton label='Login' label2='Create New Account' hpress={onSignInPress} hpress2={() => router.push("./Signup")} />

            </View>
          </ScrollView>
        </View>

      </View>
    </Animated.View>
  )
}

export default Signin