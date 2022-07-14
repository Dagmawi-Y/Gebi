import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {useTranslation} from 'react-i18next';

const StateContext = React.createContext();

const StateContextProvider = ({children}) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [headerVisible, setHeaderVisible] = useState(true);
  const [isNewUser, setIsNewUser] = useState();
  const [isReady, setIsReady] = useState(false);

  const [addNewModalVisible, setAdNewModalVisible] = useState(false);
  const {i18n} = useTranslation();

  const [curlang, setCurlang] = useState('');
  const [introDone, setIntroDone] = useState(false);

  const value = {
    user,
    curlang,
    introDone,
    initializing,
    headerVisible,
    addNewModalVisible,
    isNewUser,
    isReady,
    setIsReady,
    setIsNewUser,
    setAdNewModalVisible,
    setHeaderVisible,
    setInitializing,
    setIntroDone,
    setCurlang,
    setUser,
  };

  // Auth

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
    setIsReady(true);
  }
  // End  Auth

  const init = async () => {
    try {
      await AsyncStorage.getItem('lang')
        .then(ln => {
          if (ln) {
            setCurlang(ln.toString());
            i18n.changeLanguage(ln);
          }
        })
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

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};

export {StateContext, StateContextProvider};
