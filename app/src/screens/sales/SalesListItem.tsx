import {View, StyleSheet, Text, Image, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../config/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import routes from '../../navigation/routes';
import {useNavigation} from '@react-navigation/native';
import formatNumber from '../../utils/formatNumber';

const ListItem = (sale, navigation) => {
  const {invoiceNumber, customerName, date, items, paymentMethod} = sale.sale;
  const itemsLength = Object.getOwnPropertyNames(items).length;
  const [totalPrice, setTotalPrice] = useState('');

  const init = () => {
    let tot = 0;
    setTotalPrice(0);
    Object.keys(items).map(key => {
      console.log(items[key].unitPrice);
      tot += parseFloat(items[key].unitPrice) * parseFloat(items[key].quantity);
      setTotalPrice(formatNumber(tot));
    });
  };

  useEffect(() => {
    let mounted = true;
    mounted && init();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={styles.listItem}>
      <View style={styles.listLeft}>
        <View>
          <View style={styles.listTitleContainer}>
            <Text style={styles.listTextbold}>
              {itemsLength > 1
                ? `${items[0].itemName} + ${itemsLength - 1} item(s)`
                : items[0].itemName}
            </Text>
          </View>
          <View style={styles.listdescription}>
            <Text style={styles.listTextLight}>
              Inv: {invoiceNumber.substring(0, 7)}
            </Text>
            <Text style={[styles.listTextLight, {fontStyle: 'italic'}]}>
              {' ( '}
              {customerName}
              {')'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.listRight}>
        <View style={styles.listPriceContainer}>
          <Text style={[styles.listTextbold, {color: colors.green}]}>
            {totalPrice}ብር{' '}
            <Text style={{color: colors.yellow}}>{`(${paymentMethod})`}</Text>
          </Text>
        </View>
        <View>
          <Text style={[styles.listTextLight, {textAlign: 'right'}]}>
            {date}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // List Item
  listItem: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    margin: 5,
  },
  listItemDesc: {
    marginLeft: 5,
  },
  listTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  thumbnail: {},
  listLeft: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  listRight: {
    justifyContent: 'flex-end',
  },
  listdescription: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  listPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  listTextbold: {
    fontWeight: '600',
    fontSize: 20,
    color: colors.black,
  },
  listTextLight: {
    fontWeight: '300',
    color: colors.black,
    margin: 0,
  },
});

export default ListItem;
