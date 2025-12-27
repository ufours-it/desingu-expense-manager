import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Currency = {
  code: string;
  symbol: string;
};

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);

const STORAGE_KEY = 'currency_v1';

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>({
    code: 'INR',
    symbol: '₹',
  });

  useEffect(() => {
    (async () => {
    try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed.code === 'string' && typeof parsed.symbol === 'string') {
            setCurrencyState(parsed);
          }
        }
      } catch (error) {
        console.warn('Failed to load saved currency:', error);
      }
    })();
  }, []);

  const setCurrency = async (c: Currency) => {
   try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(c));
      setCurrencyState(c);
    } catch (error) {
      console.error('Failed to save currency:', error);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider');
  return ctx;
};

export default CurrencyProvider;
