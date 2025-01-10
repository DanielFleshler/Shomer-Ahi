import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserContext } from './UserContext';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { writeUserLocationToDB } from '../firebase/firebaseFunctions';
import * as Location from 'expo-location';

export default function HomePage() {
   const { userData } = useContext(UserContext);
   const [userLocation, setUserLocation] = useState([]);
   const [errorMsg, setErrorMsg] = useState(null);

   useEffect(() => {
       let locationSubscription;

       (async () => {
           let { status } = await Location.requestForegroundPermissionsAsync();
           if (status !== 'granted') {
               setErrorMsg('Permission denied');
               return;
           }

           // Get initial location
           let initialLocation = await Location.getCurrentPositionAsync({});
           setUserLocation([
               initialLocation.coords.latitude,
               initialLocation.coords.longitude
           ]);

           // Watch for location updates
           locationSubscription = await Location.watchPositionAsync(
               {
                   accuracy: Location.Accuracy.High,
                   timeInterval: 5000,
                   distanceInterval: 5,
               },
               (location) => {
                   setUserLocation([
                       location.coords.latitude,
                       location.coords.longitude
                   ]);
                   writeUserLocationToDB(userData.phoneNumber, location.coords.latitude, location.coords.longitude);
               }
           );
       })();

       return () => {
           if (locationSubscription) {
               locationSubscription.remove();
           }
       };
   }, []);

   return (
       <View style={styles.container}>
           <Text>Welcome {userData.firstName}!</Text>
           {errorMsg && <Text>{errorMsg}</Text>}
           <MapView 
               style={styles.map}
               region={{
                   latitude: userLocation[0],
                   longitude: userLocation[1],
                   latitudeDelta: 0.0922,
                   longitudeDelta: 0.0421,
               }}
           >
               <UrlTile
                   urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                   maximumZ={19}
                   flipY={false}
               />
               <Marker
                   coordinate={{
                       latitude: userLocation[0],
                       longitude: userLocation[1]
                   }}
               />
           </MapView>
       </View>
   );
}

const styles = StyleSheet.create({
   container: {
       flex: 1,
   },
   map: {
       width: '100%',
       height: '90%',
   },
});