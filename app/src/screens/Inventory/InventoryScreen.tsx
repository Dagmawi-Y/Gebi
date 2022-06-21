import {
  View,
  StatusBar,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../config/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, SpeedDial, Text} from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';

// import Modal from 'react-native-modal';
import TopBar from '../../components/TopBar/TopBar';
import Loading from '../../components/lotties/Loading';
import EmptyBox from '../../components/lotties/EmptyBox';
import InvetoryListItem from './InventoryListItem';
import AddNew from './AddNew';

export default function Items({navigation}: any) {
  const [data, setData]: Array<any> = useState([]);
  const [loading, setLoading] = useState(true);

  const getInventory = async () => {
    setLoading(true);
    try {
      let subscriber = firestore()
        .collection('inventory')
        .onSnapshot(querySnapshot => {
          let result: Array<Object> = [];
          querySnapshot.forEach(documentSnapshot => {
            result.push({
              id: documentSnapshot.id,
              doc: documentSnapshot.data(),
            });
          });
          setData(result);
        });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // let dimensions = Dimensions.get('window');
  // const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    // setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    getInventory();
  }, []);

  return (
    <>
      {/* <Modal isVisible={true} avoidKeyboard>
          <AddNew toggleModal={toggleModal} />
        </Modal> */}
      <SafeAreaView style={styles.container}>
        <TopBar
          title={'የእቃ ክፍል'}
          income={''}
          expense={''}
          calc={false}
          totalCost={'234,008 ብር'}
          totalItem={'314'}
        />

        <View style={styles.contentContainer}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 5,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                color: colors.faded_dark,
              }}>
              ያሉ አቃዎች
            </Text>
            <TouchableOpacity style={styles.buttonwithIcon}>
              <Image
                source={require('./qr_icon.png')}
                style={{width: 20, height: 20}}></Image>
              <Text
                style={{
                  color: colors.black,
                }}>
                Print QR
              </Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <Loading size={40} />
          ) : (
            <View>
              {data ? (
                <ScrollView style={{marginBottom: 248}}>
                  {data.map((item, i) => {
                    return (
                      <InvetoryListItem
                        key={i}
                        title={item.doc.item_name}
                        unitPrice={item.doc.unit_price}
                        amount={item.doc.amount}
                      />
                    );
                  })}
                </ScrollView>
              ) : (
                <EmptyBox message={'Inventory Empty'} />
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
  },
  boardContainer: {
    marginHorizontal: 5,
    marginVertical: 20,
    backgroundColor: 'white',
    height: 80,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  boardCol: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonwithIcon: {
    backgroundColor: colors.lightBlue,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    width: '25%',
    padding: 10,
    gap: 2,
  },
  boardTopTitle: {fontSize: 22, fontWeight: '900'},
  boardSubTitle: {color: colors.grey, fontWeight: 'bold', fontSize: 12},
});
