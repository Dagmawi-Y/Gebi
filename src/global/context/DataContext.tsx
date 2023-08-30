import React, {useState} from 'react';

const DataContext = React.createContext<any>(null);

function DataContextProvider({children}) {
  const [salesCount, setSalesCount] = useState(0);
  const [totalPriceValue, setTotalPriceValue] = useState(0);
  const [totalSumValue,setTotalSumValue]=useState(0);
  const [totalTaxValue,setTotalTaxValue]=useState(0);

  const [customerCount, setCustomerCount] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0);
  const [planExpired, setPlanExpired] = useState(false);

  const values = {
    planExpired,
    salesCount,
    totalPriceValue,
    customerCount,
    supplierCount,
    totalSumValue,
    totalTaxValue,
    setPlanExpired,
    setSalesCount,
    setTotalPriceValue,
    setCustomerCount,
    setTotalSumValue,
    setSupplierCount,
    setTotalTaxValue
  };

  return <DataContext.Provider value={values}>{children}</DataContext.Provider>;
}

export {DataContext, DataContextProvider};
