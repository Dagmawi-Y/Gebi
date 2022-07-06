import firestore from '@react-native-firebase/firestore';

const getInventory = async userid => {
  try {
    firestore()
      .collection('inventory')
      .where('owner', '==', userid)
      .onSnapshot(sn => {
        let result: Array<Object> = [];
        sn.forEach(documentSnapshot => {
          result.push({
            id: documentSnapshot.id,
            doc: documentSnapshot.data(),
          });
        });
        console.log(result);
        return result;
      });
  } catch (error) {
    console.log(error);
  }
};

export default getInventory;
