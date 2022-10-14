import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import colors from '../../config/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ListItem, Text} from '@rneui/themed';

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

  const getExpenses = async () => {
    setLoading(true);
    try {
      firestore()
        .collection('expenses')
        .where('owner', '==', userInfo[0].doc.companyId)
        .onSnapshot(querySnapshot => {
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
            setExpenses(result);
          }
        });

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
        .where('owner', '==', userInfo[0].doc.companyId)
        .onSnapshot(qsn => {
          qsn.forEach(sn => {
            total += parseFloat(sn.data().amount);
          });
          setTotalExpense(total);
        });
    }
  };

  useEffect(() => {
    if (mountedRef && user) {
      getExpenses();
      calExpenses();
    }
    return () => {
      mountedRef.current = false;
    };
  }, []);

  if (loading) return <StatusBox msg="Loading..." overlay={false} />;

  return (
    <>
      <SafeAreaView style={styles.container}>
        <FloatingButton
          action={() => navigation.navigate(routes.addNewExpense)}
          value={'addNewModalVisible'}
        />

        <TopScreen />
        <View style={styles.contentContainer}>
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

          <ScrollView contentContainerStyle={{marginBottom: 10}}>
            {expenses.length > 0 ? (
              dates.map(date => (
                <View key={date}>
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: 18,
                      padding: 10,
                    }}>
                    {date}
                  </Text>
                  {expenses
                    .filter(exp => exp.data.date == date)
                    .map(i => {
                      return (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          style={styles.expenseListItem}
                          key={i.id}>
                          <View>
                            <Text
                              style={{
                                color: colors.black,
                                fontSize: 18,
                                fontWeight: '700',
                              }}>
                              {t(i.data.expenseName)}
                            </Text>
                          </View>
                          <View style={{alignItems: 'flex-end'}}>
                            <Text
                              style={{color: colors.red, fontWeight: '700'}}>
                              -{i.data.amount} {t('Birr')}
                            </Text>
                            <Text
                              style={{
                                color: colors.faded_grey,
                                fontWeight: '500',
                              }}>
                              {i.data.date}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
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
                    fontSize: 18,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
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
    flexDirection: 'row',
    elevation: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 22,
    fontWeight: '900',
    color: colors.black,
  },
  boardSubTitle: {color: colors.grey, fontWeight: 'bold', fontSize: 12},
});
