import { View, Text, Dimensions, StyleSheet, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';



const Onboarding_screen = () => {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} className='bg-white flex-1'>
            <Onboarding
            onDone={()=>router.push("./Home")}
            onSkip={()=>router.push("./Home")}
            titleStyles={{color:"black",fontWeight:'bold'}}
            subTitleStyles={{color:"white",fontWeight:'bold'}}
                pages={[
                    {
                        backgroundColor: '#DAC098',
                        image: <LottieView style={{width:Dimensions.get("screen").width,height:Dimensions.get("screen").width*0.9}} source={require('../../assets/Onboarding_animations/Animation - 3.json')} autoPlay loop />,
                        title: 'Lost Something',
                        subtitle: 'You are on the right place to find',
                    },
                    {
                        backgroundColor: '#DAC098',
                        image: <LottieView style={{width:Dimensions.get("screen").width,height:Dimensions.get("screen").width*0.9}} source={require('../../assets/Onboarding_animations/Animation.json')} autoPlay loop />,
                        title: 'Sit & Find Easily',
                        subtitle: 'Easily Find Your Lost Item Just By scrolling and obzervation',
                    },
                    {
                        backgroundColor: '#DAC098',
                        image: <LottieView style={{width:Dimensions.get("screen").width,height:Dimensions.get("screen").width*0.9}} source={require('../../assets/Onboarding_animations/Animation - 4.json')} autoPlay loop />,
                        title: 'Search Easily',
                        subtitle: 'Easily Search & Navigate To Your Item Which is Lost',
                    },
                    {
                        backgroundColor: '#DAC098',
                        image: <LottieView style={{width:Dimensions.get("screen").width,height:Dimensions.get("screen").width*0.9}} source={require('../../assets/Onboarding_animations/Animation - 2.json')} autoPlay loop />,
                        title: 'Reach Or Share Location',
                        subtitle: 'Reach The Location of Your Item Which is Lost or share the location and details of item if you find anywhere',
                    },
                ]}
            />
        </Animated.View>
    )
}


export default Onboarding_screen