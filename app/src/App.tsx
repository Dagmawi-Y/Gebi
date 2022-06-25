import React from 'react';
import {StateContextProvider} from './global/context';

import EntryApp from './navigation/EntryApp';

const App = () => {
  return (
    <StateContextProvider>
      <EntryApp />
    </StateContextProvider>
  );
};

export default App;
