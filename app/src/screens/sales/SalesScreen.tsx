import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Pressable,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text} from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/AntDesign';
import {StateContext} from '../../global/context';

import TopBar from '../../components/TopBar/TopBar';
import Loading from '../../components/lotties/Loading';
import EmptyBox from '../../components/lotties/EmptyBox';
import colors from '../../config/colors';
import routes from '../../navigation/routes';
import SalesListItem from './SalesListItem';
import StatCard from '../../components/statCards/StatCard';
import StatCardFullWidth from '../../components/statCards/StatCardFullWidth';
import FloatingButton from '../../components/FloatingButton/FloatingButton';

// import AddNew from './AddNew';

export default function Items({navigation}) {
  const {user} = useContext(StateContext);

  const [data, setData]: Array<any> = useState([]);
  const [filter, setFilter]: Array<any> = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchVisible, setSearchVisible] = useState(false);

  const [searchKey, setSearchKey] = useState('');
  const [sumPrice, setSumPrice] = useState('0');
  const [totalItems, setTotalItems] = useState('0');

  const formatNumber = num => {
    return String(num.toString()).replace(/(.)(?=(\d{3})+$)/g, '$1,');
  };

  // const reCalculate = dt => {
  //   let sumItem = 0;
  //   let sumItemPrice = 0;
  //   dt.map(it => {
  //     sumItem += parseFloat(it.doc.stock.quantity);
  //     sumItemPrice +=
  //       parseFloat(it.doc.stock.quantity) * parseFloat(it.doc.stock.unit_price);
  //   });

  //   setTotalItems(formatNumber(sumItem));
  //   setSumPrice(formatNumber(sumItemPrice));
  // };

  const getSales = async () => {
    setLoading(true);
    try {
      firestore()
        .collection('sales')
        .where('owner', '==', user.uid)
        .onSnapshot(querySnapshot => {
          let result: Array<Object> = [];
          querySnapshot.forEach(sn => {
            const item = {
              id: sn.id,
              customerName: sn.data().customerName,
              invoiceNumber: sn.data().invoiceNumber,
              date: sn.data().date,
              items: sn.data().items,
              owner: sn.data().owner,
              paymentMethod: sn.data().paymentMethod,
            };
            result.push(item);
          });
          setData(result);
        });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const onSnapshot = async () => {
    let result: Array<Object> = [];
    try {
      firestore()
        .collection('users')
        .doc(user.uid)
        .collection('inventory')
        .onSnapshot(sn => {
          sn.forEach(r => {
            const id = r.id;
            const doc = r.data();
            result.push({
              id,
              doc,
            });
          });
          setData(result);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getSales();
    // onSnapshot()
  }, []);

  return (
    <>
      <FloatingButton
        action={() => navigation.navigate(routes.newSale)}
        value={''}
      />
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={colors.primary}
        />

        <ScrollView>
          {/* <AddNew /> */}
          <TopBar
            title={'የእቃ ክፍል'}
            action={setSearchVisible}
            actionValue={searchVisible}>
            <View style={topCard.statContainer}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 1, marginRight: 2}}>
                  <StatCard label="ገቢ" value={'65621'} trend="positive" />
                </View>
                <View style={{flex: 1, marginLeft: 2}}>
                  <StatCard label="ወጪ" value={'99451'} trend="negative" />
                </View>
              </View>
              <View style={{marginVertical: 10}}>
                <StatCardFullWidth
                  label="የቀኑ ትርፍ"
                  // value={aggregate.toString()}
                  value={'65451'}
                  // trend={aggregate > 0 ? 'positive' : 'negative'}
                  trend={'negative'}
                />
              </View>
            </View>
          </TopBar>

          {/* Search Input */}
          {searchVisible && (
            <View
              style={{
                width: '80%',
                alignSelf: 'flex-end',
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 10,
                marginVertical: 5,
                marginHorizontal: 10,
                backgroundColor: colors.white,
                paddingHorizontal: 10,
                borderWidth: 1,
              }}>
              <TextInput
                style={{
                  backgroundColor: colors.white,
                  flexGrow: 1,
                  height: 40,
                  fontSize: 20,
                  color: colors.black,
                }}
                selectionColor="black"
                placeholder="search..."
                onChangeText={val => setSearchKey(val)}
                value={searchKey}
                keyboardType="default"
                placeholderTextColor={colors.faded_grey}
              />
              <Icon name="search1" size={25} color={colors.primary} />
            </View>
          )}
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

              {/* <TouchableOpacity
                style={styles.buttonwithIcon}
                onPress={() => navigation.navigate(routes.newSale)}>
                <Icon name={'plus'} color={colors.black} size={20} />
                <Text
                  style={{
                    color: colors.black,
                  }}>
                  Add New
                </Text>
              </TouchableOpacity> */}
            </View>
            {loading ? (
              <Loading size={100} />
            ) : (
              <ScrollView>
                {data.length == 0 ? (
                  <EmptyBox message={'No sales yet.'} />
                ) : data.length > 0 ? (
                  <View>
                    {data.map(sale => {
                      return (
                        <TouchableOpacity
                          activeOpacity={0.5}
                          key={sale.id}
                          onPress={() => {
                            const id = sale.id;
                            navigation.navigate(routes.itemDetails, {
                              data: sale.doc,
                              itemId: id,
                            });
                          }}>
                          <SalesListItem sale={sale} />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : null}
              </ScrollView>
            )}
          </View>
        </ScrollView>
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
  Input: {
    color: colors.black,
    height: 50,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    fontSize: 20,
    marginBottom: 20,
  },
  boardTopTitle: {fontSize: 22, fontWeight: '900'},
  boardSubTitle: {color: colors.grey, fontWeight: 'bold', fontSize: 12},
});

const topCard = StyleSheet.create({
  statContainer: {
    marginTop: 10,
  },

  // Typetwo
  boardContainer: {
    marginVertical: 5,
    backgroundColor: 'white',
    height: 80,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  boardCol: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  boardTopTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.black,
  },
  boardSubTitle: {color: colors.grey, fontWeight: 'bold', fontSize: 12},
});
