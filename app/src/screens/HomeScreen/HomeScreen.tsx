import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import {useTranslation} from 'react-i18next';
import routes from '../../navigation/routes';

import {
  InventoryIcon,
  SalesIcon,
  ExpensesIcon,
  PlannerIcon,
} from '../../components/Icons';

const HomeScreen = ({navigation}) => {
  const {t} = useTranslation();
  return (
    <View style={styles.screenContainer}>
      <View style={{}}>
        <View
          style={{
            borderRadius: 100,
            marginVertical: 10,
            backgroundColor: colors.white,
            elevation: 10,
            width: 100,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            aspectRatio: 1,
          }}>
          <Text style={{fontSize: 90, color: colors.black, fontWeight: '600'}}>
            E
          </Text>
        </View>
        <Text
          style={{
            fontSize: 20,
            textAlign: 'center',
            color: colors.white,
            fontWeight: '400',
          }}>
          Eldix
        </Text>
        <View
          style={{
            backgroundColor: colors.transWhite,
            width: '100%',
            alignSelf: 'center',
            height: 1.2,
            marginVertical: 10,
          }}
        />
      </View>
      <Text style={styles.pageHeading}>{t('Where_Do_You_Want_To_Go_?')}</Text>
      <View
        style={{
          backgroundColor: colors.primary,
          elevation: 5,
          flex: 1,
          borderRadius: 10,
        }}>
        <ScrollView>
          <View style={styles.row}>
            <Box
              Icon={<SalesIcon color={colors.black} size={25} />}
              onpress={() =>
                navigation.navigate(routes.Gebi, {screen: routes.sales})
              }
              title={t('Sales')}
            />
            <Box
              Icon={<InventoryIcon color={colors.black} size={25} />}
              onpress={() =>
                navigation.navigate(routes.Gebi, {
                  screen: t(routes.inventoryNav),
                })
              }
              title={t('Inventory')}
            />
          </View>
          <View style={styles.row}>
            <Box
              Icon={<ExpensesIcon color={colors.black} size={25} />}
              onpress={() =>
                navigation.navigate(routes.Gebi, {screen: routes.expensesNav})
              }
              title={t('Expense')}
            />
            <Box
              Icon={<PlannerIcon color={colors.black} size={25} />}
              onpress={() =>
                navigation.navigate(routes.Gebi, {
                  screen: t(routes.plan),
                })
              }
              title={t('Plan')}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const Box = ({title, onpress, Icon}) => {
  return (
    <TouchableOpacity onPress={onpress} activeOpacity={0.7} style={styles.box}>
      <Text style={styles.boxTitle}>{title}</Text>
      {Icon}
    </TouchableOpacity>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: 15,
  },
  pageHeading: {
    fontSize: 30,
    color: colors.white,
    fontWeight: '500',
    marginTop: 5,
    marginBottom: 10,
    letterSpacing: 1.1,

    textAlign: 'center',
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    aspectRatio: 1,
    padding: 20,
    backgroundColor: colors.white,
    elevation: 5,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  boxTitle: {
    fontSize: 20,
    color: colors.black,
    fontWeight: '600',
    marginBottom: 15,
  },
});
