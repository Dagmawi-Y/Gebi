import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Button,
  Text,
} from 'react-native';
import colors from '../../config/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import StatCard from '../../components/statCards/StatCard';
import StatCardFullWidth from '../../components/statCards/StatCardFullWidth';

import ListItem from '../../components/lists/ListItem';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

import items from './items';
import TopBar from '../../components/TopBar/TopBar';

export default function SalesScreen({navigation, size, currentLanguage}) {
  const [lang, setLang] = useState('');
  const clearLang = async () => {
    try {
      await AsyncStorage.removeItem('lang');
    } catch (error) {
      console.log(error);
    }
  };
  const getLanguage = async () => {
    try {
      await AsyncStorage.getItem('lang').then(lan => {
        setLang(lan!.toString());
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLanguage();
  }, []);
  return (
    <SafeAreaView>
      <TopBar
        title={'ሽያጭ'}
        income={'1287'}
        expense={'8979'}
        calc={true}
        totalCost={''}
        totalItem={''}
      />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Sales</Text>
        <Text style={styles.title}>{lang ? lang : 'noLang'}</Text>
        <TouchableOpacity style={styles.buttonwithIcon} onPress={clearLang}>
          <Image source={require('./calculator.png')}></Image>
          <Text
            style={{
              color: colors.black,
            }}>
            Plan your Sales
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{marginBottom: 248}}>
        {items.map((item, i) => {
          return (
            <ListItem
              key={i}
              title={item.title}
              weight={item.weight}
              invNumber={item.invNumber}
              location={item.location}
              price={item.price}
              date={item.date}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
  topBar: {
    backgroundColor: colors.primary,
    borderBottomEndRadius: 30,
    paddingHorizontal: 5,
  },
  titleContainer: {
    backgroundColor: colors.light,
    paddingVertical: 5,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 25,
    color: colors.black,
  },
  buttonwithIcon: {
    backgroundColor: colors.lightBlue,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    width: '35%',
    padding: 10,
    gap: 2,
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

  listContainer: {
    height: '100%',
  },

  // List Item
  listItem: {
    backgroundColor: colors.grey,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    margin: 5,
  },
  listTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  listLeft: {
    justifyContent: 'space-between',
  },
  listRight: {
    justifyContent: 'space-between',
  },
  listdescription: {
    flexDirection: 'row',
  },
  listPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  listTextbold: {
    fontWeight: '600',
    fontSize: 20,
    color: colors.black,
    marginRight: 10,
  },
  listTextLight: {
    fontWeight: '300',
    color: colors.grey,
    marginRight: 10,
  },
});
