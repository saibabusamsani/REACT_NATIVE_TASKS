import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import AppNavigator from './src/navigations/AppNavigator';
import { store } from './src/store';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import { buildToastConfig } from './src/theme/toastConfig';

const AppContent = () => {
  const theme = useTheme();

  return (
    <NavigationContainer>
      <AppNavigator />
      <Toast config={buildToastConfig(theme)} />
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;