import React, { useState, useEffect } from "react";
import { Text,View, StyleSheet, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const ShowMap = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Fetch the user's location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01, // Adjust zoom level
        longitudeDelta: 0.01, // Adjust zoom level
      });
    })();
  }, []);

  if (!location) {
    return <View style={styles.container}><Text>Loading Map...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={location}
        showsUserLocation={true} // Show the user's current location
      >
        <Marker
          coordinate={location}
          title="You are here"
          description={`Lat: ${location.latitude}, Lon: ${location.longitude}`}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default ShowMap;
