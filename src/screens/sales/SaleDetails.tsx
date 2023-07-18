import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  ScrollView,
  Modal,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState, useRef, useContext} from 'react';
import colors from '../../config/colors';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import StatusBox from '../../components/misc/StatusBox';
import formatNumber from '../../utils/formatNumber';

import RNPrint from 'react-native-print';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

const receipt = require('./reciept');
import {useTranslation} from 'react-i18next';
import roundDecimal from '../../utils/roundDecimal';
import {StateContext} from '../../global/context';
import {HorizontalBox} from '../../components/HorizontalBox';
import {SalesDetailListItem} from '../../components/SalesDetailListItem';
import {transform} from '@babel/core';
import SelectDropdown from 'react-native-select-dropdown';
import {CheckBox, color} from '@rneui/base';

const SaleDetails = ({route, navigation}) => {
  const {t} = useTranslation();
  const {data} = route.params;
  const {userInfo} = useContext(StateContext);

  const [sum, setSum] = useState('');
  const [total, setTotal] = useState('');
  const [TOTVal, setTOTVal] = useState('');
  const [VATVal, setVATVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [menuvisible, setMenuvisible] = useState(false);
  const paymentMethods = ['Cash', 'Debt', 'Check'];
  const [seletedPaymentMethod, setSelectedPayment] = useState('Debt');
  const [shouldShowPaymentMethodDropDown, setShouldShowPaymentMethodDropDown] =
    useState(false);

  const imageRef = useRef<any>(null);
  const mountedRef = useRef(true);

  const calculate = () => {
    let sum: number = 0;
    let total: number = 0;
    Object.keys(data.items).map(i => {
      sum = sum + data.items[i].quantity * data.items[i].unitSalePrice;
    });

    if (data.vat && !data.tot) {
      total = sum * 0.15 + sum;
      setVATVal(formatNumber(sum * 0.15));
    }
    if (!data.vat && data.tot) {
      setTOTVal(formatNumber(sum * 0.02));
      total = sum * 0.02 + sum;
    }
    if (data.vat && data.tot) {
      setVATVal(formatNumber(sum * 0.15));
      total = sum * 0.15 + sum * 0.02 + sum;
      setVATVal(formatNumber(sum * 0.15));
      setTOTVal(formatNumber(sum * 0.02));
    }
    if (!data.vat && !data.tot) {
      total = sum;
    }
    if (mountedRef.current) {
      setSum(formatNumber(sum));
      setTotal(formatNumber(total));
    }

    setSum(formatNumber(sum));
    setTotal(formatNumber(total));
  };

  const capture = () => {
    imageRef.current!.capture().then(uri => {
      Share.open({url: uri});
    });
  };

  const toggleDropDownPaymentOption = () => {
    setShouldShowPaymentMethodDropDown(!shouldShowPaymentMethodDropDown);
  };

  const rollBackSale = async () => {
    setLoading(true);
    let proceed = false;
    try {
      const items = data.items;
      for (var i in items) {
        await firestore()
          .collection('inventory')
          .doc(items[i].id)
          .get()
          .then(async res => {
            if (!res.data()) {
              setLoading(false);
              setError('Item does not exist in stock!');
              Alert.alert(`Item does not exist in stock!`, ``, [
                {
                  text: t('Cancel'),
                  onPress: () => {},
                  style: 'default',
                },
              ]);
              return;
            }
            proceed = true;
            await firestore()
              .collection('inventory')
              .doc(items[i].id)
              .update({
                currentCount:
                  parseFloat(res.data()!.currentCount) +
                  parseFloat(items[i].quantity),
              })
              .then(() => {
                setLoading(false);
              })
              .catch(err => {
                console.log(err);
                setLoading(false);
              });
          })
          .catch(err => console.log(err));
      }
      if (proceed) {
        firestore().collection('sales').doc(data.id).update({
          shouldDiscard: true,
        });
      }
      if (mountedRef.current) {
        setLoading(false);
      }
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  const print = async () => {
    const printData = {
      data: {
        ...data,
        organization: userInfo[0]?.doc?.orgName,
        date: new Date(data.date).toDateString(),
      },

      sum: sum,
      tax: parseFloat(sum) * 0.15,
      total: total,
    };

    await RNPrint.print({
      html: receipt(printData),
    });
  };

  useEffect(() => {
    setSelectedPayment(data.paymentMethod);
    let mounted = true;
    if (mounted) {
      calculate();
    }
    return () => {
      mounted = false;
      mountedRef.current = false;
    };
  }, [data]);

  async function updateSalesDetail(): Promise<void> {
    await firestore()
      .collection('sales')
      .doc(data.id)
      .update({
        paymentMethod: seletedPaymentMethod,
      })
      .then(() => {
        setShouldShowPaymentMethodDropDown(false);
        ToastAndroid.show('Updated', ToastAndroid.SHORT);
      })
      .catch(error => {
        //this wil be shown if incase the exception is happened while updating the data
        ToastAndroid.show('Update Error', ToastAndroid.SHORT);
      });
  }

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      {loading && (
        <StatusBox
          msg={t('Please_Wait...')}
          type="loading"
          overlay={true}
          onPress={() => {}}
        />
      )}
      <ScrollView style={{flex: 1}}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={menuvisible}
          onRequestClose={() => {
            setMenuvisible(!menuvisible);
          }}>
          <View style={styles_modal.centeredView}>
            <View style={styles_modal.modalView}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginRight: 10,
                  }}
                  onPress={() => print()}>
                  <Icon name={'pdffile1'} size={30} color={colors.primary} />
                  <Text
                    style={{marginLeft: 5, fontSize: 15, color: colors.black}}>
                    PDF
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}
                  onPress={() => capture()}>
                  <Icon name={'picture'} size={30} color={colors.primary} />
                  <Text
                    style={{marginLeft: 5, fontSize: 15, color: colors.black}}>
                    Photo
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 20,
                    borderWidth: 1,
                    borderRadius: 20,
                    borderColor: colors.red,
                  },
                ]}
                onPress={() => setMenuvisible(!menuvisible)}>
                <Icon size={25} name="close" color={colors.red} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* @ts-ignore */}
        <ViewShot
          ref={imageRef}
          options={{format: 'jpg', quality: 0.9}}
          style={{
            backgroundColor: colors.white,
            paddingHorizontal: 10,
          }}>
          <ScrollView
            contentContainerStyle={{
              justifyContent: 'center',
            }}>
            <View style={styles.header}>
              <Text style={styles.pageTitle}>{t('Sales_Receipt')}</Text>
            </View>

            <View style={styles.topInfo}>
              <View style={styles.topInfoLeft}>
                <Text style={styles.textBold}>
                  {new Date(data.date).toDateString()}
                </Text>
                <Text style={styles.textLight}>{t('Date')}</Text>
              </View>
              <View style={styles.topInfoRight}>
                <Text style={styles.textBold}>
                  {data.invoiceNumber.substring(0, 9)}
                  {/* {'...'} */}
                </Text>
                <Text style={styles.textLight}>{t('Receipt_Number')}</Text>
              </View>
            </View>
            <HorizontalBox title={t('Customer')} value={data.customerName} />
            <HorizontalBox title={t('Sales_officer')} value={data.createdBy} />
            <HorizontalBox
              title={t('Organization')}
              value={userInfo[0]?.doc?.orgName}
            />

            <View style={styles.ListItemContainer}>
              <Text
                style={[
                  styles.textBold,
                  {marginVertical: 10, paddingHorizontal: 15},
                ]}>
                {t('Items_List')}
              </Text>

              <ScrollView
                style={{width: '100%'}}
                contentContainerStyle={{paddingHorizontal: 5}}>
                {Object.keys(data.items).map(i => (
                  <SalesDetailListItem
                    key={i}
                    itemName={data.items[i].itemName}
                    quantity={data.items[i].quantity}
                    unitSalePrice={data.items[i].unitSalePrice}
                  />
                ))}
              </ScrollView>
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
                    style={[
                      styles.textBold,
                      {textAlign: 'right', fontSize: 15},
                    ]}>
                    {sum} {t('Birr')}
                  </Text>
                </View>

                {data.vat ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textLight}>
                      {t('TAX')} (15% {t('VAT')})
                    </Text>
                    <Text
                      style={[
                        styles.textBold,
                        {textAlign: 'right', fontSize: 15},
                      ]}>
                      {VATVal} {t('Birr')}
                    </Text>
                  </View>
                ) : null}
                {data.tot ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <Text style={styles.textLight}>
                      {t('TOT')} (0.02% {t('TOT')})
                    </Text>
                    <Text
                      style={[
                        styles.textBold,
                        {textAlign: 'right', fontSize: 15},
                      ]}>
                      {TOTVal} {t('Birr')}
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
                    style={[
                      styles.textBold,
                      {fontSize: 15, fontWeight: '600'},
                    ]}>
                    {t('Total')}
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
                  {t('Payment')}
                </Text>
                <Text
                  style={[
                    styles.textBold,
                    {
                      marginBottom: 5,
                      paddingHorizontal: 15,
                      color:
                        data.paymentMethod == 'Cash'
                          ? colors.green
                          : data.paymentMethod == 'Check'
                          ? colors.yellow
                          : colors.red,
                    },
                  ]}>
                  {t(seletedPaymentMethod)}
                </Text>
              </View>
            </View>
          </ScrollView>
        </ViewShot>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            disabled={data.shouldDiscard}
            onPress={() => {
              Alert.alert(t('Are_You_Sure?'), ``, [
                {
                  text: t('Yes'),
                  onPress: () => {
                    rollBackSale();
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
            style={[styles.button, {backgroundColor: colors.red}]}>
            <Text
              style={[
                styles.textBold,
                {color: colors.white, textAlign: 'center'},
              ]}>
              {t('Roll_Back')}
            </Text>
            <Icon2 name="backup-restore" size={25} color={colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, {backgroundColor: colors.primary}]}
            disabled={data.shouldDiscard}
            onPress={() => setMenuvisible(!menuvisible)}>
            <Text
              style={[
                styles.textBold,
                {color: colors.white, textAlign: 'center'},
              ]}>
              {t('Share')}
            </Text>
            <Icon
              name={'sharealt'}
              size={25}
              color={colors.white}
              style={{margin: 5, marginLeft: 'auto'}}
            />
          </TouchableOpacity>
        </View>
        {!data.shouldDiscard ? (
          <CheckBox
            style={{marginTop: 10}}
            title="Change Payment Method"
            checked={shouldShowPaymentMethodDropDown}
            onPress={toggleDropDownPaymentOption}
          />
        ) : (
          <View></View>
        )}

        {shouldShowPaymentMethodDropDown ? (
          <View style={{marginLeft: 21, marginRight: 40}}>
            <SelectDropdown
              data={paymentMethods}
              defaultButtonText={seletedPaymentMethod}
              renderDropdownIcon={() => (
                <View>
                  <Icon name="caretdown" size={20} color={colors.black} />
                </View>
              )}
              buttonStyle={styles.dropDown}
              disabled={false}
              onSelect={selectedItem => {
                setSelectedPayment(selectedItem);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
            />
            <TouchableOpacity
              style={[styles.button, {backgroundColor: colors.green}]}
              onPress={updateSalesDetail}>
              <Text
                style={[
                  styles.textBold,
                  {color: colors.white, textAlign: 'center'},
                ]}>
                {'Update'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View></View>
        )}

        {data.shouldDiscard ? (
          <View style={void_reciept_style.container}>
            <Image
              source={require('../../assets/images/void_reciept.png')} // Provide the source of your image
              style={void_reciept_style.image}
            />
          </View>
        ) : (
          <View></View>
        )}
      </ScrollView>
    </View>
  );
};

export default SaleDetails;

const void_reciept_style = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '20%',
    left: '30%',
    marginRight: 200,
  },
  image: {
    width: 250,
    height: 200,
  },
});

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingVertical: 15,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  pageTitle: {
    fontSize: 28,
    color: colors.black,
    fontWeight: 'bold',
    marginLeft: 10,
    textAlign: 'center',
    width: '100%',
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

  textValue: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 15,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    paddingVertical: 15,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  ListItemContainer: {
    justifyContent: 'center',
  },
  modal: {},
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

  button: {
    height: 45,
    flex: 0.3,
    marginLeft: 15,
    alignSelf: 'center',
    paddingHorizontal: 20,
    justifyContent: 'center',
    width: 'auto',
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
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
  summaryContainer: {
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 20,
    borderWidth: 0.4,
    borderColor: '#00000040',
    shadowColor: '#00000010',
    elevation: 10,
    paddingVertical: 10,
    backgroundColor: colors.white,
    marginHorizontal: 5,
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
    paddingHorizontal: 5,
    borderRadius: 5,
    marginBottom: 15,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderWidth: 0.4,
    borderColor: '#00000040',
    shadowColor: '#00000010',
    elevation: 10,
    marginHorizontal: 5,
  },
  paymentTop: {
    justifyContent: 'space-between',
    padding: 8,
    flexDirection: 'row',
  },
  dropDown: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
    backgroundColor: colors.white,
  },
});

const styles_modal = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    width: '60%',
    alignSelf: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    // elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    marginTop: 20,
    // backgroundColor: colors.primary,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
