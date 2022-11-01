import React, {useEffect, useState, useContext, useRef} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Pressable,
  StatusBar,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text} from '@rneui/themed';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/AntDesign';
import {StateContext} from '../../global/context';
import {useTranslation} from 'react-i18next';

import TopScreen from '../../components/TopScreen/TopScreen';
import Loading from '../../components/lotties/Loading';
import EmptyBox from '../../components/lotties/EmptyBox';
import colors from '../../config/colors';
import routes from '../../navigation/routes';
import SalesListItem from './SalesListItem';
import StatCard from '../../components/statCards/StatCard';
import StatCardFullWidth from '../../components/statCards/StatCardFullWidth';
import FloatingButton from '../../components/FloatingButton/FloatingButton';

import useFirebase from '../../utils/useFirebase';
import formatNumber from '../../utils/formatNumber';

export default function Items({navigation}) {
  const {user, userInfo} = useContext(StateContext);
  const {t, i18n} = useTranslation();

  const [data, setData]: Array<any> = useState([]);
  const [stockCount, setStockCount]: any = useState();

  const [loading, setLoading] = useState(true);
  const [searchVisible, setSearchVisible] = useState(false);

  const [searchKey, setSearchKey] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const progress = useRef(new Animated.Value(0)).current;

  const animate = val => {
    let to = !filterVisible ? 1 : 0;
    Animated.spring(progress, {
      toValue: to,
      useNativeDriver: true,
    }).start();
  };

  const dateConverter: any = d => {
    const dateMonth = new Date(d).getMonth();
    const thisMonth = new Date().getMonth();
    if (
      new Date().getDate() - new Date(d).getDate() == 0 &&
      dateMonth == thisMonth
    )
      return 'Today';
    if (
      new Date().getDate() - new Date(d).getDate() == 1 &&
      dateMonth == thisMonth
    )
      return 'Yesterday';

    return new Date(d).toDateString();
  };

  const getSales = async () => {
    setLoading(true);

    firestore()
      .collection('sales')
      .where('owner', '==', userInfo[0].doc.companyId)

      .onSnapshot(querySnapshot => {
        let result: any = [];
        if (querySnapshot)
          querySnapshot.docs.forEach(sn => {
            const item = {
              id: sn.id,
              date: sn.data().date,
              customerName: sn.data().customerName,
              invoiceNumber: sn.data().invoiceNumber,
              items: sn.data().items,
              paymentMethod: sn.data().paymentMethod,
              saleProfit: sn.data().saleProfit,
              createdBy: sn.data().createdBy,
              vat: sn.data().vat,
              tot: sn.data().tot,
            };
            result.push(item);
          });

        const grouped = result.reduce(function (r, a) {
          r[a.date] = r[a.date] || [];
          r[a.date].push(a);
          return r;
        }, {});

        console.log(grouped);

        // SORT EXPERIMENT
        // const sortable = Object.fromEntries(
        //   Object.entries(grouped).sort(([, a], [, b]) => a - b),
        // );
        // console.log(
        //   '=============-------------===============================\n',
        //   sortable,
        // );
        // SORT EXPERIMENT

        setData(grouped);
        setLoading(false);
      });
  };

  const getStockCount = () => {
    firestore()
      .collection('inventory')
      .where('owner', '==', userInfo[0].doc.companyId)
      .get()
      .then(snap => {
        setStockCount(snap.size);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    let mounted = true;
    if (mounted && userInfo) {
      getSales();
      getStockCount();
    }

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <FloatingButton
        action={() => {
          if (stockCount > 0) {
            navigation.navigate(routes.newSale);
          } else {
            Alert.alert(
              t('There_Is_No_Item_In_Your_Stock'),
              t('Please_Add_Stock_First'),
              [
                {
                  text: `+ ${t('Add_Stock_Item')}`,
                  onPress: () => {
                    navigation.navigate(t(routes.inventoryNav));
                  },
                  style: 'default',
                },
                {
                  text: t('Cancel'),
                  onPress: () => {},
                  style: 'default',
                },
              ],
            );
          }
        }}
        value={''}
      />
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={colors.primary}
        />

        <ScrollView>
          <TopScreen />
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
                  fontSize: 15,
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
                paddingVertical: 3,
                borderBottomWidth: 0.5,
                borderBottomColor: '#00000040',
                zIndex: 10,
              }}>
              <TouchableOpacity onPress={() => {}}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    paddingHorizontal: 5,
                    color: colors.faded_dark,
                  }}>
                  {t('Sales')}
                </Text>
              </TouchableOpacity>

              {/* Filter button and filter Tag*/}
              <View style={{flexDirection: 'row', marginRight: 10}}>
                {filterValue ? (
                  <View
                    style={{
                      backgroundColor: colors.primary,
                      flexDirection: 'row',
                      paddingHorizontal: 5,
                      paddingVertical: 2,
                      marginRight: 10,
                      borderRadius: 10,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: colors.white,
                        fontSize: 15,
                        alignItems: 'center',
                      }}>
                      {t(filterValue)}
                      {'  '}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setFilterValue('');
                      }}
                      style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon name="close" color={colors.white} size={20} />
                    </TouchableOpacity>
                  </View>
                ) : null}
                <TouchableOpacity
                  onPress={() => {
                    setFilterVisible(!filterVisible);
                    animate(!filterVisible);
                  }}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: 15,
                      marginRight: 10,
                    }}>
                    {t('Filter')}
                  </Text>

                  <Icon name="caretdown" color={colors.black} size={15} />
                </TouchableOpacity>
              </View>
            </View>
            {loading ? (
              <Loading size={100} />
            ) : (
              <>
                {filterVisible ? (
                  <View
                    style={{
                      width: '30%',
                      justifyContent: 'space-between',
                      marginLeft: 'auto',
                    }}>
                    {['Cash', 'Debt', 'Check'].map(i => {
                      return (
                        <TouchableOpacity
                          key={i}
                          onPress={() => {
                            setFilterValue(i);
                            setFilterVisible(!filterVisible);
                          }}>
                          <Text
                            style={[
                              filterValue == i
                                ? {backgroundColor: colors.faded_dark}
                                : {backgroundColor: colors.primary},
                              {
                                textAlign: 'center',
                                color: colors.white,
                                marginVertical: 5,
                                borderRadius: 10,
                                fontSize: 15,
                                marginRight: 10,
                              },
                            ]}>
                            {t(i)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : null}

                <ScrollView style={{flex: 1}}>
                  {!Object.keys(data).length ? (
                    <EmptyBox message={t('No_Sales_Yet')} />
                  ) : (
                    <View style={{flex: 1}}>
                      {Object.keys(data).map(i => {
                        return (
                          <View key={i}>
                            <Text
                              style={{
                                color: colors.primary,
                                marginVertical: 5,
                              }}>
                              {/* {new Date(i).getDate() - new Date().getDate()} */}
                              {dateConverter(i)}
                            </Text>
                            {data[i]
                              .filter(saleItem => {
                                if (!filterValue) return saleItem;
                                return (
                                  saleItem.paymentMethod.toLowerCase() ===
                                  filterValue.toLowerCase()
                                );
                              })
                              .map(sale => {
                                return (
                                  <TouchableOpacity
                                    activeOpacity={0.5}
                                    key={sale.id}
                                    onPress={() => {
                                      navigation.navigate(routes.saleDetails, {
                                        data: sale,
                                      });
                                    }}>
                                    <SalesListItem
                                      sale={sale}
                                      navigation={navigation}
                                    />
                                  </TouchableOpacity>
                                );
                              })}
                          </View>
                        );
                      })}
                    </View>
                  )}
                </ScrollView>
              </>
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
    backgroundColor: colors.white,
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
    fontSize: 15,
    marginBottom: 20,
  },
  boardTopTitle: {fontSize: 20, fontWeight: '900'},
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
    fontSize: 20,
    fontWeight: '900',
    color: colors.black,
  },
  boardSubTitle: {color: colors.grey, fontWeight: 'bold', fontSize: 12},
});
