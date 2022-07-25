import {
  View,
  StatusBar,
  StyleSheet,
  Dimensions,
  Button,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import colors from '../../config/colors';
import {SafeAreaView, useSafeAreaFrame} from 'react-native-safe-area-context';
import {ListItem, SpeedDial, Text} from '@rneui/themed';
import StatCard from '../../components/statCards/StatCard';
import StatCardFullWidth from '../../components/statCards/StatCardFullWidth';
import Modal from 'react-native-modal';

import {ExpenseTypes, getIconForExpenseType} from '../Expenses/expenseTypes';
// import AddItemModal from '../../Components/Items/AddItemModal';
import PlanStatCard from './PlanStatCard';
import useFirebase from '../../utils/useFirebase';
import {StateContext} from '../../global/context';

import firestore from '@react-native-firebase/firestore';
import {useTranslation} from 'react-i18next';
import formatNumber from '../../utils/formatNumber';
import TopScreen from '../../components/TopScreen/TopScreen';

export default function PlanerScreen({navigation}: any) {
  const {t} = useTranslation();
  const {user} = useContext(StateContext);
  const [userData, setUserData]: Array<any> = useState([]);
  const [loading, setLoading] = useState(false);
  const {totalExpense, setTotalExpense} = useContext(StateContext);
  const {totalProfit, SetTotalProfit} = useContext(StateContext);
  const {totalIncome, SetTotalIncome} = useContext(StateContext);

  const getUserData = async () => {
    setLoading(true);
    try {
      firestore()
        .collection('users')
        .where('userId', '==', user.uid)
        .onSnapshot(querySnapshot => {
          let result: Array<Object> = [];
          querySnapshot.forEach(sn => {
            const item = {
              financial: sn.data().financial,
              name: sn.data().name,
              orgName: sn.data().orgName,
              plan: sn.data().plan,
              userId: sn.data().userId,
            };
            result.push(item);
          });
          setUserData(result);
        });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  if (!userData.length) return null;

  return (
    <>
      <SafeAreaView style={styles.container}>
        <TopScreen />
        <View
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 5,
          }}>
          <View style={{marginVertical: 20, marginHorizontal: 10}}>
            <Text h4 style={{color: 'white'}}>
              የገቢ እቅድ
            </Text>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.planBoard}>
            <View style={{flexDirection: 'row', marginBottom: 5}}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                {t('Income')}
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginBottom: 5}}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'space-between',
                }}>
                <PlanStatCard
                  label={t('Plan')}
                  value={formatNumber(userData[0].financial)}
                  trend="positive"
                  labelStyle={{color: 'black'}}
                />
                <PlanStatCard
                  label={t('Current')}
                  value={formatNumber(totalIncome)}
                  trend="negative"
                  labelStyle={{color: 'black'}}
                />
              </View>
            </View>
          </View>
          <View style={styles.planBoard}>
            <View style={{flexDirection: 'row', marginBottom: 5}}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                {t('Expense')}
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginBottom: 5}}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'space-between',
                }}>
                <PlanStatCard
                  label={t('Plan')}
                  value="-"
                  trend="positive"
                  labelStyle={{color: 'black'}}
                />
                <PlanStatCard
                  label={t('Current')}
                  value={formatNumber(totalExpense)}
                  trend="negative"
                  labelStyle={{color: 'black'}}
                />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
  },
  planBoard: {
    backgroundColor: 'white',
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
  },
});
