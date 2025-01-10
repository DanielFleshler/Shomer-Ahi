import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import '../../styles/components/MapView.css';
import '../../styles/components/Markers.css';
import "leaflet/dist/leaflet.css";

const UpdateMapView = ({ center, usersLocations, CreateEvent }) => {
    const map = useMap();
    const userMarkers = useRef({});
    const eventMarker = useRef(null);
  
    useEffect(() => {
      if (map && center) {
        map.setView(center, 7.6);
  
  
        if (CreateEvent) {
          const eventPulsingIcon = L.divIcon({
            className: "event-pulsing-icon",
            html: '<div class="static-circle"><div class="pulse-circle"></div></div>',
            iconSize: [20, 20],
          });
  
          if (eventMarker.current) {
            eventMarker.current.setLatLng(center);
          } else {
            eventMarker.current = L.marker(center, { icon: eventPulsingIcon })
              .addTo(map);
          }
        } else if (eventMarker.current) {
          map.removeLayer(eventMarker.current);
          eventMarker.current = null;
        }
      }
  
      if (usersLocations.length > 0) {
        usersLocations.forEach((userLocation) => {
          const oldMarker = userMarkers.current[userLocation.phoneNumber];
          
          if (oldMarker) {
            oldMarker.setLatLng([userLocation.latitude, userLocation.longitude]);
          } else {
            const userPulsingIcon = L.divIcon({
              className: "user-pulsing-icon",
              html: '<div class="static-circle"><div class="pulse-circle"></div></div>',
              iconSize: [20, 20],
            });
  
            const newMarker = L.marker(
              [userLocation.latitude, userLocation.longitude],
              { icon: userPulsingIcon }
            )
            .bindPopup(
              `
              <div style="text-align: right;">
                שם פרטי: ${userLocation.firstName || 'N/A'}<br>
                שם משפחה: ${userLocation.lastName || 'N/A'}<br>
                מספר פלאפון: ${userLocation.phoneNumber}<br>
                <button>הזנק</button>
              </div>
              `
            )
              .addTo(map);
            newMarker.on("click", () => {
              map.setView([userLocation.latitude, userLocation.longitude], 17);
            });
            userMarkers.current[userLocation.phoneNumber] = newMarker;
          }
        });
      }
    }, [center, map, usersLocations, CreateEvent]);
  
    return null;
  };

export default UpdateMapView;