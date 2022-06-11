import { useContext, useRef } from 'react';
import { useEffect } from 'react';
import { Fragment } from 'react';
import { AppleMapContext } from './mapContext';
type Props = {
  longitude: number;
  latitude: number;
  direction: number;
};

export const CurrentLocationOverride = ({ direction, latitude, longitude }: Props) => {
  const { canvas, map, currentLocation } = useContext(AppleMapContext);
  const initMount = useRef(true);

  useEffect(() => {
    const options = {
      data: {
        direction,
      },
    };
    const coordinate = new mapkit.Coordinate(latitude, longitude);
    currentLocation.current = new mapkit.Annotation(
      coordinate,
      () => {
        let ctx = canvas.current.getContext('2d')!;
        ctx.beginPath();
        ctx.translate(150, 135);
        ctx.rotate((options.data.direction * Math.PI) / 180);
        ctx.lineCap = 'round';
        ctx.moveTo(0, 7);
        ctx.lineTo(10, 12);
        ctx.lineTo(0, -13);
        ctx.lineTo(-10, 12);
        ctx.lineTo(0, 7);
        ctx.fillStyle = '#08F';
        ctx.strokeStyle = '#08F';
        ctx.stroke();
        ctx.fill();
        return canvas.current;
      },
      options,
    );
    map.current?.showItems([currentLocation.current]);
    initMount.current = false;
  }, []);

  useEffect(() => {
    if (initMount.current) {
      return;
    }
    const coordinate = new mapkit.Coordinate(latitude, longitude);
    currentLocation.current!.coordinate = coordinate;
  }, [latitude, longitude]);
  return <Fragment />;
};
