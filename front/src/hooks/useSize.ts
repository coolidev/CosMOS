import { useState, useEffect } from 'react';

interface Size {
  width: number | undefined;
  height: number | undefined;
}

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<Size>({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  useEffect(() => {
    let timeOutFunctionId;
    window.addEventListener('resize', () => {
      clearTimeout(timeOutFunctionId);
      timeOutFunctionId = setTimeout(handleResize, 250);
    });
  }, []);

  return windowSize;
};

export default useWindowSize;
