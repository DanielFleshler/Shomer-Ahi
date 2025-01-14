import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import UpdateMapView from '../Map/MapView';
import Sidebar from '../Sidebar/Sidebar';
import UserApprovalModal from '../Modals/UserApprovalModal';
import CreateEventModal from '../Modals/CreateEventModal';
import { handleSearchLocation, handleUsers, handleApprove, handleReject, handleUserLocation} from './DashboardFunctions';
import 'leaflet/dist/leaflet.css';
import '../../styles/layout/Dashboard.css';
import { writeEventLocation } from '../../firebase/FirebaseFunctions';

function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [userData, setUserData] = useState([]);
  const [location, setLocation] = useState("");
  const [usersLocations, setUsersLocations] = useState([]);
  const [mapCenter, setMapCenter] = useState([31.334, 35.068]);
  const [CreateEvent, setCreateEvent] = useState(false);

  const onClickShowUsersLocation = (e) => {
    e.preventDefault();
    handleUserLocation(setUsersLocations);
    console.log("Users Location:", usersLocations);
  };

  const onClickUsers = (e) => {
    e.preventDefault();
    handleUsers(setUserData, setShowModal);
  };

  const onClickSearchLocation = async (e) => {
    e.preventDefault();
    try {
      await handleSearchLocation(location, setMapCenter);
      setShowCreateEventModal(true);
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  const onClickApprove = (userPhoneNumber) => {
    handleApprove(userPhoneNumber, userData, setUserData);
  };

  const onClickReject = (userPhoneNumber, userEmail) => {
    handleReject(userPhoneNumber, userEmail, userData, setUserData);
  };

  const handleCreateEventResponse = (createEvent) => {
    setShowCreateEventModal(false);
    if(createEvent){
      console.log("Event location:",mapCenter);
      writeEventLocation(mapCenter[0], mapCenter[1]);
    }
    setCreateEvent(createEvent);
  };

  return (
    <div className="dashboard">
      <Sidebar 
        location={location}
        setLocation={setLocation}
        onClickSearchLocation={onClickSearchLocation}
        onClickUsers={onClickUsers}
        onClickShowUsersLocation={onClickShowUsersLocation}
      />

      {showCreateEventModal && (
        <CreateEventModal 
          onClose={() => setShowCreateEventModal(false)}
          onConfirm={handleCreateEventResponse}
        />
      )}

      {showModal && (
        <UserApprovalModal 
          show={showModal}
          onClose={() => setShowModal(false)}
          userData={userData}
          onApprove={onClickApprove}
          onReject={onClickReject}
        />
      )}

      <div className="map-container">
        <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <UpdateMapView
            center={mapCenter}
            usersLocations={usersLocations}
            CreateEvent={CreateEvent}
            eventLocation={mapCenter}
          />
        </MapContainer>
      </div>
    </div>
  );
}
export default Dashboard;