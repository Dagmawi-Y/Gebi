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
import {ScrollView} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/AntDesign';
import {useTranslation} from 'react-i18next';
import BouncyCheckboxGroup, {
  ICheckboxButton,
} from 'react-native-bouncy-checkbox-group';

import {StateContext} from '../../global/context';
import colors from '../../config/colors';
import AddItem from './AddItem';
import formatNumber from '../../utils/formatNumber';

const NewSale = ({navigation}) => {
  const {t} = useTranslation();
  const {userInfo} = useContext(StateContext);

  const [searchVisible, setSearchVisible] = useState(false);
  const [itemCategory, setItemCategory] = useState('');
  const [error, setError] = useState('');
  const mountedRef = useRef(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addedItems, setAddedItems] = useState<any>([]);
  const [customer, setCustomer] = useState('');
  const [customers, setCustomers]: Array<any> = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isTaxTabVisible, setIsTaxTabVisible] = useState(false);
  const [taxType, setTaxType] = useState('');

  const reset = () => {
    setIsModalVisible(false);
    setSearchVisible(false);
    setItemCategory('');
    setAddedItems([]);
    setCustomer('');
    setPaymentMethod('');
    setIsTaxTabVisible(false);
  };
  const [categories, setCategories]: Array<any> = useState([]);
  const [sum, setSum] = useState(0);
  const [total, setTotal] = useState(0);

  const paymentTypes = [
    {
      id: 1,
      text: t('Debt'),
      fillColor: colors.primary,
      unfillColor: '#FFFFFF',
      isChecked: true,
      iconStyle: {
        marginBottom: 10,
        marginLeft: 0,
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
        marginLeft: 0,
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
        marginLeft: 0,
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

  const TaxTypes = [
    // {
    //   id: 0,
    //   text: t('None'),
    //   fillColor: colors.primary,
    //   unfillColor: '#FFFFFF',
    //   iconStyle: {
    //     marginBottom: 10,
    //     marginLeft: 30,
    //     borderColor: colors.primary,
    //     borderWidth: 3,
    //   },
    //   textStyle: {
    //     marginBottom: 10,
    //     marginRight: 30,
    //     textDecorationLine: 'none',
    //   },
    // },
    {
      id: 1,
      text: t('VAT'),
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
      id: 2,
      text: t('TOT'),
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
    owner: userInfo[0]?.doc?.companyId,
    customerName: customer,
    date: new Date().toISOString(),
    invoiceNumber: Math.random().toString().split('.')[1],
    paymentMethod: paymentMethod,
    items: {...addedItems},
    vat: taxType == 'VAT' ? true : false,
    tot: taxType == 'TOT' ? true : false,
    createdBy: userInfo[0]?.doc?.name,
    shouldDiscard: false,
  };

  const checkEmpty = () => {
    if (!customer) return true;
    if (addedItems.length == 0) return true;
    if (!paymentMethod) return true;
    return false;
  };

  const getCustomers = async () => {
    await firestore()
      .collection('customers')
      .where('owner', '==', userInfo[0]?.doc?.companyId)
      .get()
      .then(res => {
        setCustomers(res.docs);
      })
      .catch(err => console.log(err));
  };
  const getCategories = () => {
    firestore()
      .collection('categories')
      .where('owner', '==', userInfo[0]?.doc?.companyId)
      .onSnapshot(qsn => {
        let result: Array<any> = [];
        if (qsn) {
          qsn.forEach(sn => {
            result.push({
              id: sn.id,
              name:
                sn.data().name.substring(0, 1).toUpperCase() +
                sn.data().name.substring(1),
            });
          });
          setCategories(result);
        }
      });
  };

  const addNewSale = async () => {
  
    // const categoryId = categories.filter(i => i.name == categories)[0].id;
    if (checkEmpty()) {
      setError('Empty_Empty_Fields_Are_Not_Allowed');
      setTimeout(() => {
        setError('');
      }, 3000);
      return;
    }

    let totalExpense = 0.0;
    addedItems.forEach(i => {
      totalExpense += i.originalPrice * i.quantity;
    });

    Alert.alert(`እርግጠኛ ነዎት?`, ``, [
      {
        text: 'አዎ',
        onPress: async () => {
          try {
            await firestore()
              .collection('sales')
              .add(sale)
              .then(async res => {
                await firestore()
                  .collection('customers')
                  .add({
                    name: customer,
                    owner: userInfo[0]?.doc?.companyId,
                  })
                  .catch(err => console.log(err));

                for (var i in addedItems) {
                  console.log(addedItems[i].quantity);
                  await firestore()
                    .collection('inventory')
                    .doc(addedItems[i].id)
                    .get()
                    .then(async res => {
                      const currentCount = parseFloat(res.data()?.currentCount);
                      const quantity = parseFloat(addedItems[i].quantity);
                      const updatedCount = currentCount - quantity;

                      if (res.exists) {
                        await firestore()
                          .collection('inventory')
                          .doc(addedItems[i].id)
                          .update({
                            currentCount: updatedCount,
                          })
                          .catch(err => {
                            console.log(err);
                          });
                      } else {
                        console.log(
                          'Inventory document not found:',
                          userInfo[0]?.doc?.companyId,
                        );
                      }
                    })
                  

                    .catch(err => console.log(err));
                }
              })
              .catch(err => {
                console.log(err);
              });
            reset();
            navigation.goBack();
          } catch (error) {
            console.log(error);
          }
        },
        style: 'default',
      },
      {
        text: t('Cancel'),
        onPress: () => {},
        style: 'default',
      },
    ]);
  };

  const calculate = () => {
    if (!mountedRef) return;
    let sum: number = 0;
    let total: number = 0;
    addedItems.map(i => {
      sum = sum + i.quantity * i.unitSalePrice;
    });
    total = sum;
    if (taxType == 'VAT') {
      total = sum + sum * 0.15;
    }
    if (taxType == 'TOT') {
      total = sum + sum * 0.02;
    }
    setSum(sum);
    setTotal(total);
  };

  useEffect(() => {
    calculate();
    getCustomers();
    //getCategories()
    return () => {
      mountedRef.current = false;
    };
  }, [addedItems, taxType]);

  return (
    <>
      {error ? (
        <View
          style={{
            backgroundColor: colors.red,
            height: 50,
            zIndex: 10,
            width: '90%',
            position: 'absolute',
            top: 5,
            right: 5,
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            paddingLeft: 20,
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
              fontSize: 15,
              flexDirection: 'row-reverse',
              justifyContent: 'flex-start',
              backgroundColor: colors.white,
            }}
            placeholder={t('Enter_Customer_Name')}
            onChangeText={val => {
              setCustomer(val);
              setSearchVisible(true);
            }}
            onEndEditing={() =>
              setTimeout(() => {
                setSearchVisible(false);
              }, 500)
            }
            value={customer}
            keyboardType="default"
            placeholderTextColor={colors.faded_grey}
          />
          {customers.filter(i =>
            i.data().name.toLowerCase().includes(customer.toLowerCase()),
          ).length && searchVisible ? (
            <View
              style={{
                zIndex: 10,
              }}>
              <View
                style={{
                  backgroundColor: colors.white,
                  position: 'absolute',
                  top: -18,
                  width: '94%',
                  elevation: 10,
                  padding: 10,
                  marginTop: 10,
                  marginHorizontal: 12,
                }}>
                {customers
                  .filter(i =>
                    i
                      .data()
                      .name.toLowerCase()
                      .includes(customer.toLowerCase()),
                  )
                  .map(i => (
                    <TouchableOpacity
                      key={i.id}
                      onPress={() => {
                        setSearchVisible(false);
                        setCustomer(i.data().name);
                      }}>
                      <Text
                        style={{
                          color: colors.black,
                          fontSize: 15,
                          marginVertical: 5,
                          borderBottomWidth: 0.4,
                          borderColor: '#00000040',
                        }}>
                        {i.data().name}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.ListItemContainer}>
          <Text
            style={[
              styles.textBold,
              {marginVertical: 10, paddingHorizontal: 15},
            ]}>
            {t('Items_List')}
          </Text>

          <ScrollView
            contentContainerStyle={{paddingHorizontal: 10}}
            style={{maxHeight: 300, width: '100%'}}>
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
                          setItemCategory(
                            item.doc.category.substring(0, 1).toUpperCase() +
                              item.doc.category.substring(1),
                          );
                          setAddedItems(
                            addedItems.filter(i => {
                              return i.listId != item.listId;
                            }),
                          );
                        }}
                      />
                      <View style={{}}>
                        <Text style={styles.textBold}>{item.itemName}</Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={[styles.textBold, {fontWeight: 'normal'}]}>
                            {formatNumber(item.quantity)}
                            <Text style={styles.textLight}> {t('(qty)')}</Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.RightContainer}>
                      {item.unit ? (
                        <Text style={styles.textLight}>
                          <Text style={{}}>
                            {formatNumber(item.unitSalePrice)}
                            {t('Birr')}
                          </Text>
                          /
                          {item.unit === 'Piece'
                            ? 'pc'
                            : item.unit === 'Litre'
                            ? 'l'
                            : item.unit === 'Metre'
                            ? 'm'
                            : item.unit.substring(0, 2)}
                        </Text>
                      ) : (
                        <Text style={styles.textLight}>
                          <Text style={{}}>
                            {formatNumber(item.unitSalePrice)}
                            {t('Birr')}
                          </Text>
                        </Text>
                      )}
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
                    // backgroundColor: '#878787',
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
              <Text style={[styles.textBold, {marginBottom: 10}]}>
                {t('Sum')}
              </Text>
              <Text
                style={[
                  styles.textBold,
                  {textAlign: 'right', fontSize: 15, marginBottom: 15},
                ]}>
                {formatNumber(sum)} {t('Birr')}
              </Text>
            </View>
            {taxType == 'VAT' ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                  marginLeft: 10,
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={[
                      styles.textLight,
                      {
                        paddingHorizontal: 0,
                      },
                    ]}>
                    {t('TAX')} (15% {t('VAT')})
                  </Text>
                </View>

                <Text
                  style={[
                    styles.textBold,
                    {
                      textAlign: 'right',
                      fontSize: 15,
                    },
                  ]}>
                  {formatNumber(sum * 0.15)} {t('Birr')}
                </Text>
              </View>
            ) : null}
            {taxType == 'TOT' ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                  marginLeft: 10,
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={[
                      styles.textLight,
                      {
                        paddingHorizontal: 0,
                      },
                    ]}>
                    {t('TOT')} (2% {t('TOT')})
                  </Text>
                </View>

                <Text
                  style={[
                    styles.textBold,
                    {
                      textAlign: 'right',
                      fontSize: 15,
                    },
                  ]}>
                  {formatNumber(sum * 0.02)} {t('Birr')}
                </Text>
              </View>
            ) : null}
          </View>
          <View style={styles.summaryBottom}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={[styles.textBold, {fontSize: 15, fontWeight: '600'}]}>
                {t('Total')} {t('Sum')}
              </Text>
              <Text
                style={[
                  styles.textBold,
                  {
                    textAlign: 'right',
                    fontSize: 23,
                    textDecorationStyle: 'solid',
                    textDecorationLine: 'underline',
                  },
                ]}>
                {formatNumber(total)} {t('Birr')}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setIsTaxTabVisible(true)}>
            <Text
              style={[
                styles.textBold,
                {
                  marginBottom: 5,
                  backgroundColor: colors.primary,
                  color: colors.white,
                  width: 120,
                  textAlign: 'center',
                  borderRadius: 10,
                  paddingVertical: 3,
                },
              ]}>
              {t('Include_Tax')}
            </Text>
          </TouchableOpacity>
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
                style={{}}
                data={paymentTypes as any}
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

                    case 'ጥሬ ገንዘብ':
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

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(t('Are_You_Sure?'), ``, [
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
              width: 110,
              alignItems: 'center',
              borderRadius: 10,
              borderWidth: 0.3,
              borderColor: colors.primary,
              flexDirection: 'row',
              marginRight: 5, // Add margin to create spacing between buttons
            }}>
            <Image
              resizeMethod="auto"
              source={require('../../assets/icons/arrow-leftb.png')}
              style={{
                width: 15,
                height: 15,
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
              paddingHorizontal: 15,
              justifyContent: 'space-between',
              width: 115,
              alignItems: 'center',
              borderRadius: 10,
              flexDirection: 'row',
              marginRight: 5, // Add margin to create spacing between buttons
            }}>
            <Text
              style={[
                styles.textBold,
                {color: colors.white, textAlign: 'center'},
              ]}>
              {t('Submit print')}
            </Text>
            <Image
              resizeMethod="auto"
              source={require('../../assets/icons/arrow-right.png')}
              style={{width: 12, height: 12}}
            />
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
              width: 108,
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
              style={{width: 10, height: 10}}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
      {isTaxTabVisible ? (
        <View
          style={{
            backgroundColor: colors.transBlack,
            height: '100%',
            width: '100%',
            bottom: 0,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              width: '98%',
              backgroundColor: colors.white,
              borderRadius: 5,
              marginBottom: 2,
              paddingBottom: 10,
            }}>
            <View
              style={{
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => setIsTaxTabVisible(false)}
                style={{
                  elevation: 5,
                  shadowColor: colors.transBlack,
                  backgroundColor: colors.white,
                  borderRadius: 15,
                  borderTopEndRadius: 0,
                  borderTopStartRadius: 0,
                  paddingHorizontal: 5,
                }}>
                <Icon
                  name="down"
                  color={colors.black}
                  size={25}
                  style={{marginBottom: -20}}
                />
                <Icon name="down" color={colors.black} size={25} />
              </TouchableOpacity>
            </View>
            <Text
              style={[
                styles.textBold,
                {textAlign: 'center', marginVertical: 15, fontSize: 20},
              ]}>
              {t('Include_Tax')}
            </Text>

            <View style={{paddingHorizontal: 20}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {!taxType ? (
                  <BouncyCheckboxGroup
                    data={TaxTypes as any}
                    onChange={(selectedItem: ICheckboxButton) => {
                      const val = selectedItem.text;
                      let option: string;

                      switch (val!.toString()) {
                        case 'VAT':
                          setTaxType('VAT');
                          break;
                        case 'TOT':
                          setTaxType('TOT');
                          break;

                        case 'ቫት':
                          setTaxType('VAT');
                          break;

                        // case t('None'):
                        //   setTaxType('');
                        //   break;

                        default:
                          break;
                      }
                    }}
                  />
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingVertical: 20,
                      alignItems: 'center',
                    }}>
                    <Text style={[styles.textBold]}>{`${t(
                      'TAX_Type',
                    )}: `}</Text>
                    <View
                      style={{
                        backgroundColor: colors.primary,
                        flexDirection: 'row',
                        padding: 5,
                        borderRadius: 5,
                      }}>
                      <Text style={[styles.textBold, {color: colors.white}]}>
                        {t(taxType)}
                      </Text>
                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          right: -10,
                          top: -10,
                          backgroundColor: colors.red,
                          borderRadius: 15,
                        }}
                        onPress={() => setTaxType('')}>
                        <Icon name={'close'} size={20} color={colors.white} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
              {/* <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginBottom: 20,
                }}>
                <CheckboxButton
                  fillColor={colors.primary}
                  size={30}
                  isChecked={isVatIncluded}
                  onPress={(isChecked: boolean) => {
                    setIsVatIncluded(isChecked);
                  }}
                />
                <Text style={[styles.textLight]}>{t('VAT')} (15%)</Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <CheckboxButton
                  fillColor={colors.primary}
                  size={30}
                  isChecked={isTotIncluded}
                  onPress={(isChecked: boolean) => {
                    setIsTotIncluded(isChecked);
                  }}
                />
                <Text style={[styles.textLight]}>{t('TOT')} (2%)</Text>
              </View> */}
            </View>
          </View>
        </View>
      ) : null}
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
    fontSize: 23,
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
    fontSize: 15,
    paddingHorizontal: 10,
  },
  textLight: {
    paddingHorizontal: 10,
    color: colors.faded_grey,
    fontWeight: '300',
    fontSize: 15,
  },

  ListItemContainer: {
    justifyContent: 'center',
  },
  ListItem: {
    zIndex: 1,
    marginTop: 5,
    marginBottom: 5,
    elevation: 2,
    backgroundColor: colors.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: 'center',
    marginHorizontal: 10,
  },
  LeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  RightContainer: {
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
