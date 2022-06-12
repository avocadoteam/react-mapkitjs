## Install

`yarn add react-wrapper-mapkitjs`

## Use

`React Wrapper Mapkitjs` can be used a couple different ways. No matter what method you use, you'll need to use a token or callback. Refer to https://developer.apple.com/documentation/mapkitjs/mapkit/2974045-init for info about using a server and callback.

Now on to the various ways to use this lib:

### 1. `Map` component alone

This is probably the simplest way to use `react-wrapper-mapkitjs`. This method works if you just want to render a single map and don't need to manipulate it (other than placing markers) via. code.

When using the `Map` component alone you'll need to provide the `tokenOrCallback` prop.

```js
import { Map, Marker } from 'react-wrapper-mapkitjs'

const MapAlone = () => (
  <Map tokenOrCallback={<token or callback here>} center={[37.415, -122.048333]}>
    <Marker latitude={47.6754} longitude={-122.2084} />
  </Map>
)
```

### 2. `MapProvider`

The second way to use `react-wrapper-mapkitjs` is by having a provider. This method is useful if you plan on having more than one map in your app and don't want to have a `tokenOrCallback` prop on all of them. I suggest putting the `MapkitProvider` at the top of your app so it only loads once. Loading it twice can cause errors.

You can also optionally set the maps language using `language`. Refer to: https://developer.apple.com/documentation/mapkitjs/mapkitinitoptions/2978217-language

```js
import { MapkitProvider, Map, Marker } from 'react-wrapper-mapkitjs'

const MapWithProvider = () => (
  <MapkitProvider tokenOrCallback={<token or callback here>} language={<language id>}>
    <Map center={[37.415, -122.048333]}>
      <Marker latitude={47.6754} longitude={-122.2084} />
    </Map>
  </MapkitProvider>
)
```

### 3. `MapProvider` with `useMap` hook

This is the most powerful way to use this library as it gives you full access to both `mapkit` and the `map`. This lets you do anything that mapkit supports even if this library does not yet support it. This method is similar to the above as you are using both the `MapkitProvider` and `Map` components, but you'll also use the `useMap` hook to get access to the map instance.

`useMap` provides the following:

- `mapkit`: the mapkit library itself
- `map`: the instance of a map
- `mapProps`: a set of props you'll need to spread onto a `Map` component to create a map.
- `setVisibleMapRect`, `setRegion`, `setCenter`, `setRotation`: convinance functions to manipulate the map. More coming soon!

```js
import { MapkitProvider, Map, useMap, Marker } from 'react-wrapper-mapkitjs'

const UseMapExample = () => {
  const { map, mapProps, setRotation } = useMap()

  return (
    <>
      <button onClick={() => map.setRotationAnimated(50)}>rotate to 50deg!</button>
      <button onClick={() => setRotation(50)}>same as the above, but using the react-wrapper-mapkitjs provided function.</button>
      <Map {...mapProps} />
    </>
  )
}

const MapWithUseMap = () => (
  <MapkitProvider tokenOrCallback={<token or callback here>}>
    <UseMapExample/>
  </MapkitProvider>
)
```

## Notes on various components / hooks

### Default Map Options

Both the `Map` component and the `useMap` hook can take default map options. for map these are passed as props. For example the following sets a custom center for the map:

```js
<Map tokenOrCallback={devToken} center={[37.415, -122.048333]} />
```

To do the same with `useMap` you would do:

```js
const { map } = useMap({ center: [37.415, -122.048333] })
```

The available options can be found here: https://developer.apple.com/documentation/mapkitjs/mapconstructoroptions

Note that some of these have been simplified so you don't need to use mapkit constructors. For example, instead of having to pass create a coordinate via `new mapkit.Coordinate(37.415, -122.048333)` to supply to `center` you just pass `[37.415, -122.048333]`.