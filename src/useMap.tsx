import React from 'react';

import { MapkitContext } from './MapkitProvider';
import { MapOptions, MarkerOptions, propsToMapConstructionOptions, propsToMarkerConstructionOptions } from './utils';

import { createCoordinate, createCoordinateRegionFromValues, createMapRect, NumberTuple, Rect, RegionType } from './utils';

export const useMap = ({ addAnnotationOnClick, ...defaultOptions }: MapOptions = {}) => {
  const [defaultMapOptions] = React.useState(defaultOptions);
  let { mapkit } = React.useContext(MapkitContext);
  let mapRef = React.useRef<HTMLDivElement>(null);
  let [map, setMap] = React.useState<mapkit.Map>();

  React.useEffect(() => {
    if (mapkit && mapRef.current) {
      const newMap = new mapkit.Map(mapRef.current, propsToMapConstructionOptions(defaultMapOptions));
      setMap(newMap);

      if (addAnnotationOnClick) {
        newMap.element.addEventListener('click', function (event) {
          if ((event.target as any).parentNode !== newMap.element) {
            // This condition prevents clicks on controls. Binding to a
            // secondary click is another option to prevent conflict
            return;
          }
          var domPoint = new DOMPoint(event.pageX, event.pageY);
          var coordinate = newMap.convertPointOnPageToCoordinate(domPoint);
          newMap.addAnnotation(new mapkit!.MarkerAnnotation(coordinate));
        });
      }
    }
  }, [mapRef, mapkit]);

  // Clean up the map on unmount
  React.useEffect(() => {
    return () => {
      if (map) {
        map.destroy();
      }
    };
  }, []);

  return {
    mapkit,
    map,
    mapProps: {
      mapkit,
      map,
      mapRef,
    },
    setRotation: React.useCallback(
      (rotationValue: number, isAnimated: boolean = false) => {
        if (map) {
          map.setRotationAnimated(rotationValue, isAnimated);
        }
      },
      [map],
    ),
    setCenter: React.useCallback(
      (centerValue: NumberTuple, isAnimated: boolean = false) => {
        if (map) {
          map.setCenterAnimated(createCoordinate(...centerValue), isAnimated);
        }
      },
      [map],
    ),
    setRegion: React.useCallback(
      (region: RegionType, isAnimated: boolean = false) => {
        if (map) {
          map.setRegionAnimated(createCoordinateRegionFromValues(region), isAnimated);
        }
      },
      [map],
    ),
    setVisibleMapRect: React.useCallback(
      (visibleMapRect: Rect, isAnimated: boolean = false) => {
        if (map) {
          map.setVisibleMapRectAnimated(createMapRect(...visibleMapRect), isAnimated);
        }
      },
      [map],
    ),
    addMarker: React.useCallback(
      (region: RegionType, options: MarkerOptions = {}, onClick?: (e: mapkit.EventBase<mapkit.Map>) => void) => {
        if (map && mapkit) {
          const marker = new mapkit.MarkerAnnotation(
            createCoordinate(region.latitude, region.longitude),
            propsToMarkerConstructionOptions(options),
          );

          if (onClick) {
            marker.addEventListener('select', onClick);
          }

          map.addAnnotation(marker);
        }
      },
      [map, mapkit],
    ),
  };
};
