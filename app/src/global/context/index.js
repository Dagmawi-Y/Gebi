import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

const StateContext = React.createContext();

const StateContextProvider = ({children}) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const [addNewModalVisible, setAdNewModalVisible] = useState(false);

  const [curlang, setCurlang] = useState('');
  const [introDone, setIntroDone] = useState(false);

  // Auth

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  // End  Auth

  const init = async () => {
    try {
      await AsyncStorage.getItem('lang')
        .then(ln => setCurlang(ln.toString()))
        .catch(err => {});
      await AsyncStorage.getItem('introDone')
        .then(val => setIntroDone(val.toString()))
        .catch(err => {});
    } catch (error) {
      console.log(error);
    }
  };

  const reset = async () => {
    try {
      auth()
        .signOut()
        .then(() => console.log('User signed out!'));
      await AsyncStorage.removeItem('lang').catch(err => console.log(err));
      await AsyncStorage.removeItem('introDone').catch(err => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // reset();
    init();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const value = {
    curlang,
    introDone,
    introDone,
    initializing,
    user,
    addNewModalVisible,
    setAdNewModalVisible,
    setUser,
    setInitializing,
    setIntroDone,
    setCurlang,
    setIntroDone,
  };

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};

export {StateContext, StateContextProvider};
