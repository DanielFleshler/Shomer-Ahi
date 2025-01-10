import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Platform } from 'react-native';
import { UserContext } from './UserContext';
import ProfileModal from './ProfileModal';
import MapView, {UrlTile, Circle } from 'react-native-maps';
import { writeUserLocationToDB } from '../firebase/firebaseFunctions';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

export default function HomePage() {
   const { userData } = useContext(UserContext);
   const [userLocation, setUserLocation] = useState([]);
   const [errorMsg, setErrorMsg] = useState(null);
   const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);


   useEffect(() => {
       let locationSubscription;

       (async () => {
           let { status } = await Location.requestForegroundPermissionsAsync();
           if (status !== 'granted') {
               setErrorMsg('Location access needed to show your position');
               return;
           }

           let initialLocation = await Location.getCurrentPositionAsync({});
           setUserLocation([
               initialLocation.coords.latitude,
               initialLocation.coords.longitude
           ]);

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
   const handleProfilePress = () => {
    setIsProfileModalVisible(true);
    };

   const centerOnUser = () => {
       if (userLocation.length > 0) {
           _mapView.animateToRegion({
               latitude: userLocation[0],
               longitude: userLocation[1],
               latitudeDelta: 0.01,
               longitudeDelta: 0.01,
           }, 1000);
       }
   };

   return (
    <SafeAreaView style={styles.container}>
    <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />
    <View style={styles.header}>
        <View style={styles.headerContent}>
            <TouchableOpacity 
                style={styles.profileButton}
                onPress={handleProfilePress}
            >
                <Ionicons name="person-circle-outline" size={32} color="#007AFF" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={styles.greeting}>ברוך הבא,</Text>
                <Text style={styles.userName}>{userData.firstName}!</Text>
            </View>
        </View>
        {errorMsg && (
            <View style={styles.errorContainer}>
                <Ionicons name="warning" size={20} color="#FF3B30" />
                <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
        )}
    </View>
           <View style={styles.mapContainer}>
               <MapView 
                   ref={(ref) => (_mapView = ref)}
                   style={styles.map}
                   showsUserLocation={true}
                   showsMyLocationButton={false}
                   showsCompass={true}
                   region={{
                       latitude: userLocation[0] || 0,
                       longitude: userLocation[1] || 0,
                       latitudeDelta: 0.0922,
                       longitudeDelta: 0.0421,
                   }}
               >
                   <UrlTile
                       urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                       maximumZ={19}
                       flipY={false}
                   />
                   {userLocation.length > 0 && (
                       <Circle
                           center={{
                               latitude: userLocation[0],
                               longitude: userLocation[1]
                           }}
                           radius={10}
                           fillColor="rgba(0, 122, 255, 0.2)"
                           strokeColor="rgba(0, 122, 255, 0.9)"
                           strokeWidth={2}
                       />
                   )}
               </MapView>
               <TouchableOpacity style={styles.centerButton} onPress={centerOnUser}>
                   <Ionicons name="locate" size={24} color="#007AFF" />
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
       backgroundColor: '#FFFFFF',
   },
   header: {
       paddingHorizontal: 20,
       paddingVertical: 16,
       backgroundColor: '#FFFFFF',
       ...Platform.select({
           ios: {
               shadowColor: '#000',
               shadowOffset: { width: 0, height: 2 },
               shadowOpacity: 0.1,
               shadowRadius: 4,
           },
           android: {
               elevation: 4,
           },
       }),
   },
   headerContent: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'center',
   },
   greeting: {
       fontSize: 16,
       color: '#666',
       fontWeight: '400',
   },
   userName: {
       fontSize: 24,
       fontWeight: '700',
       color: '#333',
       marginTop: 4,
   },
   mapTypeButton: {
       padding: 8,
       borderRadius: 8,
       backgroundColor: '#F0F0F0',
   },
   errorContainer: {
       flexDirection: 'row',
       alignItems: 'center',
       backgroundColor: '#FFE5E5',
       padding: 12,
       borderRadius: 8,
       marginTop: 12,
   },
   errorText: {
       color: '#FF3B30',
       fontSize: 14,
       marginLeft: 8,
       flex: 1,
   },
   mapContainer: {
       flex: 1,
       position: 'relative',
   },
   map: {
       flex: 1,
       width: '100%',
   },
   centerButton: {
       position: 'absolute',
       bottom: 24,
       right: 24,
       backgroundColor: '#FFFFFF',
       padding: 12,
       borderRadius: 30,
       ...Platform.select({
           ios: {
               shadowColor: '#000',
               shadowOffset: { width: 0, height: 2 },
               shadowOpacity: 0.25,
               shadowRadius: 4,
           },
           android: {
               elevation: 4,
           },
       }),
   },
});