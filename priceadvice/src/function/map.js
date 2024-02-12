import { Loader } from "@googlemaps/js-api-loader";
import nsw from "../assests/suburb-2-nsw.geojson";
const MapApi = process.env.REACT_APP_GOOGLE_MAP_KEY;
const MAPID = process.env.REACT_APP_GOOGLE_MAP_ID;
let map;
let featureLayer;
const loadGoogleMapsApi = () => {
    const loader = new Loader({
        apiKey: MapApi,
        version: "weekly",
    });

    loader.load().then(() => {
        // Ensures that this code runs only after the Google Maps API has been loaded
        
        initMap();
    }).catch(e => {
        console.error("Error loading Google Maps API: ", e);
    });
};

async function initMap() {
    // This code can now safely assume the Google Maps API is loaded
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById("map"), {
        center: { lat: -33.79176000 , lng: 151.08057000 },
        zoom: 10,
        mapId: MAPID,
    });
    featureLayer = map.getFeatureLayer('LOCALITY');

    const featureStyleOptions = {
        strokeColor: "#810FCB",
        strokeOpacity: 1.0,
        strokeWeight: 3.0,
        fillColor: "#810FCB",
        fillOpacity: 0.5,
      };
    featureLayer.style = (options) => {
        if (options.feature.placeId === "ckan_91e70237_d9d1_4719_a82f_e71b811154c6.1001") {
            // Hana, HI
            return featureStyleOptions;
        }
    }
    map.data.loadGeoJson(
        nsw,
      );
      map.data.setStyle({
        fillColor: 'green',
        strokeWeight: 0.1,
        visiable: false,
        clickable : true,
        strokeColor:'blue'
      });
      
      // Set the fill color to red when the feature is clicked.
      // Stroke weight remains 3.
      map.data.addListener('mouseover', function(event) {
         map.data.overrideStyle(event.feature, {fillColor: 'red'});
      });
};

export { loadGoogleMapsApi };
