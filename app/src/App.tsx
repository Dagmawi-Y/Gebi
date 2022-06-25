import React, {useEffect} from 'react';
import {StateContextProvider} from './global/context';

import RouteApp from './navigation/MainRouter';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  useEffect(() => {
    setTimeout(() => SplashScreen.hide(), 1500);
  });
  return (
    <StateContextProvider>
      <RouteApp />
    </StateContextProvider>
  );
};

export default App;
