import React, {useState} from 'react';

const DataContext = React.createContext<any>(null);

function DataContextProvider({children}) {
  const [salesCount, setSalesCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0);
  const [planExpired, setPlanExpired] = useState(false);

  const values = {
    planExpired,
    salesCount,
    customerCount,
    supplierCount,
    setPlanExpired,
    setSalesCount,
    setCustomerCount,
    setSupplierCount,
  };

  return <DataContext.Provider value={values}>{children}</DataContext.Provider>;
}

export {DataContext, DataContextProvider};
