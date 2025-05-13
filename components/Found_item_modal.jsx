import { Entypo, MaterialIcons } from "@expo/vector-icons";
import React, { useState, useRef } from "react";
import * as ImagePicker from 'expo-image-picker';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Image,
} from "react-native";
import Camera_int from "./Cameraint";
import { router } from "expo-router";
import C_App from "../app/(screens)/CameraScreen";
import { Picker } from "@react-native-picker/picker";

const FoundItemModal = ({ visible, onClose, onSubmit }) => {
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
      aspect: [1, 1],
      quality: 1, // Maximum image quality
    });

    if (!result.cancelled) {
      await saveImage(result.assets[0].uri) // Set the captured image URI

    }
  }
  const saveImage = async (image) => {
    setImage(image);
    handleChange("uri", image)
  }
  const slideAnim = useRef(new Animated.Value(500)).current; // Start off-screen

  // Slide-up animation effect
  const handleOpen = () => {
    Animated.timing(slideAnim, {
      toValue: 0, // Slide into view
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const pickImage = async () => {
    // Ask for permission to access the gallery
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your gallery to pick an image.');
      return;
    }

    // Open the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      await saveImage(result.assets[0].uri) // Set the captured image URI

    }
  };

  const handleClose = () => {
      setImage();
      setFormData("");
      Animated.timing(slideAnim, {
        toValue: 500, // Slide out of view
        duration: 200,
        useNativeDriver: true,
      }).start(() => onClose());
    };

  // Form state
  const [formData, setFormData] = useState({
    contact: "",
    itemName: "",
    category: "Not Specified",
    uri: "",
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onShow={handleOpen}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
          <ScrollView>
            <View className="flex-row items-center justify-center mb-7">
              <TouchableOpacity onPress={handleClose}><Entypo name="squared-cross" size={30} color="red" /></TouchableOpacity>
              <Text className='flex-grow' style={styles.title}>Report Found Item</Text>
            </View>

            {/* Form Fields */}
            <View className="mb-2">
              <Text className="text-black text-lg font-bold mb-2 ml-1">
                <Text className='text-red-500'>*</Text>
                Item Name:
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Item Name (e.g., Black Laptop)"
                value={formData.itemName}
                onChangeText={(text) => handleChange("itemName", text)}
              />
            </View>

            <View className="mb-2">
              <Text className="text-black text-lg font-bold mb-2 ml-1">
                <Text className='text-red-500'>*</Text>
                Contact Number:
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Contact Number"
                keyboardType="phone-pad"
                value={formData.contact}
                onChangeText={(text) => handleChange("contact", text)}
              />
            </View>

            <View className="mb-2">
              <Text className="text-black text-lg font-bold mb-2 ml-1">
                <Text className='text-red-500'>*</Text>
                Categories:
              </Text>
              <View style={styles.picker}>
                <Picker
                  className="border-black"
                  selectedValue={formData.category}
                  onValueChange={(itemValue, itemIndex) =>
                    handleChange(itemIndex, itemValue)
                  }>
                  <Picker.Item label="Not Specified" value="not-specified" />
                  <Picker.Item label="Electronics" value="Electronics" />
                  <Picker.Item label="Bottles" value="Bottles" />
                  <Picker.Item label="Keys" value="Keys" />
                  <Picker.Item label="Documents" value="Documents" />
                  <Picker.Item label="Accessories" value="Accessories" />
                  <Picker.Item label="Others" value="Others" />
                </Picker>
              </View>
            </View>

            {/* <TextInput
                    style={styles.input}
                    placeholder="Date of Loss (e.g., 2024-12-01)"
                    value={formData.dateOfLoss}
                    onChangeText={(text) => handleChange("dateOfLoss", text)}
                  /> */}
            <Text className="text-black text-center text-lg font-bold mb-2 ml-1">
              <Text className='text-red-500'>*</Text>
              Capture/Upload Image:
            </Text>
            <View className="w-full items-center">
              <View className="flex-row gap-7">
                <TouchableOpacity activeOpacity={0.5} onPress={openCamera}>
                  <Entypo name="camera" size={50} color="black" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={pickImage}>
                  <MaterialIcons name="perm-media" size={50} color="black" />
                </TouchableOpacity>
              </View>
              {image && (
                <View style={styles.imageContainer}>
                  <Text style={styles.imageLabel}>Captured Image:</Text>
                  <Image source={{ uri: image }} style={styles.image} />
                  <TouchableOpacity onPress={() => handleChange("uri", image)} className
                    ="bg-black w-[30%] rounded-xl mt-4"><Text className="text-xl text-center text-[#DAC098]">Upload Image</Text></TouchableOpacity>
                </View>
                // handleChange("uri",image)
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                onSubmit(formData);
                setFormData("");
                setImage();
                handleClose();
              }}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "black"
  },
  input: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  picker: {
    placeholder: "black",
    borderWidth: 2,
    alignItems: 'stretch',
    borderColor: "black",
    borderRadius: 8,

  },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#DAC098",
    fontWeight: "bold",
  },
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

export default FoundItemModal;
