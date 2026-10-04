import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withStorageError } from '../utils/storageError';
import { clampGardenOffset } from '../utils/gardenOffset';

const STORAGE_KEY = '@Pflanzkalender:gardenOffset';

interface GardenOffsetContextType {
  /** Zeitversatz in Halbmonaten (−2…+2), positiv = später. */
  offset: number;
  setOffset: (offset: number) => void;
}

const GardenOffsetContext = createContext<GardenOffsetContextType | undefined>(undefined);

export const GardenOffsetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [offset, setOffsetState] = useState(0);
  const isUserSetRef = useRef(false);

  const setOffset = (value: number): void => {
    const next = clampGardenOffset(value);
    isUserSetRef.current = true;
    setOffsetState(next);
    void withStorageError('Failed to save garden offset:', () =>
      AsyncStorage.setItem(STORAGE_KEY, String(next))
    );
  };

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (isUserSetRef.current || stored == null) return;
        setOffsetState(clampGardenOffset(Number(stored)));
      })
      .catch((error) => console.error('Failed to load garden offset:', error));
  }, []);

  return (
    <GardenOffsetContext.Provider value={{ offset, setOffset }}>
      {children}
    </GardenOffsetContext.Provider>
  );
};

const NO_OFFSET: GardenOffsetContextType = { offset: 0, setOffset: () => {} };

/** Ohne Provider (z. B. isolierte Screen-Tests) gilt „kein Versatz". */
export const useGardenOffset = (): GardenOffsetContextType =>
  useContext(GardenOffsetContext) ?? NO_OFFSET;
