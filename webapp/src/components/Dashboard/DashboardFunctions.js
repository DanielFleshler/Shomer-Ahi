import {
  readUserData,
  deleteUserInDB,
  readUserLocation,
} from "../../firebase/FirebaseFunctions";
import { validateUser } from "../../firebase/FirebaseFunctions";
export const handleSearchLocation = async (location, setMapCenter = null) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      location
    )}&format=json&addressdetails=1&limit=1`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    if (data.length > 0) {
      console.log("Location fetched:", data[0].lat, data[0].lon);
      if (setMapCenter) {
        setMapCenter([data[0].lat, data[0].lon]);
      }
      return { latitude: data[0].lat, longitude: data[0].lon };
    }
  } catch (error) {
    console.error("Error fetching location:", error);
  }
};

export const handleUsers = async (setUserData, setShowModal) => {
  const users = await readUserData();
  setUserData(users);
  setShowModal(true);
};

export const handleApprove = (userPhoneNumber, userData, setUserData) => {
  const user = userData.find((user) => user.phoneNumber === userPhoneNumber);
  user.validateUser();
  validateUser(userPhoneNumber);
  const updatedUserData = userData.filter(
    (user) => user.phoneNumber !== userPhoneNumber
  );
  setUserData(updatedUserData);
};

export const handleReject = (
  userPhoneNumber,
  userEmail,
  userData,
  setUserData
) => {
  const updatedUserData = userData.filter(
    (user) => user.phoneNumber !== userPhoneNumber
  );
  setUserData(updatedUserData);
  deleteUserInDB(userPhoneNumber, userEmail);
};

export const handleUserLocation = async (setUsersLocations) => {
  try {
    const users = await readUserData(true);
    const locations = await readUserLocation();
    
    const mergedData = users.map(user => ({
      ...user,
      ...locations.find(loc => loc.phoneNumber === user.phoneNumber) || {}
    }));

    setUsersLocations(mergedData);
  } catch (error) {
    console.error("Error fetching user locations and data:", error);
  }
};
