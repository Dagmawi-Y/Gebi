import React from 'react';
import {StateContextProvider} from './global/context';

import RouteApp from './navigation/MainRouter';

const App = () => {

  return (
    <StateContextProvider>
      <RouteApp />
    </StateContextProvider>
  );
};

export default App;
