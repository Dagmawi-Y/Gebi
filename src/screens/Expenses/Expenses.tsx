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
  const [expandedList, setExpandedList] = useState(
    new Array(dates.length).fill(false),
  );

  const getExpenses = async () => {
    setLoading(true);
    try {
      firestore()
        .collection('expenses')
        .where('owner', '==', userInfo[0]?.doc?.companyId)
        .orderBy('date', 'desc')
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
    if (mounted && user) {
      getExpenses();
      calExpenses();
    }
    return () => {
      setMounted(false);
    };
  }, []);
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
              (userInfo[0]?.doc?.isFree && salesCount >= 100) ||
              (userInfo[0]?.doc?.isFree && customerCount >= 25) ||
              (userInfo[0]?.doc?.isFree && supplierCount >= 10)
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
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={getExpenses} />
            }
            contentContainerStyle={{
              marginBottom: 10,
              justifyContent: 'flex-end',
            }}>
            {expenses.length > 0 ? (
              dates.map(date => (
               
                <View key={date}>
                  <TouchableOpacity onPress={()=>{
                    const newList = [...expandedList];
                    newList[date] = !newList[date];
                    setExpandedList(newList);

                  setExpandedDate(!expandedDate)
                  }}  >
                   
                    <Text
                      style={{
                        color: colors.black,
                        fontSize: 15,
                        padding: 10,
                      }}>
                      {moment(date).format('DD-MM-YYYY')}
                    </Text>
                
                  </TouchableOpacity>

             {
                 !(new Date(date).getDate() - new Date().getDate()==0)?             
               expandedList[date]&&             
               expenses
                    .filter(
                      exp => exp.data.date == date)
                    .map(i => {                     
                      return <ExpenseListItem key={i.id} t={t} item={i} />;
                    }
                    )    
                  : expenses
                  .filter(
                    exp => exp.data.date == date)
                  .map(i => {                     
                    return <ExpenseListItem key={i.id} t={t} item={i} />;
                  }
                  )            
                  }
                  
                </View>
              )
              )
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
    
  )
};

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
