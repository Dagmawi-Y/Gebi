import {
  View,
  StatusBar,
  StyleSheet,
  Dimensions,
  Button,
  TouchableHighlight,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import colors from '../../config/colors';
import {SafeAreaView, useSafeAreaFrame} from 'react-native-safe-area-context';
import {ListItem, SpeedDial, Text} from '@rneui/themed';
import { CheckBox, color } from '@rneui/base';
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
import { ScrollView, TextInput } from 'react-native-gesture-handler';

export default function PlanerScreen({navigation}: any) {
  const {t} = useTranslation();
  const {user, userInfo} = useContext(StateContext);
  const [userData, setUserData]: Array<any> = useState([]);
  const [loading, setLoading] = useState(false);
  const {totalExpense, setTotalExpense} = useContext(StateContext);
  const {totalProfit, SetTotalProfit} = useContext(StateContext);
  const {totalIncome, SetTotalIncome} = useContext(StateContext);
  const [shouldShowPlanChanger, setShouldShowPlanChanger] = useState(false);
  const [newPlan, setNewPlan] = useState("");

  const getUserData = async () => {
    setLoading(true);
    try {
      firestore()
        .collection('users')
        .where('companyId', '==', user.uid)
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

  const toggleShouldShowPlanChanger = () =>{
    setShouldShowPlanChanger(!shouldShowPlanChanger);
  }

  useEffect(() => {
    getUserData();
  }, []);

  const updatePlan = async () =>{
    const querySnapshot =  await firestore()
    .collection('users')
    .where('companyId', '==', user.uid).get();
    if (!querySnapshot.empty) {
      querySnapshot.forEach(sn => {
        firestore().collection('users').doc(sn.id).update({
          financial : newPlan
        }).then(() =>{
          ToastAndroid.show("Plan Updated", ToastAndroid.SHORT);
          setShouldShowPlanChanger(false);
        }).catch((error) => {
          ToastAndroid.show("Error Updating Plan", ToastAndroid.SHORT);
        });
    });
    } else {
      ToastAndroid.show("User not found", ToastAndroid.SHORT);
    }

  }
  if (!userData.length) return null;

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView>
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
                  fontSize: 15,
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
                  value={totalIncome}
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
                  fontSize: 15,
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
                  value={totalExpense}
                  trend="negative"
                  labelStyle={{color: 'black'}}
                />
              </View>
            </View>
          </View>

          <CheckBox
              style={{marginTop : 10}}
                title="Change Income Plan"
                checked={shouldShowPlanChanger}
                onPress={toggleShouldShowPlanChanger}
          /> 


{shouldShowPlanChanger ? <View style={{marginLeft : 21, marginRight : 40}}>
            <TextInput
              style={styles.input}
              onChangeText={(value: any) => setNewPlan(value)}
              value={newPlan.toString()}
              placeholder={"Income"}
              placeholderTextColor={colors.black}
            />

            <TouchableOpacity
            style={[{backgroundColor: colors.green, height : 40, borderRadius : 10, marginLeft : 10, marginTop : 5}]}
            onPress={updatePlan}>
            <Text
              style={[
                {color: colors.white, textAlign: 'center', marginTop : 8},
              ]}>
              {"Update"}
            </Text>
          </TouchableOpacity>
         </View> : <View></View> }

        </View>
        </ScrollView>
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

  button: {
    height: 45,
    flex: 0.3,
    marginLeft: 15,
    alignSelf: 'center',
    paddingHorizontal: 20,
    justifyContent: 'center',
    width: 'auto',
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
  },
  input: {
    marginTop : 5,
    marginBottom : 10,
    width: 350,
    height: 50,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'black',
    paddingLeft : 5,
    color : colors.black
  
},
});
