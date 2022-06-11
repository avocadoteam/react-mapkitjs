export enum MapType {
  Standard = 'standard',
  MutedStandard = 'mutedStandard',
  Hybrid = 'hybrid',
  Satellite = 'satellite',
}

export enum ColorScheme {
  Light = 'light',
  Dark = 'dark',
}

export enum FeatureVisibility {
  Adaptive = 'adaptive',
  Hidden = 'hidden',
  Visible = 'visible',
}

export const isOneOf = <T>(value: any, enumT: T) => Object.values(enumT).includes(value);
