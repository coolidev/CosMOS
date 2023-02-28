import { useState, useEffect } from 'react';

const useMaximized = () => {
  const [isMaximized, setMaximized] = useState<boolean>(false);

  const handleCheck = () => {
    const checked =
    (Math.abs(window.screen.availHeight - window.outerHeight) <= 7 &&
    window.innerHeight / ((window.innerHeight + window.outerHeight) / 2) >
      0.8) ||
    (window.screen.availHeight || window.screen.height - 30) <=
      window.innerHeight;
    setMaximized(checked);
  };

  useEffect(() => {
    window.addEventListener('resize', handleCheck);
    handleCheck();

    return () => window.removeEventListener('resize', handleCheck);
  }, []);

  return isMaximized;
};

export default useMaximized;
