import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark';

type ThemeContextValue = {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (m: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const STORAGE_KEY = 'theme_v1';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>('dark');

    useEffect(() => {
        (async () => {
            try {
                const hour = new Date().getHours();
                if (hour >= 18 || hour < 6) { 
                    setMode('dark');
                } else {
                    setMode('light');
                }
            } catch (e) {
                console.warn('Failed to load theme', e);
            }
        })();
    }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, mode);
      } catch (e) {
        console.warn('Failed to save theme', e);
      }
    })();
  }, [mode]);

  const toggle = () => setModeState((m) => (m === 'dark' ? 'light' : 'dark'));
  const setMode = (m: ThemeMode) => setModeState(m);

  return <ThemeContext.Provider value={{ mode, toggle, setMode }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export default ThemeProvider;
