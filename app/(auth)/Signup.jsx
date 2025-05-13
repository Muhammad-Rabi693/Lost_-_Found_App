import { View, Text, Image, Dimensions, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native'
import React from 'react'
import logo from "../../assets/ok3.jpeg"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import CustomInputField from '../../components/CustomInputField'
import CustomButton from '../../components/CustomButton'
import { router, useRouter } from 'expo-router'
import Animated, { FadeOut, SlideInLeft, SlideInRight } from 'react-native-reanimated'
import { useSignUp } from '@clerk/clerk-expo'


const Signup = () => {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [first_name, setfirstname] = React.useState('')
  const [last_name, setlastname] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
        username,
        public_metadata: {
          first_name,
          last_name,
        },
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      const errorMessage = "Check Email or Your Password May Be Weak...!";
      Alert.alert("Authentication Error", errorMessage);
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('../(screens)/Onboarding')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      const errorMessage = "Recheck your Verification Code...!";
      Alert.alert("Verification Error", errorMessage);
    }
  }
  return (
    <Animated.View entering={SlideInRight} exiting={FadeOut} className='flex-1'>
      <Image source={logo} blurRadius={70} style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height, objectFit: "cover" }} />
      <View className="items-center w-full h-full justify-center absolute bottom-[0.5%]">
        <View className='border-4 border-black  p-4 w-[85%] h-[80%]  rounded-xl overflow-hidden'>
          {pendingVerification && (
            <>
              <View className="items-center justify-center"></View>
              <CustomInputField
                wid="w-full"
                label="Verify your email"
                value={code}
                placeholder="Enter your verification code"
                onChangeText={(code) => setCode(code)}
              />
              <CustomButton label="Verify" label2="Do you entered wrong email?" hpress={onVerifyPress} hpress2={() => router.back()} />
            </>
          )}
          {!pendingVerification && (
            <>
              <ScrollView>
                <View className='flex-row items-center justify-center mt-4'>
                  <MaterialCommunityIcons name="magnify-expand" size={30} color="black" />
                  <Text className='text-3xl font-bold ml-2'>Sign-up</Text>
                </View>
                <View className="mt-6 gap-1 item-center justify-center">
                  <View className='w-full flex-row item-center justify-center'>
                    <CustomInputField wid="30%" label="First Name" placeholder='First Name' value={first_name} onChangeText={(first_name) => setfirstname(first_name)} />
                    <CustomInputField wid="30%" label="Last Name" placeholder='Last Name' value={last_name} onChangeText={(last_name) => setlastname(last_name)} />
                  </View>
                  <CustomInputField wid="w-full" label="Username" placeholder='Enter Your Username' value={username} onChangeText={(username) => setUsername(username)} />
                  <CustomInputField wid="w-full" label="Email" placeholder='Enter Your Email' value={emailAddress} onChangeText={(emailAddress) => setEmailAddress(emailAddress)} />
                  <CustomInputField wid="w-full" label="Password" placeholder='Enter Your Password' value={password} onChangeText={(password) => setPassword(password)} />
                  <CustomButton label='Sign-up' label2='Log-in instead?' hpress={onSignUpPress} hpress2={() => router.push("./Signin")} />
                </View>
              </ScrollView>
            </>
          )}
        </View>

      </View>
    </Animated.View>
  )
}

export default Signup