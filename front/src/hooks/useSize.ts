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

export const useFullScreen = () => {
  const [isFull, setIsFull] = useState<boolean>(window.outerWidth >= window.screen.width - 6 && window.outerHeight > window.screen.availHeight - 20);

  const checkIsFull = () => {
    setIsFull(window.outerWidth >= window.screen.width - 6 && window.outerHeight > window.screen.availHeight - 20)
  }

  useEffect(() => {
    window.addEventListener('resize', () => {
      setTimeout(checkIsFull, 250);
    });
  }, []);

  return isFull
}

export default useWindowSize;
