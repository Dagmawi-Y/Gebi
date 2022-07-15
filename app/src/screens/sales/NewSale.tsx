import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useState, useRef} from 'react';
import colors from '../../config/colors';
import Icon from 'react-native-vector-icons/AntDesign';
import {ScrollView} from 'react-native-gesture-handler';

import firestore from '@react-native-firebase/firestore';

import AddItem from './AddItem';

import BouncyCheckboxGroup, {
  ICheckboxButton,
} from 'react-native-bouncy-checkbox-group';
import {StateContext} from '../../global/context';
import {useTranslation} from 'react-i18next';

const NewSale = ({navigation, route}) => {
  const {t} = useTranslation();
  const {user} = useContext(StateContext);

  const [error, setError] = useState('');

  const mountedRef = useRef(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addedItems, setAddedItems] = useState([]);
  const [customer, setCustomer] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const [sum, setSum] = useState(0);
  const [total, setTotal] = useState(0);

  const categories = ['ABC Bldg', 'Another Building', 'Kalkidan'];

  const paymentTypes = [
    {
      id: 1,
      text: t('Debt'),
      fillColor: colors.primary,
      unfillColor: '#FFFFFF',
      isChecked: true,
      iconStyle: {
        marginBottom: 10,
        marginLeft: 30,
        borderColor: colors.primary,
        borderWidth: 3,
      },
      textStyle: {
        marginBottom: 10,
        marginRight: 30,
        textDecorationLine: 'none',
      },
    },
    {
      id: 2,
      text: t('Cash'),
      fillColor: colors.primary,
      unfillColor: '#FFFFFF',
      iconStyle: {
        marginBottom: 10,
        marginLeft: 30,
        borderColor: colors.primary,
        borderWidth: 3,
      },
      textStyle: {
        marginBottom: 10,
        marginRight: 30,
        textDecorationLine: 'none',
      },
    },
    {
      id: 3,
      text: t('Check'),
      fillColor: colors.primary,
      unfillColor: '#FFFFFF',
      iconStyle: {
        marginBottom: 10,
        marginLeft: 30,
        borderColor: colors.primary,
        borderWidth: 3,
      },
      textStyle: {
        marginBottom: 10,
        marginRight: 30,
        textDecorationLine: 'none',
      },
    },
  ];

  const sale = {
    owner: user.uid,
    customerName: customer,
    date: new Date().toLocaleDateString(),
    invoiceNumber: Math.random().toString().split('.')[1],
    paymentMethod: paymentMethod,
    items: {...addedItems},
  };

  const checkEmpty = () => {
    if (!customer) return true;
    if (addedItems.length == 0) return true;
    if (!paymentMethod) return true;
    return false;
  };

  const addNewSale = async () => {
    if (checkEmpty()) {
      setError('Empty_Empty_Fields_Are_Not_Allowed');
      setTimeout(() => {
        setError('');
      }, 2000);
      return;
    }

    Alert.alert(`እርግጠኛ ነዎት?`, ``, [
      {
        text: 'አዎ',
        onPress: () => {
          try {
            firestore()
              .collection('sales')
              .add(sale)
              .then(async res => {
                for (var i in addedItems) {
                  await firestore()
                    .collection('inventory')
                    .doc(addedItems[i].id)
                    .get()
                    .then(async res => {
                      await firestore()
                        .collection('inventory')
                        .doc(addedItems[i].id)
                        .update({
                          currentCount:
                            res.data()!.currentCount - addedItems[i].quantity,
                        })
                        .catch(err => {
                          console.log(err);
                        });
                    });
                }
              });
            setAddedItems([]);
            navigation.pop();
            console.log('Adding Sale Complete!');
          } catch (error) {
            console.log(error);
          }
        },
        style: 'default',
      },
      {
        text: 'ተመለስ',
        onPress: () => {},
        style: 'default',
      },
    ]);
  };

  const handleSubmit = () => {
    addNewSale();
  };

  const calculate = () => {
    if (!mountedRef) return;
    let sum: number = 0;
    let total: number = 0;
    addedItems.map(i => {
      sum = sum + i.quantity * i.unitPrice;
    });
    total = sum * 0.15 + sum;
    setSum(sum);
    setTotal(total);
  };

  useEffect(() => {
    calculate();
    return () => {
      mountedRef.current = false;
    };
  }, [addedItems]);

  return (
    <>
      {isModalVisible ? (
        <AddItem
          setIsModalVisible={setIsModalVisible}
          addedItems={addedItems}
          setAddedItems={setAddedItems}
        />
      ) : null}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          justifyContent: 'center',
        }}>
        {error ? (
          <View
            style={{
              backgroundColor: colors.red,
              height: 50,
              zIndex: 10,
              width: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              alignItems: 'center',
              flexDirection: 'row',
              borderRadius: 10,
            }}>
            <Text style={{color: colors.white, fontSize: 15}}>{t(error)}</Text>
            <TouchableOpacity onPress={() => setError('')}>
              <Icon name="close" color={colors.white} size={20} />
            </TouchableOpacity>
          </View>
        ) : null}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>{t('New_Sales_Reciept')}</Text>
        </View>
        <View style={styles.topInfo}>
          <View style={styles.topInfoLeft}>
            <Text style={styles.textBold}>
              {new Date().toLocaleDateString()}
            </Text>
            <Text style={styles.textLight}>{t('Date')}</Text>
          </View>
          <View style={styles.topInfoRight}>
            <Text style={styles.textBold}>23/20/014</Text>
            <Text style={styles.textLight}>{t('Receipt_Number')}</Text>
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <Text style={styles.textBold}>{t('Customer')}</Text>
          <TextInput
            style={{
              width: '95%',
              alignSelf: 'center',
              marginTop: 10,
              marginBottom: 10,
              borderRadius: 10,
              borderWidth: 0.4,
              borderColor: '#00000040',
              height: 50,
              paddingHorizontal: 15,
              color: colors.black,
              fontSize: 20,
              flexDirection: 'row-reverse',
              justifyContent: 'flex-start',
              backgroundColor: colors.white,
            }}
            placeholder={t('Enter_Customer_Name')}
            onChangeText={val => {
              setCustomer(val);
            }}
            value={customer}
            keyboardType="default"
            placeholderTextColor={colors.faded_grey}
          />
        </View>
        <View style={styles.ListItemContainer}>
          <Text
            style={[
              styles.textBold,
              {marginVertical: 10, paddingHorizontal: 15},
            ]}>
            {t('Items_List')}
          </Text>

          <ScrollView style={{maxHeight: 300, width: '100%'}}>
            {addedItems.length ? (
              addedItems.map(item => {
                return (
                  <View key={item.listId} style={styles.ListItem}>
                    <View style={styles.LeftContainer}>
                      <Icon
                        name={'minuscircleo'}
                        size={25}
                        style={{padding: 5}}
                        color={colors.black}
                        onPress={() => {
                          setAddedItems(
                            addedItems.filter(i => {
                              return i.listId != item.listId;
                            }),
                          );
                        }}
                      />
                      <View style={{marginLeft: 10}}>
                        <Text style={styles.textBold}>{item.itemName}</Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.textBold}>
                            {item.quantity}
                            <Text style={styles.textLight}>
                              {' '}
                              - {t('Amount')}
                            </Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.RightContainer}>
                      <Text style={styles.textLight}>
                        <Text style={styles.textBold}>
                          {item.unitPrice}
                          {t('Birr')}
                        </Text>
                        /{t('Single')}
                      </Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <Text
                style={[
                  styles.textBold,
                  {
                    paddingVertical: 10,
                    marginHorizontal: 10,
                    borderRadius: 10,
                    textAlign: 'center',
                    backgroundColor: '#ffffff',
                  },
                ]}>
                <Icon name="folderopen" size={25} />
                {'  '}
                {t('Empty')}
              </Text>
            )}
          </ScrollView>

          <TouchableOpacity
            onPress={() => {
              setIsModalVisible(true);
            }}
            style={{
              backgroundColor: colors.primary,
              height: 40,
              marginTop: 20,
              justifyContent: 'center',
              width: 'auto',
              alignSelf: 'center',
              borderRadius: 10,
              paddingHorizontal: 10,
            }}>
            <Text
              style={[
                styles.textBold,
                {color: colors.white, textAlign: 'center'},
              ]}>
              {t('Add_Item')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryTop}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.textLight}>{t('Sum')}</Text>
              <Text
                style={[styles.textBold, {textAlign: 'right', fontSize: 20}]}>
                {sum} {t('Birr')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text style={styles.textLight}>
                {t('Tax')} (15% {t('Vat')})
              </Text>
              <Text
                style={[styles.textBold, {textAlign: 'right', fontSize: 20}]}>
                {sum * 0.15} {t('Birr')}
              </Text>
            </View>
          </View>
          <View style={styles.summaryBottom}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={[styles.textBold, {fontSize: 20, fontWeight: '600'}]}>
                {t('Total')} {t('Sum')}
              </Text>
              <Text
                style={[
                  styles.textBold,
                  {
                    textAlign: 'right',
                    fontSize: 25,
                    textDecorationStyle: 'solid',
                    textDecorationLine: 'underline',
                  },
                ]}>
                {total} {t('Birr')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.paymentTypeContainer}>
          <View style={styles.paymentTop}>
            <Text
              style={[
                styles.textBold,
                {marginBottom: 5, paddingHorizontal: 15},
              ]}>
              {t('Payment')} {t('Type')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <BouncyCheckboxGroup
                data={paymentTypes}
                onChange={(selectedItem: ICheckboxButton) => {
                  const val = selectedItem.text;
                  let option: string;

                  switch (val!.toString()) {
                    case 'Cash':
                      setPaymentMethod('Cash');
                      break;
                    case 'Debt':
                      setPaymentMethod('Debt');
                      break;
                    case 'Check':
                      setPaymentMethod('Check');
                      break;

                    case 'ካሽ':
                      setPaymentMethod('Cash');
                      break;
                    case 'ዱቤ':
                      setPaymentMethod('Debt');
                      break;
                    case 'ቼክ':
                      setPaymentMethod('Check');
                      break;

                    default:
                      break;
                  }
                }}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            // paddingHorizontal: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(t('Are_You_Sure'), ``, [
                {
                  text: t('Yes'),
                  onPress: () => {
                    navigation.goBack();
                  },
                  style: 'default',
                },
                {
                  text: t('Cancel'),
                  onPress: () => {},
                  style: 'default',
                },
              ]);
            }}
            style={{
              backgroundColor: colors.white,
              height: 50,
              marginBottom: 40,
              paddingHorizontal: 20,
              justifyContent: 'space-between',
              width: 150,
              alignItems: 'center',
              borderRadius: 10,
              borderWidth: 0.3,
              borderColor: colors.primary,
              flexDirection: 'row',
            }}>
            <Image
              resizeMethod="auto"
              source={require('../../assets/icons/arrow-leftb.png')}
              style={{
                width: 20,
                height: 20,
              }}
            />
            <Text
              style={[
                styles.textBold,
                {color: colors.primary, textAlign: 'center'},
              ]}>
              {t('Cancel')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              addNewSale();
            }}
            style={{
              backgroundColor: colors.primary,
              height: 50,
              marginBottom: 40,
              paddingHorizontal: 20,
              justifyContent: 'space-between',
              width: 150,
              alignItems: 'center',
              borderRadius: 10,
              flexDirection: 'row',
            }}>
            <Text
              style={[
                styles.textBold,
                {color: colors.white, textAlign: 'center'},
              ]}>
              {t('Submit')}
            </Text>
            <Image
              resizeMethod="auto"
              source={require('../../assets/icons/arrow-right.png')}
              style={{width: 20, height: 20}}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default NewSale;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingVertical: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  pageTitle: {
    fontSize: 25,
    color: colors.black,
    fontWeight: 'bold',
    marginLeft: 10,
    width: '100%',
    textAlign: 'center',
  },
  topInfo: {
    borderBottomWidth: 1,
    marginTop: 10,
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topInfoLeft: {
    padding: 0,
  },
  topInfoRight: {
    alignItems: 'flex-end',
  },
  textBold: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 20,
    paddingHorizontal: 10,
  },
  textLight: {
    paddingHorizontal: 10,
    color: colors.faded_grey,
    fontWeight: '300',
    fontSize: 18,
  },

  ListItemContainer: {
    justifyContent: 'center',
  },
  ListItem: {
    zIndex: 1,
    marginTop: 5,
    marginBottom: 5,
    elevation: 5,
    backgroundColor: colors.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: 'center',
  },
  LeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  RightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 'auto',
  },
  summaryContainer: {
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 20,
    elevation: 1,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  summaryTop: {
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingTop: 15,
  },
  summaryBottom: {
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  paymentTypeContainer: {
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 1,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  paymentTop: {
    justifyContent: 'space-between',
    paddingTop: 15,
  },
});
