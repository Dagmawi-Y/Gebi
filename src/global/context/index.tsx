import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useTranslation} from 'react-i18next';

const StateContext = React.createContext<any>(null);

const StateContextProvider = ({children}) => {
  const [expenses, setExpenses] = useState(0);

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  const [sales, setSales] = useState(false);
  const [expense, setExpense] = useState(false);
  const [plan, setPlan] = useState(false);
  const [inventory, setInventory] = useState(false);
  const [subcriptionPlan, setSubscriptionPlan] = useState([]);

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

 

  const value:any = {
    addNewModalVisible,
    bottomNavVisible,
    subcriptionPlan,
    loadingUserData,
    headerVisible,
    initializing,
    totalExpense,
    headerTitle,
    totalProfit,
    totalIncome,
    headerBack,
    inventory,
    introDone,
    userInfo,
    expenses,
    expense,
    isAdmin,
    curlang,
    isReady,
    onBack,
    sales,
    user,
    plan,
    setPlan,
    setUser,
    setSales,
    setOnBack,
    setIsAdmin,
    setIsReady,
    setCurlang,
    setExpense,
    setExpenses,
    setUserInfo,
    setIntroDone,
    setInventory,
    setHeaderBack,
    setHeaderTitle,
    SetTotalIncome,
    SetTotalProfit,
    setInitializing,
    setTotalExpense,
    setHeaderVisible,
    setLoadingUserData,
    setBottomNavVisible,
    setSubscriptionPlan,
    setAdNewModalVisible,
  };

  // Auth

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
    setIsReady(true);
  }
  // End  Auth

  //
  const getUserInfo = async () => {
    try {
      if (user)
        firestore()
          .collection('users')
          .where('phone', '==', user?.phoneNumber)
          .get()
          .then(res => {
            if (res.docs.length > 0) {
              // navigation.replace(routes.mainNavigator, {
              //   screen: routes.salesNav,
              // });
            } else {
              // setLoading(false);
            }
          })
          .catch(err => console.log(err));
    } catch (error) {
      console.log(error);
    }
    return;
  };

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
        .then((val:any) => setIntroDone(val.toString()))
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
    if (!initializing) {
      getUserInfo();
    }
  }, [user]);

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
