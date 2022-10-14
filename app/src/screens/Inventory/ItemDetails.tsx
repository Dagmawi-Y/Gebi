import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';

import React, {useContext, useEffect, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import colors from '../../config/colors';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import routes from '../../navigation/routes';
import firestore, {firebase} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {useTranslation} from 'react-i18next';
import formatNumber from '../../utils/formatNumber';
import {StateContext} from '../../global/context';

const ItemDetails = ({route, navigation}) => {
  const {data, owner, itemId} = route.params;
  const {userInfo} = useContext(StateContext);
  const {t} = useTranslation();
  const [totalSaleCount, setTotalSaleCount] = useState(0);

  const [stockHistory, setStockHistory]: Array<any> = ([] = useState([]));

  const deleteStock = async () => {
    let batch = firestore().batch();
    let totSaleCount: number = 0;
    const sales = await firestore()
      .collection('stock')
      .where('owner', '==', userInfo[0].doc.companyId)
      .where('item_id', '==', itemId)
      .get();
    sales.docs.map(i => (totSaleCount += parseInt(i.data().initialCount)));
    setTotalSaleCount(totSaleCount);
    sales.forEach(sale => {
      batch.delete(sale.ref);
    });
    return batch.commit().then(async () => [
      await firestore()
        .collection('categories')
        .doc(data.categoryId)
        .update({
          count: firestore.FieldValue.increment(-totSaleCount),
        }),
    ]);
  };

  const deleteItem = async () => {
    Alert.alert(t('Are_You_Sure?'), ``, [
      {
        text: t('Yes'),
        onPress: async () => {
          if (data.picture) {
            let pictureRef = storage().refFromURL(data.picture);
            pictureRef.delete().catch(err => console.log(err));
          }
          await firestore().collection('inventory').doc(itemId).delete();
          deleteStock();
          navigation.replace(routes.inventoryHome);
        },
        style: 'default',
      },
      {
        text: t('Cancel'),
        onPress: () => {},
        style: 'cancel',
      },
    ]);
  };

  const getStockHistory = async () => {
    try {
      firestore()
        .collection('stock')
        .where('owner', '==', owner)
        .where('item_id', '==', itemId)
        .onSnapshot(querySnapshot => {
          let result: Array<any> = [];
          querySnapshot.forEach(documentSnapshot => {
            result.push({
              id: documentSnapshot.id,
              doc: documentSnapshot.data(),
            });
          });
          setStockHistory(result);
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getStockHistory();
  }, []);
  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView style={{flex: 1}}>
        <View style={[styles.viewContainer]}>
          <View
            style={{
              backgroundColor: 'white',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
              justifyContent: 'space-between',
            }}>
            <View style={{justifyContent: 'flex-start'}}>
              <Text style={[styles.textBold, {marginHorizontal: 0}]}>
                {t('Item_Name')}
              </Text>
              <Text style={[styles.textLight, {marginHorizontal: 10}]}>
                {data.item_name}
              </Text>
            </View>
            <View>
              <Image
                style={{width: 250, height: 150, borderRadius: 10}}
                resizeMode="cover"
                source={
                  data.picture
                    ? {uri: data.picture}
                    : require('../../assets/images/no_image.jpg')
                }
              />
            </View>
          </View>
          <Text style={styles.textBold}>{t('Item_Details')}</Text>
          <View style={styles.boardContainer}>
            <View style={styles.boardCol}>
              <Text style={styles.boardTopTitle}>{t('Price')}</Text>
              <Text style={styles.boardSubTitle}>
                {formatNumber(data.unit_price)} {t('Birr')}
              </Text>
            </View>
            <View style={styles.boardCol}>
              <Text style={styles.boardTopTitle}>{t('Total')}</Text>
              <Text style={[styles.boardSubTitle, {textAlign: 'right'}]}>
                {formatNumber(data.currentCount).split('.')[0]}
              </Text>
            </View>
          </View>
          <Text style={styles.textBold}>{t('Item_History')}</Text>
          <View style={{marginVertical: 20}}>
            <View style={tableStyles.thead}>
              <Text style={tableStyles.theadFont}>{t('Price')}</Text>
              <Text style={tableStyles.theadFont}>{t('Unit')}</Text>
              <Text style={tableStyles.theadFont}>{t('Supplier')}</Text>
              <Text style={tableStyles.theadFont}>{t('date')}</Text>
            </View>
            {stockHistory.map(history => {
              return (
                <View
                  key={Math.random()}
                  style={[
                    tableStyles.trow,
                    {
                      backgroundColor:
                        history.doc % 2 != 0 ? 'transparent' : 'white',
                    },
                  ]}>
                  <Text style={tableStyles.trowFont}>
                    {formatNumber(history.doc.unit_price)} {t('Birr')}
                  </Text>
                  <Text style={tableStyles.trowFont}>
                    {formatNumber(history.doc.initialCount).split('.')[0]}{' '}
                    {history.doc.unit}
                  </Text>
                  <Text style={tableStyles.trowFont}>
                    {history.doc.supplier_name}
                  </Text>
                  <Text style={tableStyles.trowFont}>{history.doc.date}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          paddingHorizontal: 10,
        }}>
        <TouchableOpacity
          onPress={() => deleteItem()}
          style={{
            backgroundColor: colors.red,
            height: 60,
            marginBottom: 10,
            paddingHorizontal: 25,
            justifyContent: 'space-between',
            width: 'auto',
            alignItems: 'center',
            borderRadius: 30,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: colors.white,
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 22,
            }}>
            {t('Delete')}
          </Text>
          <Icon name="delete" size={25} color={colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
  viewContainer: {
    marginHorizontal: 5,
    justifyContent: 'space-between',
    display: 'flex',
    flexGrow: 1,
    flex: 1,
  },
  boardContainer: {
    marginVertical: 15,
    backgroundColor: 'white',
    height: 80,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  boardCol: {
    justifyContent: 'center',
  },
  boardTopTitle: {
    fontSize: 18,
    color: colors.black,
    fontWeight: '800',
  },
  boardSubTitle: {
    fontWeight: '300',
    textAlign: 'left',
    fontSize: 22,
    color: colors.black,
  },
  textBold: {
    fontSize: 22,
    marginTop: 25,
    fontWeight: 'bold',
    color: colors.black,
    paddingHorizontal: 10,
  },
  textLight: {
    fontSize: 22,
    fontWeight: '400',
    color: colors.black,
    marginHorizontal: 20,
  },
});

const tableStyles = StyleSheet.create({
  thead: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  theadFont: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  trow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#00000030',
  },
  trowFont: {
    fontSize: 16,
    color: colors.black,
  },
  oddRow: {
    backgroundColor: 'transparent',
  },
  evenRow: {
    backgroundColor: 'white',
  },

  textStyle: {
    color: colors.black,
  },
});

export default ItemDetails;
