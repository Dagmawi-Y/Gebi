import {View, StyleSheet, Text} from 'react-native';
import React, {useContext} from 'react';
import colors from '../../config/colors';
import Icon from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {StateContext} from '../../global/context';
import {useTranslation} from 'react-i18next';
import StatCard from '../statCards/StatCard';
import StatCardFullWidth from '../statCards/StatCardFullWidth';
import formatNumber from '../../utils/formatNumber';

export default function TopBar() {
  const {t} = useTranslation();
  const {totalExpense} = useContext(StateContext);
  const {totalProfit} = useContext(StateContext);
  const {totalIncome} = useContext(StateContext);

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
    // borderBottomEndRadius: 30,
    paddingVertical: 5,
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

// export default function SalesScreen({children, title, action, actionValue}) {

//   return (
//     <TopBar
//       title={t('Inventory')}
//       // action={setSearchVisible}
//       // actionValue={searchVisible}
//     >
//       <View style={topCard.statContainer}>
//         <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//           <View style={{flex: 1, marginRight: 2}}>
//             <StatCard
//               label={t('Income')}
//               value={formatNumber(totalIncome)}
//               trend="positive"
//             />
//           </View>
//           <View style={{flex: 1, marginLeft: 2}}>
//             <StatCard
//               label={t('Expense')}
//               value={formatNumber(totalExpense)}
//               trend="negative"
//             />
//           </View>
//         </View>
//         <View style={{marginVertical: 10}}>
//           <StatCardFullWidth
//             label={t('Profit')}
//             value={formatNumber(totalProfit)}
//             trend={
//               totalProfit > 0
//                 ? 'positive'
//                 : totalProfit < 0
//                 ? 'negative'
//                 : 'neutral'
//             }
//           />
//         </View>
//       </View>
//     </TopBar>
//   );
// }

// const styles = StyleSheet.create({
//   topBar: {
//     backgroundColor: colors.primary,
//     // borderBottomEndRadius: 30,
//     paddingVertical: 5,
//   },
//   topBarContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginHorizontal: 10,
//   },
// });
