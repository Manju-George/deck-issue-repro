import React, {useEffect, useState, useRef} from 'react';
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import { environment } from '../../Environments/EnvDev';
import DeckGLTiles from './DeckGLTiles';
import RadioGroup from '../Filters/RadioButtonGroup';



mapboxgl.accessToken = environment.mapbox.accessToken;

const MapboxComponent = () => {
  const mapContainerRef = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const [selectedLGA, setSelectedLGA] = useState("All");

  
  const handleSelectedLGA = (checked:boolean,selected:string) => {
    setSelectedLGA(selected);
  }

  const [lng] = useState(146.8078);
  const [lat] = useState(-34.9801);
  const [zoom] = useState(8);
// 147.33266,-35.29896

  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map when component mounts
  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current as unknown as HTMLElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    const createdMap = map.current;

    // Add our navigation control (the +/- zoom buttons)
   createdMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    // Map onload event 
    createdMap.on("load", ()=> {
        // Nifty code to force map to fit inside container when it loads
      //  createdMap.resize();
      setMapLoaded(true);
    })

    // Clean up on unmount
    return () => createdMap.remove();
  }, [lat, lng, zoom]); 

  
  const mapControls = mapLoaded && map.current != null ? (
  <>
    <DeckGLTiles map={map.current} selectedLGA={selectedLGA} />
  </>): null;
  
  const LGAOPtions = [
    "All",
    "Wagga Wagga",
    "Lockhart",
    "Coolamon",
    "Narrandera"
  ];

  return (
    <div className='map-overlay' ref={mapContainerRef}>
        <div className="map-overlay-inner">
          <RadioGroup name="LGA" options={LGAOPtions} selected={selectedLGA} handleSelected={handleSelectedLGA}/>
      </div>
{mapControls}
      
   </div>
  );
};

export default MapboxComponent;