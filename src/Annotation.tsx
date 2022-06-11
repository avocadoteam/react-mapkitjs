import { useRef } from 'react';
import { Fragment, useContext, useEffect } from 'react';
import { AppleMapContext } from './mapContext';

type Props = {
  visible?: boolean;
  id: string;
  longitude: number;
  latitude: number;
  color?: string;
  glyphText?: string;
  glyphImage?: string;
  selected?: boolean;
  title?: string;
  subtitle?: string;
};

export const Annotation = ({
  visible = true,
  glyphImage,
  glyphText,
  latitude,
  longitude,
  color,
  title,
  subtitle,
  selected,
  id = Date.now().toString(),
}: Props) => {
  const initMount = useRef(true);
  const { map, annotations } = useContext(AppleMapContext);

  useEffect(() => {
    let coords = new mapkit.Coordinate(latitude, longitude);
    let newAnnotation = new mapkit.MarkerAnnotation(coords, {
      color,
      title,
      subtitle,
      selected,
      visible,
    });
    glyphText ? (newAnnotation.glyphText = glyphText) : '';
    glyphImage ? (newAnnotation.glyphImage = { 1: glyphImage }) : '';
    annotations.current[id] = newAnnotation;
    map.current?.addAnnotation(newAnnotation);
    initMount.current = false;
  }, []);

  useEffect(() => {
    if (!id || initMount.current) {
      return;
    }

    if (!(id in annotations.current)) {
      let coords = new mapkit.Coordinate(latitude, longitude);
      let newAnnotation = new mapkit.MarkerAnnotation(coords, {
        color,
        title,
        subtitle,
        selected,
        visible,
      });
      glyphText ? (newAnnotation.glyphText = glyphText) : '';
      glyphImage ? (newAnnotation.glyphImage = { 1: glyphImage }) : '';
      annotations.current[id] = newAnnotation;
      map.current?.addAnnotation(newAnnotation);
      return;
    }
    let annotation = annotations.current[id];
    if (latitude !== annotation.coordinate.latitude || longitude !== annotation.coordinate.longitude) {
      annotation.coordinate = new mapkit.Coordinate(latitude, longitude);
    }
  }, [id, latitude, longitude]);
  return <Fragment />;
};
