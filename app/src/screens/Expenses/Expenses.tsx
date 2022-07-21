import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect} from 'react';
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

export default function Expenses({navigation}: any) {
  let dimensions = Dimensions.get('window');
  const {t} = useTranslation();

  return (
    <>
      <SafeAreaView style={styles.container}>
        <TopScreen />
        <View style={styles.contentContainer}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 5,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                color: colors.faded_dark,
              }}>
              ወጪዎች
            </Text>
          </View>
          <TouchableOpacity
            style={{
              position: 'absolute',
              width: 50,
              height: 50,
              justifyContent: 'center',
              bottom: 20,
              right: 10,
              backgroundColor: colors.primary,
              alignItems: 'center',
              borderRadius: 30,
            }}>
            <MaterialIcon name="plus" size={25} color={colors.white} />
          </TouchableOpacity>
          <ScrollView>
            {[
              {type: ExpenseTypes.TYPE1, name: 'የሲሚንቶ ግዢ'},
              {type: ExpenseTypes.TYPE2, name: 'የጽህፈት መሳሪያዎች ግዢ'},
              {type: ExpenseTypes.TYPE3, name: 'ሰራተኛ ደሞዝ'},
            ].map(e => {
              return (
                <TouchableOpacity
                  style={{marginVertical: 5}}
                  key={e.name}
                  //   onPress={() => navigation.navigate(SCREENS.UpdateSales)}
                >
                  <ListItem
                    bottomDivider
                    // key={i}
                    containerStyle={{borderRadius: 5}}>
                    {getIconForExpenseType(e.type)}
                    <ListItem.Content>
                      <ListItem.Title
                        style={{
                          fontWeight: 'bold',
                          color: colors.faded_dark,
                        }}>
                        {e.name}
                      </ListItem.Title>
                    </ListItem.Content>
                    <View style={{alignItems: 'flex-end'}}>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            fontSize: 16,
                            color: 'red',
                          }}>
                          750.45 ብር
                        </Text>
                      </View>
                      <Text>22 Sep 2021</Text>
                    </View>
                  </ListItem>
                </TouchableOpacity>
              );
            })}
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
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
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
