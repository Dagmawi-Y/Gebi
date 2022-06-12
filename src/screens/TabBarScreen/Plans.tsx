import {
  View,
  StatusBar,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../constants/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, ListItem, SpeedDial, Text} from '@rneui/themed';
import StatCard from '../../Components/TabBar/Sales/StatCard';
import StatCardFullWidth from '../../Components/TabBar/Sales/StatCardFullWidth';
import {SCREENS} from '../../constants/screens';
import AntdIcons from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import {
  ExpenseTypes,
  getIconForExpenseType,
} from '../../constants/expenseTypes';
import AddItemModal from '../../Components/Items/AddItemModal';
import PlansStatCard from '../../Components/TabBar/Plans/PlansStatCard';
export default function Plans({navigation}: any) {
  let dimensions = Dimensions.get('window');

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View
          style={{
            backgroundColor: colors.APP_PRIMARY,
            borderBottomEndRadius: 30,
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
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                ገቢ
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginBottom: 5}}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'space-between',
                }}>
                <PlansStatCard
                  label="እቅድ"
                  value="3,155"
                  trend="positive"
                  labelStyle={{color: 'black'}}
                />
                <PlansStatCard
                  label="ትክክለኛ"
                  value="1,000"
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
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                ወጪዎች
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginBottom: 5}}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'space-between',
                }}>
                <PlansStatCard
                  label="እቅድ"
                  value="3,155"
                  trend="positive"
                  labelStyle={{color: 'black'}}
                />
                <PlansStatCard
                  label="ትክክለኛ"
                  value="1,000"
                  trend="negative"
                  labelStyle={{color: 'black'}}
                />
              </View>
            </View>
          </View>
          <Button
            title="ዕለታዊ ዕቅዶች"
            icon={{
              name: 'arrow-right',
              type: 'font-awesome',
              size: 22,
              color: '#0047CC',
            }}
            type="clear"
            titleStyle={{color: 'black'}}
            containerStyle={{
              marginHorizontal: 10,
              borderWidth:2,
              borderRadius:10,
              backgroundColor:"white",
              borderColor:'#0047CC'
            }}
            iconRight
            buttonStyle={{
                justifyContent:"space-between",
                paddingHorizontal:20,
                marginVertical:5
            }}
            //   onPress={() => navigation.navigate(SCREENS.CreateNewSales)}
          />
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
