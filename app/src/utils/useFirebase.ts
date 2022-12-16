import {useEffect, useReducer, useState, useContext} from 'react';
import firestore from '@react-native-firebase/firestore';

const useFirebase = (user, userInfo, collection) => {
  const [data, setData]: Array<any> = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const subscriber = firestore()
      .collection(collection)
      .where('owner', '==', userInfo[0]?.doc?.companyId)
      .onSnapshot(querySnapshot => {
        let result: Array<Object> = [];
        querySnapshot.forEach(sn => {
          result.push({
            id: sn.id,
            doc: sn.data(),
          });
        });

        setData(result);
      });
    setLoading(false);
    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  return {data, setLoading, loading};
};

export default useFirebase;
