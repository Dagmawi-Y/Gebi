import {View, StyleSheet, Text, Image} from 'react-native';
import React from 'react';
import colors from '../../config/colors';

const ListItem = ({title, unitPrice, quantity}) => {
  return (
    <View style={styles.listItem}>
      <View style={styles.listLeft}>
        <View style={styles.thumbnail}>
          <Image
            style={{width: 40, height: 40}}
            source={require('../../assets/images/phone_image.jpg')}
          />
        </View>
        <View style={{marginLeft: 10}}>
          <View style={styles.listTitleContainer}>
            <Text style={styles.listTextbold}>{title}</Text>
          </View>
          <View style={styles.listdescription}>
            <Text style={styles.listTextbold}>{unitPrice}ብር</Text>
            <Text style={styles.listTextLight}>/አንዱን</Text>
          </View>
        </View>
      </View>
      <View style={styles.listRight}>
        <View style={styles.listPriceContainer}>
          <Text style={[styles.listTextbold, {color: colors.black}]}>
            {quantity}
          </Text>
        </View>
        <View>
          <Text style={[styles.listTextLight, {textAlign: 'right'}]}>
            በእጅ ያለ
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  thumbnail: {},
  listLeft: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  listRight: {
    justifyContent: 'flex-end',
  },
  listdescription: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: 5,
    // marginLeft: 5,
  },
  listTextLight: {
    fontWeight: '300',
    color: colors.grey,
    marginRight: 5,
  },
});

export default ListItem;
