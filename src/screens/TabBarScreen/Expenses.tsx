import {
  View,
  StatusBar,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import colors from '../../constants/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, ListItem, SpeedDial, Text} from '@rneui/themed';
import StatCard from '../../Components/TabBar/Sales/StatCard';
import StatCardFullWidth from '../../Components/TabBar/Sales/StatCardFullWidth';
import {SCREENS} from '../../constants/screens';
import AntdIcons from 'react-native-vector-icons/AntDesign';
import {
  ExpenseTypes,
  getIconForExpenseType,
} from '../../constants/expenseTypes';
export default function Expenses({navigation}: any) {
  let dimensions = Dimensions.get('window');
  return (
    <>
      <SafeAreaView style={styles.container}>
        <View
          style={{
            backgroundColor: colors.APP_PRIMARY,
            height: 0.28 * dimensions.height,
            borderBottomEndRadius: 30,
            paddingHorizontal: 5,
          }}>
          <View style={{marginTop: 20, marginHorizontal: 10}}>
            <Text h4 style={{color: 'white'}}>
              ወጪ
            </Text>
            <View style={styles.statContainer}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 1, marginRight: 2}}>
                  <StatCard label="ገቢ" value="3,155" trend="positive" />
                </View>
                <View style={{flex: 1, marginLeft: 2}}>
                  <StatCard label="ወጪ" value="3,155" trend="negative" />
                </View>
              </View>
              <View style={{marginVertical: 10}}>
                <StatCardFullWidth label="ትርፍ" value="1,574" trend="positive" />
              </View>
            </View>
          </View>
        </View>
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
                color: colors.FADED_BLACK_1,
              }}>
              ወጪዎች
            </Text>
            <Button
              title="አዲስ ወጪ"
              icon={{
                name: 'plus',
                type: 'font-awesome',
                size: 15,
                color: '#0047CC',
              }}
              type="clear"
              titleStyle={{color: '#0047CC', fontSize: 14}}
              containerStyle={{
                width: 100,
                marginHorizontal: 10,
                padding: 0,
                backgroundColor: 'rgb(223, 231, 245)',
              }}
              //   onPress={() => navigation.navigate(SCREENS.CreateNewSales)}
            />
          </View>
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
                          color: colors.FADED_BLACK_1,
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
