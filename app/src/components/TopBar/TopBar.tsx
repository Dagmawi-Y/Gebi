import {View, StyleSheet, Text, TouchableHighlight} from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import StatCard from './../statCards/StatCard';
import StatCardFullWidth from './../statCards/StatCardFullWidth';

import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Ionicons';

export default function SalesScreen({
  title,
  income,
  expense,
  calc,
  totalItem,
  totalCost,
}) {
  const aggregate = calc ? parseFloat(income) - parseFloat(expense) : '';
  return (
    <View style={styles.topBar}>
      <View style={{marginVertical: 0, marginHorizontal: 10}}>
        <View style={styles.topBarContainer}>
          <TouchableHighlight style={{flex: 1.2, backgroundColor:colors.primary}}>
            <Icon2 name="menu-sharp" size={30} color={colors.white} />
          </TouchableHighlight>
          <Text style={{color: 'white', fontSize: 25, flex: 8}}>{title}</Text>
          <Icon name="bell" size={20} color={colors.white} style={{flex: 1}} />
        </View>
        {calc ? (
          <View style={styles.statContainer}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flex: 1, marginRight: 2}}>
                <StatCard label="ገቢ" value={income} trend="positive" />
              </View>
              <View style={{flex: 1, marginLeft: 2}}>
                <StatCard label="ወጪ" value={expense} trend="negative" />
              </View>
            </View>
            <View style={{marginVertical: 10}}>
              <StatCardFullWidth
                label="የቀኑ ትርፍ"
                value={aggregate.toString()}
                trend={aggregate > 0 ? 'positive' : 'negative'}
              />
            </View>
          </View>
        ) : (
          <View style={styles.boardContainer}>
            <View style={styles.boardCol}>
              <Text style={styles.boardTopTitle}>{totalItem}</Text>
              <Text style={styles.boardSubTitle}>ያሉ እቃዎች</Text>
            </View>
            <View style={[styles.boardCol, {alignItems: 'flex-end'}]}>
              <Text style={styles.boardTopTitle}>{totalCost}</Text>
              <Text style={styles.boardSubTitle}>አጠቃላይ ዋጋ</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: colors.primary,
    borderBottomEndRadius: 30,
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
  topBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  statContainer: {
    marginTop: 10,
  },

  // Typetwo
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
    alignItems: 'flex-start',
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
  boardTopTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.black,
  },
  boardSubTitle: {color: colors.grey, fontWeight: 'bold', fontSize: 12},
});
