import React from 'react';

import { MapContext } from './Map';

import { MarkerOptions, createCoordinate, propsToMarkerConstructionOptions } from './utils';

type MarkerProps = {
  latitude: number;
  longitude: number;
  onClick?: (e: mapkit.EventBase<mapkit.Map>) => void;
} & MarkerOptions;

export const Marker: React.FC<MarkerProps> = ({ latitude, longitude, onClick, ...options }) => {
  const { mapkit, map } = React.useContext(MapContext);
  const marker = React.useRef<mapkit.MarkerAnnotation>();

  React.useEffect(() => {
    if (mapkit && map) {
      marker.current = new mapkit.MarkerAnnotation(
        createCoordinate(latitude, longitude),
        propsToMarkerConstructionOptions(options),
      );

      map.addAnnotation(marker.current);

      if (onClick) {
        marker.current.addEventListener('select', onClick);
      }
    }
    return () => {
      marker.current && map && map.removeAnnotation(marker.current);
      if (marker.current && onClick) {
        marker.current.removeEventListener('select', onClick);
      }
    };
  }, [mapkit, map]);

  return null;
};
