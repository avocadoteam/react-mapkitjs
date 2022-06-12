import React from 'react';
import { ColorScheme, FeatureVisibility, isOneOf, MapType } from './enums';
import { AppleMapContext } from './mapContext';

type AppleMapProps = React.PropsWithChildren<{
  token: string;
  mapId: string;
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
    mapId,
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
  const mapRef = React.useRef<mapkit.Map>();
  const mapID = React.useRef<string>(mapId);
  const currentLocationRef = React.useRef<mapkit.Annotation>();
  const annotationsRef = React.useRef<Record<string, mapkit.MarkerAnnotation>>({});
  const initMount = React.useRef(true);
  const initialized = React.useRef(false);

  React.useEffect(() => {
    canvasRef.current.id = 'currentLocationOverride';
    mapkit.addEventListener('configuration-change', e => {
      console.debug('[RW]', e.status)
    })
    if (!initialized.current) {

      mapkit.init({
        authorizationCallback: done => {
          initialized.current = true;
          done(token);
        },
      });
    }


    console.debug(initialized.current, '[RW]: init', props);

    mapRef.current = new mapkit.Map(mapID.current);

    if (initialMapType) {
      if (!isOneOf(initialMapType, MapType)) {
        console.error('Invalid initialMapType provided to AppleMaps component.');
      } else {
        mapRef.current.mapType = initialMapType;
      }
    }

    if (colorScheme) {
      if (!isOneOf(colorScheme, ColorScheme)) {
        console.error('Invalid colorScheme provided to AppleMaps component.');
      } else {
        mapRef.current.colorScheme = colorScheme;
      }
    }

    if (showsCompass) {
      if (!isOneOf(showsCompass, FeatureVisibility)) {
        console.error('Invalid showsCompass provided to AppleMaps component.');
      } else {
        mapRef.current.showsCompass = showsCompass;
      }
    }

    if (showsMapTypeControl) {
      mapRef.current.showsMapTypeControl = showsMapTypeControl;
    }
    if (showsZoomControl) {
      mapRef.current.showsZoomControl = showsZoomControl;
    }

    setMainCoords();
    initMount.current = false;
  }, []);

  React.useEffect(() => {
    if (initMount.current || !mapRef.current) {
      return;
    }

    if (colorScheme) {
      if (!isOneOf(colorScheme, ColorScheme)) {
        console.error('Invalid colorScheme provided to AppleMaps component.');
      } else {
        mapRef.current.colorScheme = colorScheme;
      }
    }

    if (showsCompass) {
      if (!isOneOf(showsCompass, FeatureVisibility)) {
        console.error('Invalid showsCompass provided to AppleMaps component.');
      } else {
        mapRef.current.showsCompass = showsCompass;
      }
    }

    if (showsMapTypeControl) {
      mapRef.current.showsMapTypeControl = showsMapTypeControl;
    }
    if (showsZoomControl) {
      mapRef.current.showsZoomControl = showsZoomControl;
    }

    if (autoAdjust) {
      setMainCoords();
    }
  }, [token, autoAdjust, latitude, longitude, zoomLevel, width, height, zoomLevel]);

  const setMainCoords = React.useCallback(() => {
    mapRef.current!.region = new mapkit.CoordinateRegion(
      new mapkit.Coordinate(latitude, longitude),
      new mapkit.CoordinateSpan(getZoomLevel(zoomLevel), getZoomLevel(zoomLevel)),
    );
  }, [latitude, longitude, zoomLevel]);

  return (
    <div
      id={mapID.current}
      style={{
        width,
        height,
      }}
    >
      <AppleMapContext.Provider
        value={{ currentLocation: currentLocationRef, map: mapRef, annotations: annotationsRef, canvas: canvasRef }}
      >
        {children}
      </AppleMapContext.Provider>
    </div>
  );
};
