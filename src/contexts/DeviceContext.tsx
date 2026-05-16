import React, { createContext, useContext, useState, useEffect } from 'react';

interface DeviceContextType {
  isTouchDevice: boolean;
  isReducedMotion: boolean;
}

const DeviceContext = createContext<DeviceContextType>({
  isTouchDevice: false,
  isReducedMotion: false,
});

export const useDevice = () => useContext(DeviceContext);

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const checkTouch = window.matchMedia('(pointer: coarse)');
    const checkMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    setIsTouchDevice(checkTouch.matches);
    setIsReducedMotion(checkMotion.matches);

    const updateTouch = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
    const updateMotion = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);

    checkTouch.addEventListener('change', updateTouch);
    checkMotion.addEventListener('change', updateMotion);

    return () => {
      checkTouch.removeEventListener('change', updateTouch);
      checkMotion.removeEventListener('change', updateMotion);
    };
  }, []);

  return (
    <DeviceContext.Provider value={{ isTouchDevice, isReducedMotion }}>
      {children}
    </DeviceContext.Provider>
  );
};
