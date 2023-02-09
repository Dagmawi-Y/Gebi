import {Text, View, StyleSheet} from 'react-native';
import React from 'react';

import {useTranslation} from 'react-i18next';
import {ISalesListItem} from '../types';
import colors from '../config/colors';
import formatNumber from '../utils/formatNumber';

export const SalesDetailListItem = ({
  itemName,
  quantity,
  unitSalePrice,
}: ISalesListItem) => {
  const {t} = useTranslation();
  return (
    <View key={Math.random()} style={styles.ListItem}>
      <View style={styles.LeftContainer}>
        <View style={{marginLeft: 10}}>
          <Text
            style={{
              color: colors.black,
              fontSize: 15,
              fontWeight: 'bold',
            }}>
            {itemName}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.textBold}>
              {formatNumber(quantity).split('.')[0]}
              <Text style={styles.textLight}> - {t('Amount')}</Text>
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.RightContainer}>
        <Text style={styles.textLight}>
          <Text style={styles.textBold}>
            {formatNumber(unitSalePrice)}
            {t('Birr')}
          </Text>
          / {t('Single')}
        </Text>
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  textBold: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 15,
    paddingHorizontal: 10,
  },
  textLight: {
    paddingHorizontal: 10,
    color: colors.faded_grey,
    fontWeight: '300',
    fontSize: 15,
  },
  ListItem: {
    zIndex: 1,
    marginBottom: 5,
    elevation: 5,
    backgroundColor: colors.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignSelf: 'center',
    borderWidth: 0.4,
    borderColor: '#00000040',
  },
  LeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  RightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
});
