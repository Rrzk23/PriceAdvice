
import React, { useEffect } from 'react';
import './App.css';
import { loadGoogleMapsApi } from './function/map'; // Adjust the path if necessary

function App() {
  useEffect(() => {
    loadGoogleMapsApi(); // This will load the map when the component mounts
  }, []);

  return (
    <div className="App">
      <div id="map"></div> {/* Ensure this id matches the one used in map.js */}
    </div>
  );
}

export default App;
