import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import vehicleIconImg from '../assets/icons/bus-tracker.png'; // adjust path

// Define custom marker icon
const vehicleIcon = new L.Icon({
  iconUrl: vehicleIconImg,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function MapView() {
  const [route, setRoute] = useState([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  // Load dummy route from JSON
  useEffect(() => {
    fetch('/dummy-route.json')
      .then(res => res.json())
      .then(data => {
        setRoute(data);
      });
  }, []);

  // Animate vehicle movement
  useEffect(() => {
    if (playing && route.length > 1) {
      intervalRef.current = setInterval(() => {
        setIndex(prev => {
          if (prev < route.length - 1) return prev + 1;
          clearInterval(intervalRef.current);
          return prev;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [playing, route]);

  if (!route.length) return <p>Loading map...</p>;

  const current = route[index];
  const currentPosition = [current.latitude, current.longitude];
  const tracePath = route.slice(0, index + 1).map(p => [p.latitude, p.longitude]);

  return (
    <>
      <MapContainer
        center={currentPosition}
        zoom={17}
        style={{ height: '80vh', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Trace Path */}
        <Polyline positions={tracePath} color="green" />

        {/* Vehicle Marker with Popup */}
        <Marker
          position={currentPosition}
          icon={vehicleIcon}
          eventHandlers={{
            mouseover: (e) => e.target.openPopup(),
            mouseout: (e) => e.target.closePopup(),
          }}
        >
          <Popup closeButton={false}>
            <div style={{ width: '240px', fontSize: '13px' }}>
              <h3 style={{ margin: '0', color: '#3b82f6' }}>🚌 WIRELESS</h3>
              <p style={{ margin: '4px 0' }}>
                📍 {current.location || 'Vijay Nagar, India'}
              </p>
              <p>🕒 {new Date(current.timestamp).toLocaleString()}</p>
              <hr />
              <p>🚦 Speed: {current.speed ?? '0'} km/h</p>
              <p>🛣️ Total Distance: {current.totalDistance ?? '834.89 km'}</p>
              <p>🔋 Battery: {current.battery ?? '16%'}</p>
              <p>📶 Status: <strong>{current.status ?? 'Stopped'}</strong></p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Controls */}
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <button
          onClick={() => setPlaying(!playing)}
          style={{
            padding: '8px 16px',
            backgroundColor: playing ? '#ef4444' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {playing ? 'Pause' : 'Play'}
        </button>
        <p style={{ margin: '8px 0' }}>
          <strong>📍 Coordinate:</strong> {currentPosition.join(', ')}
        </p>
        <p><strong>🕒 Timestamp:</strong> {current.timestamp}</p>
      </div>
    </>
  );
}

export default MapView;
