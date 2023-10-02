import {View, StyleSheet, Text} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import colors from '../../config/colors';
import Icon from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {StateContext} from '../../global/context';
import {useTranslation} from 'react-i18next';
import StatCard from '../statCards/StatCard';
import StatCardFullWidth from '../statCards/StatCardFullWidth';
import formatNumber from '../../utils/formatNumber';
import firestore from '@react-native-firebase/firestore';
import roundDecimal from '../../utils/roundDecimal';

export default function TopScreen() {
  const {t} = useTranslation();
  const {
    user,
    totalExpense,
    totalProfit,
    totalIncome,
    setTotalExpense,
    userInfo,
    SetTotalProfit,
    SetTotalIncome,
    expenses,
    setExpenses,
  } = useContext(StateContext);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSaleExpense, setTotalSaleExpense] = useState(0);
  const [mounted, setMounted] = useState(true);

  const totalCalc = data => {
    let totalSaleIncome = 0;
    let totalSaleProfit = 0;
    let tsaleExp = 0;
    if (data) {
      data.forEach(i => {
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
      });
      setTotalSaleExpense(tsaleExp);
      SetTotalProfit(totalSaleProfit - expenses);
      SetTotalIncome(totalSaleIncome);
    }
  };

  const getExpenses = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('expenses')
        .where('owner', '==', userInfo[0]?.doc?.companyId)
        .get();

      let expAmount = 0;
      querySnapshot.forEach(doc => {
        expAmount += parseFloat(doc.data().amount);
      });

      setExpenses(expAmount);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getSales = async () => {
    if (!user) return;
    try {
      const querySnapshot = await firestore()
        .collection('sales')
        .where('owner', '==', userInfo[0]?.doc?.companyId)
        .get();

      let result: any = [];
      querySnapshot.forEach(doc => {
        if (doc.data().shouldDiscard === false) {
          const item = {
            id: doc.id,
            date: doc.data().date,
            customerName: doc.data().customerName,
            invoiceNumber: doc.data().invoiceNumber,
            items: doc.data().items,
            paymentMethod: doc.data().paymentMethod,
            vat: doc.data().vat,
            tot: doc.data().tot,
          };
          result.push(item);
        }
      });
      setData(result);
      totalCalc(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      getExpenses();
    }
    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (mounted) {
      if (data.length > 0) {
        totalCalc(data);
      }
      getSales();
    }
    return () => {
      setMounted(false);
    };
  }, [data]);

  // Periodically refresh data
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      getExpenses();
      getSales();
    }, 1000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  if (loading) return null;

  return (
    <View style={styles.topBar}>
      <View style={{marginVertical: 0, marginHorizontal: 10}}>
        <View style={styles.statContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <StatCard
              label={t('Income')}
              value={totalIncome}
              trend="positive"
            />

            <StatCard
              label={t('Expense')}
              value={(expenses + totalSaleExpense).toString()}
              trend="negative"
            />
          </View>
          <View style={{marginVertical: 10}}>
            <StatCardFullWidth
              label={t('Profit')}
              value={parseFloat(totalProfit) - parseFloat(expenses)}
              trend={
                totalProfit > 0
                  ? 'positive'
                  : totalProfit < 0
                  ? 'negative'
                  : 'neutral'
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: colors.primary,
  },
  topBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
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
