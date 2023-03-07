// Libraries
import React, { useEffect, useState } from 'react';
import { round } from "lodash";

const initial = {
  zoom: 1,
  selectZoom: () => {}
}

export const ZoomContext = React.createContext(initial);

const ZoomContextProvider = ({ children }: any) => {
  const [zoom, setZoom] = useState(1);
  const selectZoom = () => {
    const defaultScale = round(window.innerWidth / (window.screen.width / window.devicePixelRatio), 2)
    setZoom(window.devicePixelRatio / defaultScale);
  }

  return (
    <ZoomContext.Provider
      value={{ zoom, selectZoom }}
    >
      { children }
    </ZoomContext.Provider>
  )
}

export { ZoomContextProvider };
