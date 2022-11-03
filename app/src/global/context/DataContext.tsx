import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useTranslation} from 'react-i18next';

const DataContext = React.createContext<any>(null);

function DataContextProvider({children}) {
  const [salesCount, setSalesCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0);

  const values = {
    salesCount,
    setSalesCount,
  };

  return <DataContext.Provider value={values}>{children}</DataContext.Provider>;
}

export {DataContext, DataContextProvider};
