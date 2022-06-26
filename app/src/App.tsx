import React, {useEffect} from 'react';
import {StateContextProvider} from './global/context';

import EntryApp from './navigation/EntryApp';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  useEffect(() => {
    setTimeout(() => SplashScreen.hide(), 1500);
  });
  return (
    <StateContextProvider>
      <EntryApp />
    </StateContextProvider>
  );
};

export default App;
