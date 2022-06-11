import React from 'react';
import { AppleMapContext } from './mapContext';

type Props = {
  visible?: boolean;
  longitude: number;
  latitude: number;
  url: string;
  selected?: boolean;
  title?: string;
  subtitle?: string;
};
export const ImageAnnotation = ({ visible = true, latitude, longitude, selected, subtitle, title, url }: Props) => {
  const initMount = React.useRef(true);
  const { map } = React.useContext(AppleMapContext);

  React.useEffect(() => {
    let coords = new mapkit.Coordinate(latitude, longitude);
    let newAnnotation = new mapkit.ImageAnnotation(coords, {
      title,
      subtitle,
      selected,
      visible,
      url: { 1: url },
    });
    map.current?.addAnnotation(newAnnotation);
    initMount.current = false;
  }, []);
  return <React.Fragment />;
};
