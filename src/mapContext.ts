import React from 'react';

export const AppleMapContext = React.createContext<{
  map: React.MutableRefObject<mapkit.Map | undefined>;
  annotations: React.MutableRefObject<Record<string, mapkit.MarkerAnnotation>>;
  canvas: React.MutableRefObject<HTMLCanvasElement>;
  currentLocation: React.MutableRefObject<mapkit.Annotation | undefined>;
}>({
  map: null as unknown as mapkit.Map,
  annotations: {},
} as any);
