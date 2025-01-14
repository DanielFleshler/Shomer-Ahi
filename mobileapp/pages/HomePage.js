import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Platform,
  I18nManager,
  Image,
} from "react-native";
import { UserContext } from "./UserContext";
import ProfileModal from "./ProfileModal";
import MapView, { UrlTile, Marker, Polyline } from "react-native-maps";
import {
  writeUserLocationToDB,
  eventLocationListner,
} from "../firebase/firebaseFunctions";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import _ from 'lodash';

I18nManager.forceRTL(true);

const getRouting = async (userLoc, eventLoc) => {
  try {
    const url = `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${userLoc[1]},${userLoc[0]};${eventLoc[1]},${eventLoc[0]}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    const data = await response.json();

    if (
      data.code === "Ok" &&
      data.routes &&
      data.routes[0] &&
      data.routes[0].geometry
    ) {
      return data.routes[0].geometry.coordinates.map((coord) => ({
        latitude: coord[1],
        longitude: coord[0],
      }));
    }
    console.error("Invalid routing data received:", data);
    return [];
  } catch (error) {
    console.error("Error fetching routing data:", error);
    return [];
  }
};

export default function HomePage() {
  const { userData } = useContext(UserContext);
  const [userLocation, setUserLocation] = useState([]);
  const [eventLocation, setEventLocation] = useState([]);
  const [routingData, setRoutingData] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const mapRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    let locationSubscription;

    const setupLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("נדרשת גישה למיקום כדי להציג את מיקומך");
          return;
        }

        let initialLocation = await Location.getCurrentPositionAsync({});
        const newLocation = [
          initialLocation.coords.latitude,
          initialLocation.coords.longitude,
        ];
        setUserLocation(newLocation);

        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 10000,
            distanceInterval: 10,
          },
          (location) => {
            const newLoc = [
              location.coords.latitude,
              location.coords.longitude,
            ];
            setUserLocation(newLoc);
            writeUserLocationToDB(
              userData.phoneNumber,
              location.coords.latitude,
              location.coords.longitude
            );
          }
        );
      } catch (error) {
        setErrorMsg("Error getting location: " + error.message);
      }
    };

    const unsubscribe = eventLocationListner(
      userData.phoneNumber,
      (locationData) => {
        // Update state based on the location data
        setEventLocation(locationData || []);
        // Clear routing data if event location is cleared
        if (!locationData || locationData.length === 0) {
          setRoutingData([]);
        }
      }
    );

    setupLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userData.phoneNumber]);

  useEffect(() => {
    if (isInitialMount.current && userLocation.length > 0 && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation[0],
        longitude: userLocation[1],
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      isInitialMount.current = false;
    }
  }, [userLocation]);

  useEffect(() => {
    const updateRouting = async () => {
      // Only update routing if both locations are valid
      if (
        userLocation.length === 2 && 
        eventLocation.length === 2 && 
        eventLocation[0] !== 0 && 
        eventLocation[1] !== 0
      ) {
        const coordinates = await getRouting(userLocation, eventLocation);
        if (coordinates.length > 0) {
          setRoutingData(coordinates);

          const bounds = {
            latitude: (userLocation[0] + eventLocation[0]) / 2,
            longitude: (userLocation[1] + eventLocation[1]) / 2,
            latitudeDelta: Math.abs(userLocation[0] - eventLocation[0]) * 1.5,
            longitudeDelta: Math.abs(userLocation[1] - eventLocation[1]) * 1.5,
          };
          setTimeout(() => {
            mapRef.current?.animateToRegion(bounds, 1000);
          }, 2000);
        }
      } else {
        // Clear routing data if either location is invalid
        setRoutingData([]);
      }
    };
    updateRouting();
  }, [userLocation, eventLocation]);

  const handleProfilePress = () => {
    setIsProfileModalVisible(true);
  };

  const centerOnUser = () => {
    if (userLocation.length === 2) {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation[0],
          longitude: userLocation[1],
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  const EventMarker = useMemo(() => {
    if (
      eventLocation.length === 2 && 
      eventLocation[0] !== 0 && 
      eventLocation[1] !== 0
    ) {
      return (
        <Marker
          coordinate={{
            latitude: eventLocation[0],
            longitude: eventLocation[1],
          }}
        >
          <Image
            source={require("../assets/terrorist.png")}
            style={{ width: 55, height: 55 }}
            resizeMode="contain"
          />
        </Marker>
      );
    }
    return null;
  }, [eventLocation]);

  const RoutePolyline = useMemo(() => {
    if (
      routingData.length > 0 && 
      eventLocation.length === 2 && 
      eventLocation[0] !== 0 && 
      eventLocation[1] !== 0
    ) {
      return (
        <Polyline
          coordinates={routingData}
          strokeColor="#000"
          strokeColors={["#2E5077"]}
          strokeWidth={6}
        />
      );
    }
    return null;
  }, [routingData, eventLocation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.greeting}>ברוך הבא,</Text>
            <Text style={styles.userName}>{userData.firstName}!</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfilePress}
          >
            <Ionicons name="person-circle-outline" size={32} color="#3498DB" />
          </TouchableOpacity>
        </View>
        {errorMsg && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={20} color="#E74C3C" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}
      </View>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          <UrlTile
            urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
          />
          {EventMarker}
          {RoutePolyline}
        </MapView>
        <TouchableOpacity style={styles.centerButton} onPress={centerOnUser}>
          <Ionicons name="locate-outline" size={24} color="#3498DB" />
        </TouchableOpacity>
      </View>
      <ProfileModal
        visible={isProfileModalVisible}
        onClose={() => setIsProfileModalVisible(false)}
        userData={userData}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  headerContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: 16,
    color: "#7F8C8D",
    fontWeight: "400",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C3E50",
    marginTop: 4,
  },
  profileButton: {
    padding: 8,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FADBD8",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  errorText: {
    color: "#E74C3C",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    textAlign: "right",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
    width: "100%",
    userLocationAnnotationFill: "#3498DB",
    userLocationAnnotationStroke: "#FFFFFF",
    userLocationAnnotationSize: 8,
  },
  centerButton: {
    position: "absolute",
    bottom: 24,
    left: 24,
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});