import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useTranslation} from 'react-i18next';

const StateContext = React.createContext();

const StateContextProvider = ({children}) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  const [sales, setSales] = useState(false);
  const [expense, setExpense] = useState(false);
  const [plan, setPlan] = useState(false);
  const [inventory, setInventory] = useState(false);

  const [loadingUserData, setLoadingUserData] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);

  const [headerTitle, setHeaderTitle] = useState('');
  const [headerBack, setHeaderBack] = useState(false);
  const [onBack, setOnBack] = useState(null);

  const [bottomNavVisible, setBottomNavVisible] = useState(false);

  const [addNewModalVisible, setAdNewModalVisible] = useState(false);
  const {i18n} = useTranslation();

  const [totalExpense, setTotalExpense] = useState(0);
  const [totalProfit, SetTotalProfit] = useState(0);
  const [totalIncome, SetTotalIncome] = useState(0);

  const [curlang, setCurlang] = useState('');
  const [introDone, setIntroDone] = useState(false);

  const test = () => {
    onBack();
  };

  const value = {
    test,
    user,
    curlang,
    isReady,
    userInfo,
    introDone,
    totalProfit,
    totalIncome,
    totalExpense,
    initializing,
    headerVisible,
    loadingUserData,
    addNewModalVisible,
    headerTitle,
    bottomNavVisible,
    headerBack,
    onBack,
    isAdmin,
    sales,
    setSales,
    expense,
    setExpense,
    plan,
    setPlan,
    inventory,
    setInventory,
    setIsAdmin,
    setOnBack,
    setBottomNavVisible,
    setHeaderBack,
    setHeaderTitle,
    setUser,
    setIsReady,
    setCurlang,
    setUserInfo,
    setIntroDone,
    SetTotalIncome,
    SetTotalProfit,
    setInitializing,
    setTotalExpense,
    setHeaderVisible,
    setLoadingUserData,
    setAdNewModalVisible,
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
      auth().signOut();
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
