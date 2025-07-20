import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import vehicleIconImg from '../assets/icons/bus-tracker.png'; // adjust path

// Custom marker icon
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
  const markerRef = useRef(null);
  const [trace, setTrace] = useState([]);

// Smooth animation between two LatLng points
const animateMarker = (from, to, duration = 1000) => {
  if (!markerRef.current) return;
  const start = performance.now();

  const step = (timestamp) => {
    const elapsed = timestamp - start;
    const t = Math.min(1, elapsed / duration);

    const lat = from[0] + (to[0] - from[0]) * t;
    const lng = from[1] + (to[1] - from[1]) * t;

    markerRef.current.setLatLng([lat, lng]);

    if (t < 1) requestAnimationFrame(step);
     else {
      // Update trace AFTER animation ends
      setTrace(prev => [...prev, to]);
    }
  };

  requestAnimationFrame(step);
};
  // Load dummy route
  useEffect(() => {
    fetch('/dummy-route.json')
      .then(res => res.json())
      .then(data => setRoute(data));
  }, []);
useEffect(() => {
  if (route.length > 0) {
    setTrace([ [route[0].latitude, route[0].longitude] ]);
  }
}, [route]);

  // Animate vehicle movement
  useEffect(() => {
  if (playing && route.length > 1) {
    intervalRef.current = setInterval(() => {
      setIndex(prev => {
        if (prev < route.length - 1) {
          const from = [route[prev].latitude, route[prev].longitude];
          const to = [route[prev + 1].latitude, route[prev + 1].longitude];
          animateMarker(from, to);
          return prev + 1;
        } else {
          clearInterval(intervalRef.current);
          return prev;
        }
      });
    }, 1000);
  } else {
    clearInterval(intervalRef.current);
  }

  return () => clearInterval(intervalRef.current);
}, [playing, route]);

 if (!route.length) return (
  <div style={{
    fontFamily: 'Poppins, sans-serif',
    textAlign: 'center',
    marginTop: '60px',
    fontSize: '16px',
    color: '#6b7280'
  }}>
     Loading route data...
  </div>
);


  const current = route[index];
  const currentPosition = [current.latitude, current.longitude];
  const tracePath = route.slice(0, index + 1).map(p => [p.latitude, p.longitude]);



  return (
    <div style={{
  background: '#f8f9fa',
  minHeight: '100vh',
  padding: '24px 0'
}}>
    
    <div
  style={{
    maxWidth: '1100px',
    margin: '30px auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
    overflow: 'hidden'
  }}
>
      <MapContainer
         center={currentPosition}
    zoom={17}
    style={{ height: '75vh', width: '100%', borderRadius: '12px' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={trace} color="#13d142ff" weight={6} opacity={0.9} />

        <Marker

  position={currentPosition}
  icon={vehicleIcon}
  ref={markerRef}
  eventHandlers={{
    
    mouseover: (e) => e.target.openPopup(),
    mouseout: (e) => e.target.closePopup(),
  }}
>
  <Popup closeButton={false}>
    <div style={{ width: '240px', fontSize: '13px', fontFamily: 'Poppins, sans-serif' }}>
      <h3 style={{ margin: '0', color: '#3b82f6' }}>🚌 WIRELESS</h3>
      <p style={{ margin: '4px 0' }}>
        📍 {current.location || 'Vijay Nagar, India'}
      </p>
      <p>🕒 {new Date(current.timestamp).toLocaleString()}</p>
      <hr />
      <p>🚦 Speed: {current.speed ?? '0'} km/h</p>
      <p>🛣️ Distance: {current.totalDistance ?? '834.89 km'}</p>
      <p>🔋 Battery: {current.battery ?? '16%'}</p>
      <p>📶 Status: <strong>{current.status ?? 'Stopped'}</strong></p>
    </div>
  </Popup>
</Marker>

      </MapContainer>
</div>
      {/* Control Panel */}
      <div style={{
        maxWidth: '900px',
        margin: '20px auto',
        padding: '12px 20px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        fontFamily: 'Poppins, sans-serif',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
        
      }}>
        <button
          onClick={() => setPlaying(!playing)}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '600',
            backgroundColor: playing ? '#ef4444' : '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
             minWidth: '140px',
            fontFamily: 'Poppins, sans-serif',
            transition: 'all 0.2s ease'
          }}
        >
          {playing ? '⏸ Pause' : '▶ Play'}

        </button>

        <div style={{ fontSize: '14px' }}>
         <div style={{ fontFamily: 'Poppins, sans-serif' }}>
  <strong>📍 Coordinate:</strong>{' '}
  <span style={{ fontFamily: 'Courier New, monospace' }}>
 {current.latitude.toFixed(5)}, {current.longitude.toFixed(5)}
  </span>
</div>
         <div style={{ fontFamily: 'Poppins, sans-serif' }}>
  <strong>🕒 Timestamp:</strong>{' '}
  <span style={{ fontFamily: 'Courier New, monospace' }}>
    {current.timestamp}
  </span>
</div>
        </div>
      </div>
      
    </div>
  );
}

export default MapView;
