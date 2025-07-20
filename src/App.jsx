import MapView from './Components/MapView';

function App() {
  return (
    <div>
      <h2 style={{
  fontWeight: 600,
  fontSize: '25px',
  textAlign: 'center',
  marginTop: '30px',
  color: '#1e293b'
}}>
  Vehicle Route Simulation Dashboard
</h2>
      <MapView />
    </div>
  );
}

export default App;
