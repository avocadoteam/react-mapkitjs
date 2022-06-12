import React from 'react';
import { ColorScheme, FeatureVisibility, isOneOf, MapType } from './enums';
import { AppleMapContext } from './mapContext';

type AppleMapProps = React.PropsWithChildren<{
  token: string;
  longitude: number;
  latitude: number;
  zoomLevel?: number;
  height?: string;
  width?: string;
  initialMapType?: MapType;
  colorScheme?: ColorScheme;
  showsCompass?: FeatureVisibility;
  showsMapTypeControl?: boolean;
  showsZoomControl?: boolean;
  autoAdjust?: boolean;
}>;

const getZoomLevel = (zoomLevel?: number) => {
  switch (zoomLevel) {
    case 0:
      return 300;
    case 1:
      return 75;
    case 2:
      return 18.75;
    case 3:
      return 4.68;
    case 4:
      return 1.17;
    case 5:
      return 0.39;
    case 6:
      return 0.073;
    case 7:
      return 0.018;
    case 8:
      return 0.0045;
    default:
      return 0.35;
  }
};

export const AppleMaps = (props: AppleMapProps) => {
  const {
    token,
    initialMapType,
    colorScheme,
    showsCompass,
    showsMapTypeControl,
    showsZoomControl,
    children,
    height = '100vh',
    width = '100wh',
    zoomLevel = 6,
    autoAdjust = false,
    latitude = -1.5491,
    longitude = 53.8008,
  } = props;
  // const [mapkitToken, setToken] = useState(token);
  const canvasRef = React.useRef(document.createElement('canvas'));
  const mapkitRef = React.useRef<mapkit.Map>();
  const mapRef = React.useRef<HTMLDivElement>(null);
  const currentLocationRef = React.useRef<mapkit.Annotation>();
  const annotationsRef = React.useRef<Record<string, mapkit.MarkerAnnotation>>({});
  const initMount = React.useRef(true);

  React.useEffect(() => {
    if (!mapRef.current) {
      return;
    }
    canvasRef.current.id = 'currentLocationOverride';
    mapkit.init({
      authorizationCallback: done => {
        done(token);
      },
    });

    console.debug('[RW]: init', props);

    mapkitRef.current = new mapkit.Map(mapRef.current!);

    if (initialMapType) {
      if (!isOneOf(initialMapType, MapType)) {
        console.error('Invalid initialMapType provided to AppleMaps component.');
      } else {
        mapkitRef.current.mapType = initialMapType;
      }
    }

    if (colorScheme) {
      if (!isOneOf(colorScheme, ColorScheme)) {
        console.error('Invalid colorScheme provided to AppleMaps component.');
      } else {
        mapkitRef.current.colorScheme = colorScheme;
      }
    }

    if (showsCompass) {
      if (!isOneOf(showsCompass, FeatureVisibility)) {
        console.error('Invalid showsCompass provided to AppleMaps component.');
      } else {
        mapkitRef.current.showsCompass = showsCompass;
      }
    }

    if (showsMapTypeControl) {
      mapkitRef.current.showsMapTypeControl = showsMapTypeControl;
    }
    if (showsZoomControl) {
      mapkitRef.current.showsZoomControl = showsZoomControl;
    }

    setMainCoords();
    initMount.current = false;
  }, []);

  React.useEffect(() => {
    if (initMount.current || !mapkitRef.current) {
      return;
    }

    if (colorScheme) {
      if (!isOneOf(colorScheme, ColorScheme)) {
        console.error('Invalid colorScheme provided to AppleMaps component.');
      } else {
        mapkitRef.current.colorScheme = colorScheme;
      }
    }

    if (showsCompass) {
      if (!isOneOf(showsCompass, FeatureVisibility)) {
        console.error('Invalid showsCompass provided to AppleMaps component.');
      } else {
        mapkitRef.current.showsCompass = showsCompass;
      }
    }

    if (showsMapTypeControl) {
      mapkitRef.current.showsMapTypeControl = showsMapTypeControl;
    }
    if (showsZoomControl) {
      mapkitRef.current.showsZoomControl = showsZoomControl;
    }

    if (autoAdjust) {
      setMainCoords();
    }
  }, [token, autoAdjust, latitude, longitude, zoomLevel, width, height, zoomLevel]);

  const setMainCoords = React.useCallback(() => {
    mapkitRef.current!.region = new mapkit.CoordinateRegion(
      new mapkit.Coordinate(latitude, longitude),
      new mapkit.CoordinateSpan(getZoomLevel(zoomLevel), getZoomLevel(zoomLevel)),
    );
  }, [latitude, longitude, zoomLevel]);

  return (
    <div
      ref={mapRef}
      style={{
        width,
        height,
      }}
    >
      <AppleMapContext.Provider
        value={{ currentLocation: currentLocationRef, map: mapkitRef, annotations: annotationsRef, canvas: canvasRef }}
      >
        {children}
      </AppleMapContext.Provider>
    </div>
  );
};
