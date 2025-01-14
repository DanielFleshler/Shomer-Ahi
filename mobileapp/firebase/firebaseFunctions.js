
import {auth,db} from './config';
import {User} from './User';
import {signInWithEmailAndPassword,createUserWithEmailAndPassword} from "firebase/auth";
import { child, get, ref, set, update, onValue, off } from "firebase/database";



function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            return readUserData(userCredential._tokenResponse.email)
                .then((userData) => {
                    console.log("User data:", userData);
                    if (!userData || userData.isUserValid === false) {
                        console.log("User is not valid");
                        return false;
                    }
                    return userData;
                });
        })
        .catch((error) => {
            console.error("Error logging in:", error.message);
            return false;
        });
}
function registerUser(email, password, userData) {
    return createUserWithEmailAndPassword(auth, email, password)
       .then((userCredential) => {
           console.log("User data:", userData);
           writeUserData(userData);
           const user = userCredential.user;
           console.log("Registration successful:", user);
           return true;
       })
       .catch((error) => {
           console.error("Error registering:", error.message);
           return false;
       });
}
function writeUserData(userData) {
    set(ref(db, 'users/' + userData.phoneNumber), {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        licenseNumber: userData.licenseNumber,
        isUserValid: false
    });
    set(ref(db, 'usersLocation/' + userData.phoneNumber), {
        latitude: 0,
        longitude: 0,
        eventlatitude: 0,
        eventlongitude: 0
    });
  }
  function readUserData(userEmail) {
    return get(ref(db, `users/`))
        .then((snapshot) => {
            let foundUser = null;
            snapshot.forEach((childSnapshot) => {
                console.log("user email:", userEmail);
                console.log("childSnapshot:", childSnapshot.val().email);
                if (childSnapshot.val().email === userEmail) {
                    foundUser = new User(
                        childSnapshot.val().email,
                        childSnapshot.val().firstName,
                        childSnapshot.val().lastName,
                        childSnapshot.val().phoneNumber,
                        childSnapshot.val().licenseNumber,
                        childSnapshot.val().licensePhoto,
                        childSnapshot.val().isUserValid
                    );
                }
            });
            console.log("Found user:", foundUser);
            return foundUser;
        })
        .catch((error) => {
            console.error("Error in readUserData:", error);
            return null;
        });
}
function readUserLocation(phoneNumber){
    return get(ref(db, `usersLocation/`))
    .then((snapshot) => {
      let userLocation = null;
      snapshot.forEach((childSnapshot) => {
        if(childSnapshot.key === phoneNumber){
            userLocation = [childSnapshot.val().latitude,childSnapshot.val().longitude];
        }
      });
        return userLocation;
    })
    .catch((error) => {
      console.error("Error in readUserLocation:", error);
      return [];
    });
  }
function writeUserLocationToDB(phoneNumber, latitude, longitude) {
        const updates = {};
        updates['/latitude'] = latitude;
        updates['/longitude'] = longitude;
        update(ref(db,'usersLocation/' + phoneNumber), updates);
}
function eventLocationListner(phoneNumber, onLocationUpdate) {
    const eventL = ref(db, 'usersLocation/' + phoneNumber + '/eventlatitude');
    onValue(eventL, (snapshot) => {
        const eventLat = snapshot.val();
        console.log('Firebase eventlatitude received:', eventLat);
        
        get(ref(db, 'usersLocation/' + phoneNumber + '/eventlongitude')).then((longitudeSnapshot) => {
            const eventLong = longitudeSnapshot.val();
            if (eventLat != '0' && eventLong != '0') {
                const locationData = [parseFloat(eventLat), parseFloat(eventLong)];
                onLocationUpdate(locationData);
            }
        });
    });

    return () => off(ref(db, 'usersLocation/' + phoneNumber + '/eventlatitude'));
}
export {loginUser,registerUser,writeUserData,readUserLocation,writeUserLocationToDB,eventLocationListner}

