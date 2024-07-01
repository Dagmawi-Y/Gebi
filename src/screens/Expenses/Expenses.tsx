import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import colors from '../../config/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ListItem, Text} from '@rneui/themed';
import moment from 'moment';

import {ExpenseTypes, getIconForExpenseType} from './expenseTypes';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import TopScreen from '../../components/TopScreen/TopScreen';
import StatCard from '../../components/statCards/StatCard';
import StatCardFullWidth from '../../components/statCards/StatCardFullWidth';
import {StateContext} from '../../global/context';
import {useTranslation} from 'react-i18next';

import formatNumber from '../../utils/formatNumber';
import FloatingButton from '../../components/FloatingButton/FloatingButton';
import routes from '../../navigation/routes';
import firestore from '@react-native-firebase/firestore';
import StatusBox from '../../components/misc/StatusBox';
import {ExpiredModal, FreeLimitReached} from '../sales/LimitReached';
import {DataContext} from '../../global/context/DataContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Expenses({navigation}: any) {
  const mountedRef = useRef(true);
  const {setTotalExpense, userInfo} = useContext(StateContext);
  const {t} = useTranslation();
  const {user, totalExpense, totalProfit, totalIncome} =
    useContext(StateContext);
  const [expenses, setExpenses]: Array<any> = useState([]);

  const [dates, setDates]: Array<any> = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [data, setData]: Array<any> = useState(false);
  const [totalSaleExpense, setTotalSaleExpense] = useState(0);

  const [expandedList, setExpandedList] = useState(
    new Array(dates.length).fill(false),
  );

  const loadTotalSaleExpense = async () => {
    try {
      const savedTotalSaleExpense = await AsyncStorage.getItem(
        'totalSaleExpense',
      );
      if (savedTotalSaleExpense !== null) {
        setTotalSaleExpense(parseFloat(savedTotalSaleExpense));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveTotalSaleExpense = async value => {
    try {
      await AsyncStorage.setItem('totalSaleExpense', value.toString());
    } catch (error) {
      console.log(error);
    }
  };

  const totalCalc = data => {
    let totalSaleIncome = 0;
    let totalSaleProfit = 0;
    let tsaleExp = 0;
    if (data) {
      data.forEach(i => {
        if (i.items) {
          // Check if 'items' property exists
          Object.keys(i.items).map(key => {
            totalSaleIncome =
              totalSaleIncome +
              parseFloat(i.items[key].unitSalePrice) *
                parseFloat(i.items[key].quantity);

            tsaleExp =
              tsaleExp +
              parseFloat(i.items[key].unitPrice) *
                parseFloat(i.items[key].quantity);
            totalSaleProfit =
              totalSaleProfit + parseFloat(i.items[key].saleProfit);
          });
          if (i.vat && !i.tot) {
            totalSaleIncome = totalSaleIncome + totalSaleIncome * 0.15;
          }
          if (i.tot && !i.vat) {
            totalSaleIncome = totalSaleIncome + totalSaleIncome * 0.02;
          }
          if (i.tot && i.vat) {
            totalSaleIncome =
              totalSaleIncome + totalSaleIncome * 0.02 + totalSaleIncome * 0.15;
          }
        }
      });
      setTotalSaleExpense(tsaleExp);
    }
  };

  const getExpenses = async () => {
    setLoading(true);
    try {
      const expensesRef = firestore()
        .collection('expenses')
        .where('owner', '==', userInfo[0]?.doc?.companyId)
        .orderBy('date', 'desc');

      // Subscribe to real-time updates
      const unsubscribe = expensesRef.onSnapshot(querySnapshot => {
        let result: Array<Object> = [];
        let dates: Array<Object> = [];
        if (querySnapshot) {
          querySnapshot.forEach(sn => {
            result.push({
              id: sn.id,
              data: sn.data(),
            });

            !dates.includes(sn.data().date) && dates.push(sn.data().date);
          });
          setDates(dates);
          setData(result);
          setExpenses(result);
          console.log(result);
        }
      });

      return unsubscribe; // Return the unsubscribe function
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getSales = async () => {
    setLoading(true);
    if (!user) return;
    try {
      firestore()
        .collection('sales')
        .where('owner', '==', userInfo[0]?.doc?.companyId)
        .onSnapshot(querySnapshot => {
          let result: Array<Object> = [];
          querySnapshot.forEach(sn => {
            if (sn.data().shouldDiscard == false) {
              const item = {
                id: sn.id,
                date: sn.data().date,
                customerName: sn.data().customerName,
                invoiceNumber: sn.data().invoiceNumber,
                items: sn.data().items,
                paymentMethod: sn.data().paymentMethod,
                vat: sn.data().vat,
                tot: sn.data().tot,
              };
              result.push(item);
            }
          });
          setData(result);
        });

      totalCalc(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const calExpenses = () => {
    let total = 0;
    if (user) {
      setTotalExpense(total);
      firestore()
        .collection('expenses')
        .where('owner', '==', userInfo[0]?.doc?.companyId)
        .onSnapshot(qsn => {
          qsn.forEach(sn => {
            total += parseFloat(sn.data().amount);
          });
          setTotalExpense(total);
        });
    }
  };

  useEffect(() => {
    loadTotalSaleExpense();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      totalCalc(data);
      saveTotalSaleExpense(totalSaleExpense); // Save the updated value
    }
  }, [data]);

  useEffect(() => {
    if (mounted) {
      if (user) {
        getExpenses();
        calExpenses();
      }

      if (data.length > 0) {
        totalCalc(data);
      }

      getSales();
    }

    return () => {
      setMounted(false);
    };
  }, [mounted, user, data]);

  // useEffect(() => {
  //   if (mounted && user) {
  //     // Call getExpenses to initially fetch the expenses
  //     const unsubscribe = getExpenses();

  //     // Clean up the snapshot listener when the component unmounts
  //     return () => {
  //       setMounted(false);
  //       unsubscribe(); // Call the unsubscribe function to remove the listener
  //     };
  //   }
  // }, [expenses]);

  const [limitReachedVisible, setLimitReachedVisible] = useState(false);
  const [expandedDate, setExpandedDate] = useState(true);

  const [expired, setExpired] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const {salesCount, setSalesCount, planExpired, customerCount, supplierCount} =
    useContext(DataContext);
  if (loading) return <StatusBox msg="Loading..." overlay={false} />;

  return (
    <>
      {limitReachedVisible ? (
        <FreeLimitReached
          setModalVisible={setLimitReachedVisible}
          navigation={navigation}
        />
      ) : null}

      {expired ? (
        <ExpiredModal setModalVisible={setExpired} navigation={navigation} />
      ) : null}

      <SafeAreaView style={styles.container}>
        <FloatingButton
          action={() => {
            if (
              (userInfo[0]?.doc?.isFree && salesCount >= 200) ||
              (userInfo[0]?.doc?.isFree && customerCount >= 150) ||
              (userInfo[0]?.doc?.isFree && supplierCount >= 100)
            ) {
              return setLimitReachedVisible(true);
            }
            if (!userInfo[0]?.doc?.isFree && planExpired) {
              return setLimitReachedVisible(true);
            }

            navigation.navigate(routes.addNewExpense);
          }}
          value={'addNewModalVisible'}
        />

        <TopScreen />
        <View style={styles.contentContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={[
                styles.textLight,
                {
                  paddingHorizontal: 8,
                },
              ]}>
              {t('Inventory Expenses')}
            </Text>

            <Text
              style={[
                styles.textBold,
                {textAlign: 'right', fontSize: 15, marginBottom: 10},
              ]}>
              {formatNumber(totalSaleExpense)} {t('Birr')}
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 5,
              paddingHorizontal: 18,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                color: colors.faded_dark,
                marginVertical: 5,
              }}>
              {t('Expenses')}
            </Text>
          </View>

          <ScrollView
            style={{}}
            // refreshControl={
            //   <RefreshControl refreshing={refreshing} onRefresh={getExpenses} />
            // }
            contentContainerStyle={{
              marginBottom: 10,
              justifyContent: 'flex-end',
            }}>
            {expenses.length > 0 ? (
              dates.map(date => (
                <View key={date}>
                  <TouchableOpacity
                    onPress={() => {
                      const newList = [...expandedList];
                      newList[date] = !newList[date];
                      setExpandedList(newList);
                      setExpandedDate(!expandedDate);
                    }}>
                    <Text
                      style={{
                        color: colors.black,
                        fontSize: 15,
                        padding: 10,
                      }}>
                      {moment(date, 'DD-MM-YYYY').format('DD-MM-YYYY')}
                    </Text>
                  </TouchableOpacity>

                  {!(new Date(date).getDate() - new Date().getDate() == 0)
                    ? expandedList[date] &&
                      expenses
                        .filter(exp => exp.data.date == date)
                        .map(i => {
                          return <ExpenseListItem key={i.id} t={t} item={i} />;
                        })
                    : expenses
                        .filter(exp => exp.data.date == date)
                        .map(i => {
                          return <ExpenseListItem key={i.id} t={t} item={i} />;
                        })}
                </View>
              ))
            ) : (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.white,
                  margin: 20,
                  paddingVertical: 30,
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    color: colors.black,
                    fontSize: 15,
                    fontWeight: '700',
                    textAlign: 'center',
                  }}>
                  {t('No_Expenses_Yet')}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}

const ExpenseListItem = ({item, t}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.expenseListItem}
      onPress={() => setExpanded(!expanded)}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={{
                color: colors.black,
                fontSize: 15,
                fontWeight: '700',
              }}>
              {t(item.data.expenseName)}
            </Text>
          </View>
          <View style={{}}>
            <Text style={{color: colors.red, fontWeight: '700'}}>
              -{item.data.amount} {t('Birr')}
            </Text>
            <Text
              style={{
                color: colors.faded_grey,
                fontWeight: '500',
              }}>
              {item.data.date}
            </Text>
          </View>
        </View>

        {expanded && item.data.note ? (
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text
              style={{
                color: colors.black,
                fontSize: 15,
                marginRight: 5,
                fontWeight: '700',
              }}>
              {t('Description')}
              {': '}
            </Text>
            <Text
              style={{
                color: colors.black,
                fontSize: 15,
                fontStyle: 'italic',
              }}>
              {t(item.data.note)}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
  textLight: {
    paddingHorizontal: 10,
    color: colors.faded_grey,
    fontWeight: '300',
    fontSize: 15,
  },
  textBold: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 15,
    paddingHorizontal: 10,
  },
  statContainer: {
    marginTop: 10,
  },
  contentContainer: {
    // paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  expenseListItem: {
    marginVertical: 5,
    backgroundColor: colors.white,
    flexDirection: 'column',
    elevation: 5,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 15,
  },
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
