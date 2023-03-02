// Libraries
import React, { useState } from 'react';

const initial = {
  zoom: 1,
  selectZoom: () => {}
}

export const ZoomContext = React.createContext(initial);

const ZoomContextProvider = ({ children }: any) => {
  const [zoom, setZoom] = useState(1)

  const selectZoom = () => {
    setZoom(window.devicePixelRatio);
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
