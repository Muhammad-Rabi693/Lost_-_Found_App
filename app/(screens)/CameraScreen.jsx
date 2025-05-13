import React, { useState } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Entypo } from '@expo/vector-icons';
import { Redirect } from 'expo-router';

const C_App = () => {
    const [image, setImage] = useState();

    async function openCamera() {
        // Request permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            alert('Camera permission is required to use this feature.');
            return;
        }

        // Open the camera
        const result = await ImagePicker.launchCameraAsync({
            cameraType: ImagePicker.CameraType.back,
            allowsEditing: true, // Allow cropping
            aspect: [ 1 , 1 ],
            quality: 1, // Maximum image quality
        });

        if (!result.cancelled) {
            await saveImage(result.assets[0].uri) // Set the captured image URI
        }
    }
    const saveImage=async (image) =>{
        setImage(image);
    }

    return (
        <View className="w-full items-center">
            <TouchableOpacity activeOpacity={0.5} onPress={openCamera}>
                <Entypo name="camera" size={34} color="black" />
            </TouchableOpacity>
            {image && (
                <View style={styles.imageContainer}>
                    <Text style={styles.imageLabel}>Captured Image:</Text>
                    <Image source={{ uri: image }} style={styles.image} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    imageContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    imageLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    image: {
        width: 300,
        height: 400,
        borderRadius: 10,
    },
});

export default C_App;
