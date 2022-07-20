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

export default function TopBar() {
  const {t} = useTranslation();
  const {
    user,
    totalExpense,
    totalProfit,
    totalIncome,
    setTotalExpense,
    SetTotalProfit,
    SetTotalIncome,
  } = useContext(StateContext);

  const [data, setData]: Array<any> = useState(false);
  const [loading, setLoading] = useState(false);

  const totalCalc = data => {
    let totalSaleIncome: number = 0;
    let totalSaleProfit: number = 0;
    let totalSaleExpense: number = 0;

    data.forEach(i => {
      Object.keys(i.items).map(key => {
        totalSaleIncome =
          totalSaleIncome +
          parseFloat(i.items[key].unitPrice) *
            parseFloat(i.items[key].quantity);

        totalSaleExpense =
          totalSaleExpense +
          parseFloat(i.items[key].originalPrice) *
            parseFloat(i.items[key].quantity);
        totalSaleProfit = totalSaleProfit + parseFloat(i.items[key].saleProfit);
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
    setTotalExpense(Math.round(totalSaleExpense));
    SetTotalProfit(Math.round(totalSaleProfit));
    SetTotalIncome(Math.round(totalSaleIncome));
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
              vat: sn.data().vat,
              tot: sn.data().tot,
            };
            result.push(item);
          });
          setData(result);
        });

      if (data) totalCalc(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data) totalCalc(data);
  }, [data]);

  useEffect(() => {
    getSales();
  }, []);

  if (loading) return null;

  return (
    <View style={styles.topBar}>
      <View style={{marginVertical: 0, marginHorizontal: 10}}>
        <View style={styles.statContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flex: 1, marginRight: 2}}>
              <StatCard
                label={t('Income')}
                value={formatNumber(totalIncome)}
                trend="positive"
              />
            </View>
            <View style={{flex: 1, marginLeft: 2}}>
              <StatCard
                label={t('Expense')}
                value={formatNumber(totalExpense)}
                trend="negative"
              />
            </View>
          </View>
          <View style={{marginVertical: 10}}>
            <StatCardFullWidth
              label={t('Profit')}
              value={formatNumber(totalProfit)}
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
    fontSize: 22,
    fontWeight: '900',
    color: colors.black,
  },
  boardSubTitle: {color: colors.grey, fontWeight: 'bold', fontSize: 12},
});

