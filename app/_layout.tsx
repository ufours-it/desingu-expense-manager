import React from 'react';
import { DarkTheme as NavDarkTheme, DefaultTheme as NavDefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ThemeProvider as AppThemeProvider, useTheme } from './providers/ThemeProvider';
import { TransactionsProvider } from './providers/TransactionsProvider';
import { CurrencyProvider } from './providers/CurrencyProvider';

function Inner() {
  const { mode } = useTheme();
  const navTheme = mode === 'dark' ? NavDarkTheme : NavDefaultTheme;
  return (
    <NavThemeProvider value={navTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <CurrencyProvider>
        <TransactionsProvider>
          <Inner />
        </TransactionsProvider>
      </CurrencyProvider>
    </AppThemeProvider>
  );
}
