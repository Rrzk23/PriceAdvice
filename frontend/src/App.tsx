

import React, { useEffect, useRef} from 'react';
import './App.css';
import  Map  from './pages/map.tsx'; 
import LocationFilter from './components/locationFilter.tsx';

const App: React.FC = () => {


  return (
    <div className="App">
      <LocationFilter/>
      <Map/>
      <div id="sideInfoWindow" style={{
        position: 'absolute',
        top: '10%',
        left: '0',
        width: '200px',
        height: 'auto',
        backgroundColor: 'white',
        border: '1px solid black',
        padding: '10px',
        display: 'none', // Initially hidden
        zIndex: '1000',
      }}/>
    </div>
  );
}

export default App;
