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
  const {user} = useContext(StateContext);
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
              date: sn.data().date,
              customerName: sn.data().customerName,
              invoiceNumber: sn.data().invoiceNumber,
              items: sn.data().items,
              paymentMethod: sn.data().paymentMethod,
              saleProfit: sn.data().saleProfit,
              vat: sn.data().vat,
              tot: sn.data().tot,
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

  const getStockCount = () => {
    firestore()
      .collection('inventory')
      .where('owner', '==', user.uid)
      .get()
      .then(snap => {
        setStockCount(snap.size);
      });
  };

  useEffect(() => {
    let mounted = true;
    if (mounted && user) {
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
                  fontSize: 18,
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
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 18,
                  paddingHorizontal: 5,
                  color: colors.faded_dark,
                }}>
                {t('Sales')}
              </Text>

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
                        fontSize: 18,
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
                      fontSize: 18,
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
                                fontSize: 18,
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

                <ScrollView style={{zIndex: -1}}>
                  {data.length == 0 ? (
                    <EmptyBox message={t('No_Sales_Yet')} />
                  ) : data.length > 0 ? (
                    <View
                      style={{backgroundColor: colors.white, elevation: 10}}>
                      {data
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
                                const id = sale.id;
                                navigation.navigate (routes.saleDetails, {
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
                  ) : null}
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
    fontSize: 18,
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
