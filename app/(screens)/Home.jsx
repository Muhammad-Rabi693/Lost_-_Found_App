import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from "react-native";
import { AntDesign, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import * as Linking from 'expo-linking'
import { Picker } from '@react-native-picker/picker';
import LostItemModal from "../../components/Lost_item_modal";
import FoundItemModal from "../../components/Found_item_modal";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import {db} from '../../firebase.config';
import { doc, deleteDoc } from "firebase/firestore";
import ShowMap from "./Map";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const LostAndFound = () => {
  const [lostmodalVisible, setlostModalVisible] = useState(false);
  const [foundmodalVisible, setfoundModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Not Specified");
  const [alldata, setalldata] = useState();
  const { user } = useUser()
  const { signOut } = useClerk()
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [currentLocation, setCurrentLocation] = useState("Fetching...");
  const [catactive, setcatactive] = useState(false);
  const [currentcat, setcurrentcat] = useState("");

  const handleDelete = async (id, collectionName,key) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      if (collectionName === "lostItems") {
        setLostItems((prevItems) => prevItems.filter((item) => item.id !== id));
      } else {
        setFoundItems((prevItems) => prevItems.filter((item) => item.id !== id));
      }
      if(key==1){
        Alert.alert("Success", "Item deleted successfully!");
      }
      if(key==3){
        Alert.alert("Item Recovered", "Recovered item remove successfully!");
      }
      else{
        Alert.alert("Person Reached", "Reached item Remove successfully!");

      }
    } catch (error) {
      console.error("Error deleting item: ", error);
      Alert.alert("Error", "Could not delete the item.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut()
      // Redirect to your desired page
      Linking.openURL(Linking.createURL('../'))
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const categories = [
    { id: "1", icon: "mobile-screen", name: "Electronics" },
    { id: "2", icon: "bottle-water", name: "Bottles" },
    { id: "3", icon: "key", name: "Keys" },
    { id: "4", icon: "folder", name: "Documents" },
    { id: "5", icon: "headphones", name: "Accessories" },
    { id: "6", icon: "glasses", name: "others" },
  ];


  const renderCategory = ({ item }) => (
    <TouchableOpacity activeOpacity={0.5} style={styles.categoryItem} onPress={handlecatpress(item.name)}>
      <FontAwesome6 name={item.icon} size={24} color="black" />
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );
  // Function to get location
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setCurrentLocation("Permission Denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setCurrentLocation(
      `Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}`
    );
  };

  // Call getLocation on component mount
  const goToScreenB = (location) => {
    router.push({
      pathname: './Map',
      params: {location}, // Passing parameters
    });
  };

  // Call getLocation on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const lostQuerySnapshot = await getDocs(collection(db, "lostItems"));
        const foundQuerySnapshot = await getDocs(collection(db, "foundItems"));
  
        const fetchedLostItems = lostQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        const fetchedFoundItems = foundQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setLostItems(fetchedLostItems);
        setFoundItems(fetchedFoundItems);
      } catch (error) {
        console.error("Error fetching items: ", error);
      }
    };
    
    fetchItems();
    getLocation();
  }, []);

  const handlecatpress=(c_cat)=>{
    setcatactive(true);
    setcurrentcat(c_cat);

  }

  const handleSubmit = async (formData) => {
    const newItem = {
      title: formData.itemName,
      location: currentLocation, // Use the actual location
      phone: formData.contact,
      image: formData.uri,
      category: currentcat, // Optionally include the category
      timestamp: new Date().toISOString(), // Optional for sorting
    };
  
    try {
      if (Lactive) {
        await addDoc(collection(db, "lostItems"), newItem);
        setLostItems((prevItems) => [...prevItems, { id: Date.now().toString(), ...newItem }]);
      } else {
        await addDoc(collection(db, "foundItems"), newItem);
        setFoundItems((prevItems) => [...prevItems, { id: Date.now().toString(), ...newItem }]);
      }
      Alert.alert("Success", "Item added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("Error", "Could not add the item.");
    }
  };
  
  const renderFoundItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.foundItem}
      onPress={() => {
        if (item.phone) {
          Linking.openURL(`tel:${item.phone}`);
        } else {
          Alert.alert("No phone number available");
        }
      }}
      onLongPress={() =>
        Alert.alert(
          "Delete Item",
          "Are you sure you want to delete this item?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              onPress: () => handleDelete(item.id, "foundItems",1),
              style: "destructive",
            },
            {
              text: "Location",
              onPress: () => goToScreenB(item.location),
              style: "destructive",
            },
          ]
        )
      }
    >
      <Image source={{ uri: item.image }} style={styles.foundImage} />
      <View style={styles.foundDetails}>
        <Text style={styles.foundTitle}>{item.title}</Text>
        <Text style={styles.foundLocation}>{item.location}</Text>
        <Text style={styles.foundPostedBy}>PH:{item.phone}</Text>
      </View>
    </TouchableOpacity>
  );
  
  const renderLostItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.foundItem}
      onPress={() => {
        if (item.phone) {
          Linking.openURL(`tel:${item.phone}`);
        } else {
          Alert.alert("No phone number available");
        }
      }}
      onLongPress={() =>
        Alert.alert(
          "Delete Item",
          "Are you sure you want to delete this item?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              onPress: () => handleDelete(item.id, "lostItems", 1), // Corrected to "lostItems"
              style: "destructive",
            },
            {
              text: "Recovered",
              onPress: () => handleDelete(item.id, "lostItems", 3), // Corrected to "lostItems"
              style: "destructive",
            },
          ]
        )
      }
    >
      <Image source={{ uri: item.image }} style={styles.foundImage} />
      <View style={styles.foundDetails}>
        <Text style={styles.foundTitle}>{item.title}</Text>
        <Text style={styles.foundLocation}>{item.location}</Text>
        <Text style={styles.foundPostedBy}>PH:{item.phone}</Text>
      </View>
    </TouchableOpacity>
  );
  
  const [Factive, setFactive] = useState(false)
  const [Lactive, setLactive] = useState(true)
  const [tabing, settab] = useState(false)

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LOST AND FOUND</Text>
        {/* <AntDesign name="user" size={24} color="#4F8EF7" /> */}
        <TouchableOpacity className="items-center" onPress={handleSignOut}><FontAwesome name="sign-out" size={34} color="white" /></TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => { setLactive(true), setFactive(false), settab(false) }}><Text style={[Lactive ? styles.activeTab : styles.tab]}>Lost Items</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => { setLactive(false), setFactive(true), settab(true) }}><Text style={[Factive ? styles.activeTab : styles.tab]}>Found Items</Text></TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search For Items Here"
          style={styles.searchInput} />
        <TouchableOpacity><AntDesign name="search1" size={20} color="#ccc" style={styles.searchIcon} /></TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />
      </View>

      {/* Found Items */}
      <View className='flex-1' style={styles.section}>
        {Lactive && (
          <>
            <Text style={styles.sectionTitle}>Lost Items</Text>
            <FlatList
              data={lostItems}
              renderItem={renderLostItem}
              keyExtractor={(item) => item.id}
            />
          </>
        )}
        {Factive && (
          <>
            <Text style={styles.sectionTitle}>Found Items</Text>
            <FlatList
              data={foundItems}
              renderItem={renderFoundItem}
              keyExtractor={(item) => item.id}
            />
          </>
        )}
      </View>
      <LostItemModal
        visible={lostmodalVisible}
        onClose={() => setlostModalVisible(false)}
        onSubmit={handleSubmit}
      />
      <FoundItemModal
        visible={foundmodalVisible}
        onClose={() => setfoundModalVisible(false)}
        onSubmit={handleSubmit}
      />


      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => { tabing ? setfoundModalVisible(!foundmodalVisible) : setlostModalVisible(!lostmodalVisible) }}>
        <AntDesign name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#DAC098",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#DAC098",
    paddingVertical: 10,
  },
  tab: {
    fontSize: 17,
    color: "grey",
  },
  activeTab: {
    fontSize: 19,
    color: "black",
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    backgroundColor: "#DAC098",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 8,
    color: "black"
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 7,
  },
  categoriesContainer: {
    justifyContent: "space-between",
  },
  categoryItem: {
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#DAC098",
  },
  categoryText: {
    marginTop: 4,
    fontSize: 12,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  foundItem: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#DAC098",
    borderRadius: 8,
    marginVertical: 4,
  },
  foundImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  foundDetails: {
    marginLeft: 12,
    flex: 1,
    color: "black"
  },
  foundTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  foundLocation: {
    fontSize: 14,
    color: "black",
  },
  foundPostedBy: {
    fontSize: 12,
    color: "darkblue",
    fontWeight: "bold"
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "black",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LostAndFound;
