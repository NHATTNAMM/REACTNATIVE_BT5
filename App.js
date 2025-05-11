import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TODOListScreen from './src/screens/TODOListScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <TODOListScreen />
    </SafeAreaProvider>
  );
}
