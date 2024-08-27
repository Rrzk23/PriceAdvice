import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import nsw from "../assets/suburb-2-nsw.geojson";
import InfoWindowContent from "../components/InfoWindowContent";
import ReactDOM from 'react-dom/client';

const Map: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) return; // Prevent multiple initializations

    const initLeafletMap = () => {
      const map = L.map('map').setView([-33.79176000, 151.08057000], 10);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      fetch(nsw)
        .then(response => response.json())
        .then(data => {
          const geoJsonLayer = L.geoJSON(data, {
            style: () => ({
              color: 'blue',
              weight: 0.1,
              fillColor: 'white',
            }),
            onEachFeature: (feature, layer) => {
              layer.on({
                mouseover: (e: L.LeafletMouseEvent) => {
                  layer.setStyle({ fillColor: 'red' });

                  const infowindow = document.getElementById('sideInfoWindow') as HTMLElement;
                  infowindow.style.display = 'block';
                  infowindow.innerHTML = `<h2>Suburb: ${feature.properties.nsw_loca_2}</h2>`;
                },
                mouseout: () => {
                  layer.setStyle({ fillColor: 'white' });

                  const infowindow = document.getElementById('sideInfoWindow') as HTMLElement;
                  infowindow.style.display = 'none';
                },
                click: (e: L.LeafletMouseEvent) => {
                  if (mapRef.current) {
                    mapRef.current.flyTo(e.latlng, 14, {
                      animate: true,
                      duration: 1.5
                    });

                    const suburbName = feature.properties.nsw_loca_2;

                    const div = document.createElement('div');
                    const root = ReactDOM.createRoot(div);
                    root.render(<InfoWindowContent suburbName={suburbName} />);

                    const popup = L.popup()
                      .setLatLng(e.latlng)
                      .setContent(div)
                      .openOn(mapRef.current);
                  }
                }
              });
            }
          }).addTo(map);
        })
        .catch(error => {
          console.error('Error loading GeoJSON:', error);
        });
    };

    initLeafletMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div id="map" style={{ height: "100vh", width: "100%" }}></div>
  );
};

export default Map;
