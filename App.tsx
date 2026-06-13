/**
 * Noir — OLED Dark Video Player
 *
 * @format
 */

import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { I18nextProvider } from 'react-i18next';
import AppNavigator from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { Colors } from './src/theme/colors';
import i18n from './src/i18n';

const DarkNavigationTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.background,
    card: Colors.surface,
    text: Colors.textPrimary,
    border: Colors.separator,
    primary: Colors.accent,
    notification: Colors.accent,
  },
};

export default function App() {
  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <SafeAreaProvider>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          <NavigationContainer theme={DarkNavigationTheme}>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
}
