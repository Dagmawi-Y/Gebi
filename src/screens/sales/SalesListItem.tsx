import {View, StyleSheet, Text, Image, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../config/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import routes from '../../navigation/routes';
import {useNavigation} from '@react-navigation/native';
import formatNumber from '../../utils/formatNumber';
import {useTranslation} from 'react-i18next';
import roundDecimal from '../../utils/roundDecimal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ListItem = (sale, navigation) => {
  const {t} = useTranslation();
  const {invoiceNumber, customerName, date, items,total, paymentMethod, vat, tot, shouldDiscard} =
    sale.sale;
  const itemsLength = Object.getOwnPropertyNames(items).length;
  const [totalPrice, setTotalPrice] = useState<any>('');

  const init = () => {
    let totalSum = 0;
    let taxValue: String = '';
    setTotalPrice(0);
    Object.keys(items).map(key => {
      totalSum +=
        parseFloat(items[key].unitSalePrice) * parseFloat(items[key].quantity);
      taxValue=items[key].taxType;
       console.log(taxValue);
      
    });

    if (vat && !tot) totalSum = totalSum * 0.15 + totalSum;
    if (!vat && tot) totalSum = totalSum * 0.02 + totalSum;
    if (vat && tot) totalSum = totalSum * 0.15 + totalSum * 0.02 + totalSum;

    setTotalPrice(formatNumber(totalSum));
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
                ? `${items[0].itemName} + ${itemsLength - 1} ${t("item(s)")}`
                : items[0].itemName}
            </Text>
          </View>
          <View style={styles.listdescription}>
            <Text style={styles.listTextLight}>
              Inv: {invoiceNumber.substring(0, 7)}
            </Text>
            <Text style={[styles.listTextLight, {fontStyle: 'italic'}]}>
              {' ('}
              {customerName}
              {')'}
            </Text>
          </View>
        </View>
      </View>
      <View style={{flexDirection: 'row', paddingRight: 25}}>
        <View style={[styles.listRight]}>
          <View style={styles.listPriceContainer}>
            <Text style={[styles.listTextbold, {color: colors.black}]}>
              {formatNumber(total)}
              {t(' Birr')}{' '}
              <Text
                style={{
                  color:
                    paymentMethod == 'Cash'
                      ? colors.green
                      : paymentMethod == 'Check'
                      ? colors.yellow
                      : colors.red,
                }}>{`(${t(paymentMethod)})`} </Text> {shouldDiscard ? <Icon size={20} name='close-circle' color={colors.red}></Icon>  : <Icon size={20} name='check-circle' color={colors.green}></Icon>}
            </Text>
          </View>
          <View>
            <Text style={[styles.listTextLight, {textAlign: 'right'}]}>
              {date}
            </Text>
          </View>
        </View>
        {vat || tot ? (
          <View
            style={{
              height: '100%',
              width: 20,
              marginRight: 0,
              position: 'absolute',
              top: 0,
              right: -1,
              alignItems: 'center',
              borderTopRightRadius: 10,
            }}>
            {vat ? (
              <Text
                style={{
                  backgroundColor: colors.green,
                  width: '100%',
                  textAlign: 'center',
                  color: colors.white,
                  borderRadius: 2,
                  marginBottom: 5,
                  fontSize: 15,
                }}>
                V
              </Text>
            ) : null}
            {tot ? (
              <Text
                style={{
                  backgroundColor: colors.yellow,
                  width: '100%',
                  borderRadius: 2,
                  textAlign: 'center',
                  marginBottom: 5,
                  color: colors.white,
                  fontSize: 15,
                }}>
                T
              </Text>
            ) : null}
          </View>
        ) : null}
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
    paddingLeft: 20,
    paddingVertical: 10,
    borderRadius: 10,
    margin: 5,
    // elevation: 10,
    borderColor: '#00000030',
    borderWidth: 0.5,
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
    fontSize: 15,
    color: colors.black,
  },
  listTextLight: {
    fontWeight: '300',
    color: colors.black,
    margin: 0,
  },
});

export default ListItem;
