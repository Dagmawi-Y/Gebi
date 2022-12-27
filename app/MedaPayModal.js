import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Modal, TouchableOpacity, ActivityIndicator, Image, Alert, Linking, Dimensions, StatusBar as sb, Pressable } from 'react-native';
import WebView from 'react-native-webview';

const getBaseUrl = (config) => {
  if (config.isSandBox) return 'https://api.sandbox.pay.meda.chat';
  else return 'https://api.pay.meda.chat';
}

const sbHeight = sb.currentHeight;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const colors = {
  primary: '#456E9A',
  secondary: '#3879B3',
  contentBg: '#EDF2F8',
  white: '#fff',
  yellow: '#F7D30C',
  red: '#ff0000',
  lightRed: '#FF6363',
  black: '#000',
  gray: 'gray',
  green: '#01A442',
  lightGray: '#EEEEEE',
  darkGray: '#334257',
  text: '#4A4A4A',
  orange: '#FF5F00',
  teal: '#219F94',
  rippleColor: '#DDDDDD'
}

const paymentMethods = {
  'TELEBIRR': 'telebirr',
  'CBEBIRR': 'cbebirr',
  'AMOLE': 'amole',
  'BOA': 'boa',
  'EBIRR': 'ebirr'
}

const ERROR_MESSAGES = {
  "acceptedPaymentError": "Please provide at least one accepted payment method.",
  "referenceNumberError": "Configuration error please check your reference number.",
  "noPaymentMethodFound": "Merchant doesn't support any payment methods."
}

const checkConfig = (config) => {
  if (config.Authorization !== null || config.Authorization !== undefined || config.isSandBox !== null || config.isSandBox !== undefined || config.merchantName !== null || config.merchantName !== undefined || config.data !== null || config.data !== undefined) {
    return false;
  } else {
    return true;
  }
}

const MedaPayModal = ({ config, onShow, onClose, onCancel, isVisible, onReferenceNumber, onBillCreationError, onPaymentCompleted, onPaymentError, onPaymentMethodSelected, isWithRefNumber = false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPayMethod, setSelectedPayMethod] = useState(null);
  const [shouldNavToPay, setShouldNavToPay] = useState(false);
  const [hasConfigError, setHasConfigError] = useState(false);
  const [acceptedPaymentMethods, setAcceptedPaymentMethods] = useState([]);

  const checkPayMethodExist = (payMethod) => {
    for (let i = 0; i < paymentMethods.length; i++) {
      if (paymentMethods[i] === payMethod) {
        return true;
      } else {
        return false;
      }
    }
  }

  useEffect(() => {
    createBill();
  }, []);

  const checkConfigData = async () => {
    const isConfigCorrect = checkConfig(config);
    if (isConfigCorrect) {
      setHasConfigError(false);
      await createBill();
    } else {
      setHasConfigError(true);
    }
  }

  const createBill = async () => {
    setLoading(true);
    //! with out reference number
    if (isWithRefNumber === false) {
      try {
        const response = await fetch(`${getBaseUrl(config)}/v1/bills`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.Authorization}`,
            'Accept': 'application/json'
          },
          body: JSON.stringify(config.data)
        });
        const payments = [paymentMethods.TELEBIRR, paymentMethods.CBEBIRR]
        if (response.status === 201) {
          //!
          const data = await response.json();
          
          if (config.isSandBox) {
            if (data.availablePayments) {
              if (data.availablePayments.length !== 0) {
                onReferenceNumber(data.billReferenceNumber);
                setData(data);
                setAcceptedPaymentMethods([...data.availablePayments]);
                setLoading(false);
              } else {
                const data = { "success": false, "data": null, "status": response.status, "error": ERROR_MESSAGES.noPaymentMethodFound };
                onBillCreationError(data);
              }
            } else {
              //!
              const data = { "success": false, "data": null, "status": response.status, "error": ERROR_MESSAGES.noPaymentMethodFound };
              onBillCreationError(data);
            }
          } else {
            if(data.availablePayments){
              if(data.availablePayments.length != 0){
                // onReferenceNumber(data.billReferenceNumber);
                // setData(data);
                payments.push(...data.availablePayments);
                // setLoading(false);
              }else {
                ;
                // const data = { "success": false, "data": null, "status": response.status, "error": ERROR_MESSAGES.noPaymentMethodFound };
                // onBillCreationError(data);
              }
            }
            onReferenceNumber(data.billReferenceNumber);
                setData(data);
                setAcceptedPaymentMethods(payments);
                setLoading(false);
          }

        } else {
          const data = { "success": false, "data": null, "status": response.status, "error": "Invalid request" };
          onBillCreationError(data);
        }

      } catch (error) {
        const data = { "success": false, "data": null, "status": null, "error": error };
        onBillCreationError(data);
      }

      //! with reference number
    } else {

      if (config.refNumber === null || config.refNumber === undefined || config.refNumber === '' || config.refNumber.length !== 8) {
        const data = { "success": false, "data": null, "status": null, "error": `${ERROR_MESSAGES.referenceNumberError} Reference Number: ${config.refNumber}` };
        onBillCreationError(data);
      } else {
        onReferenceNumber(config.refNumber);
        const response = await checkBillStat(config.Authorization, config.refNumber, config.isSandBox);
        if (response.success) {
          if (response.data.status === 'PENDING') {
            if (response.data.availablePayments) {
              if (response.data.availablePayments.length !== 0) {
                setData({
                  "billReferenceNumber": config.refNumber,
                  "link": {
                    "href": `${getBaseUrl(config)}/pay/bills/${config.refNumber}`,
                    "rel": "self",
                    "method": "GET"
                  },
                  "isSimulation": config.isSandBox,
                  "status": response.data.status,
                  "merchantName": response.data.merchantName
                });
                setAcceptedPaymentMethods([...response.data.availablePayments]);
                setLoading(false);
              } else {
                const data = { "success": false, "data": null, "status": response.status, "error": ERROR_MESSAGES.noPaymentMethodFound };
                onBillCreationError(data);
              }
            } else {
              onReferenceNumber(config.refNumber);
              setData({
                "billReferenceNumber": config.refNumber,
                "link": {
                  "href": `${getBaseUrl(config)}/pay/bills/${config.refNumber}`,
                  "rel": "self",
                  "method": "GET"
                },
                "isSimulation": config.isSandBox,
                "status": response.data.status,
                "merchantName": response.data.merchantName
              });
              setAcceptedPaymentMethods([paymentMethods.TELEBIRR]);
            }

            setLoading(false);
          } else {
            //! check if the bill is paid for the reference number
            const billStatError = { "success": false, "data": null, "status": null, "error": `Bill status error. The bill might already be paid. \nBill STATUS: ${response.data.status}.` };
            onBillCreationError(billStatError);
          }
        } else {
          onBillCreationError(response);
        }
      }
    }

  }

  const onReqClose = (shouldNavToPay) => {
    if (shouldNavToPay) {
      setShouldNavToPay(false);
    } else {
      Alert.alert('Warning', 'Are You Sure?', [
        {
          text: 'Yes', onPress: () => onClose()
        },
        {
          text: 'No', onPress: () => {
          }, style: 'cancel'
        },
      ],
        {
          cancelable: true
        }
      );
    }
  }

  const capitalizeFirstLetter = ([first, ...rest], locale = navigator.language) => first.toLocaleUpperCase(locale) + rest.join('');

  const getMerchantName = () => {
    if (data) {
      if (data.merchantName) {
        return data.merchantName;
      } else {
        return config.merchantName;
      }
    } else {
      return config.merchantName;
    }
  }


  return (
    <SafeAreaView style={{ height: windowHeight, backgroundColor: colors.white }}>

      {(() => {

        return (
          <Modal
            animationType="slide"
            transparent={false}
            visible={isVisible}
            onShow={onShow}
            onRequestClose={() => onReqClose(shouldNavToPay)}
            style={{ backgroundColor: colors.white }}
          >

            {(() => {
              if (!hasConfigError) {
                if (loading) {

                  return (
                    <View style={{ height: windowHeight, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <ActivityIndicator size="large" color={colors.orange} />
                      <Text style={{ marginTop: windowHeight * 0.01 }}>Loading</Text>
                    </View>
                  );

                } else {
                  if (!shouldNavToPay) {

                    return (
                      <View style={{ height: windowHeight, width: windowWidth, justifyContent: 'space-between' }}>

                        <View>
                          <View style={{ backgroundColor: colors.orange, width: windowWidth, height: windowHeight * 0.06, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.8, shadowRadius: 1 }}>
                            <Text style={{ fontSize: 24, color: colors.white, fontWeight: '600' }}>medapay</Text>
                          </View>

                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20.0, width: windowWidth, height: windowHeight * 0.07, backgroundColor: colors.lightGray }}>
                            <View style={{ alignItems: 'flex-start' }}>
                              <Text style={{ fontSize: 10, fontWeight: '600', color: colors.gray }}>CUSTOMER NAME</Text>
                              <Text style={{ color: colors.black, fontWeight: 'bold', fontSize: 16 }}>{config.data.purchaseDetails.customerName}</Text>
                            </View>

                            <View style={{ alignItems: 'flex-end' }}>
                              <Text style={{ fontSize: 10, fontWeight: '600', color: colors.gray }}>PHONE NUMBER</Text>
                              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.orange }}>{config.data.purchaseDetails.customerPhoneNumber}</Text>
                            </View>
                          </View>

                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: windowHeight * 0.01, paddingHorizontal: 20.0, paddingVertical: 5.0 }}>
                            <View>
                              <Text style={{ color: colors.black, fontWeight: '600', fontSize: 16 }}>Merchant Name</Text>
                              <Text style={{ fontSize: 20, fontWeight: '500', color: colors.gray }}>{capitalizeFirstLetter(getMerchantName())}</Text>

                            </View>

                            <View>
                              <Text style={{ color: colors.black, fontWeight: '600', fontSize: 16 }}>Amount</Text>
                              <Text style={{ fontSize: 22, fontWeight: '600', color: colors.orange }}>{config.data.purchaseDetails.amount} Br.</Text>
                            </View>
                          </View>

                          <View style={{ paddingHorizontal: 20.0, marginVertical: 15.0 }}>
                            <Text style={{ color: colors.black, fontWeight: '600', fontSize: 16 }}>Reference Number</Text>
                            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.gray }}>This is a unique payment identifier</Text>

                            {(() => {

                              if (data !== null) {
                                if (data.billReferenceNumber !== null) {
                                  return (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                                      <ReferenceNumberBox billNumber={data.billReferenceNumber[0]} />
                                      <ReferenceNumberBox billNumber={data.billReferenceNumber[1]} />
                                      <ReferenceNumberBox billNumber={data.billReferenceNumber[2]} />
                                      <ReferenceNumberBox billNumber={data.billReferenceNumber[3]} />
                                      <ReferenceNumberBox billNumber={data.billReferenceNumber[4]} />
                                      <ReferenceNumberBox billNumber={data.billReferenceNumber[5]} />
                                      <ReferenceNumberBox billNumber={data.billReferenceNumber[6]} />
                                      <ReferenceNumberBox billNumber={data.billReferenceNumber[7]} />
                                    </View>
                                  );
                                }
                              }
                            })()}

                          </View>

                          <View style={{ paddingHorizontal: 20.0, marginVertical: 5.0 }}>
                            <Text style={{ color: colors.black, fontWeight: '600', fontSize: 16 }}>Payment Method</Text>
                            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.gray }}>Choose your payment method</Text>
                          </View>
                        </View>

                        <ScrollView >
                          <View style={{ paddingHorizontal: 20.0, marginVertical: 15.0 }}>
                            {
                              (() => {
                                if (acceptedPaymentMethods.length !== 0) {
                                  if (acceptedPaymentMethods.includes(paymentMethods.TELEBIRR)) {
                                    return (
                                      <PaymentMethodButton onPress={() => {
                                        setSelectedPayMethod(paymentMethods.TELEBIRR);
                                        onPaymentMethodSelected(paymentMethods.TELEBIRR);
                                      }} title={'Telebirr'} description={'Powered by Ethiotelecom'} imageSrc={require('../assets/telebirr.png')} isSelected={selectedPayMethod === paymentMethods.TELEBIRR ? true : false} btnStyles={{}} />
                                    );
                                  }
                                }

                              })()
                            }

                            {
                              (() => {
                                if (acceptedPaymentMethods.length !== 0) {
                                  if (acceptedPaymentMethods.includes(paymentMethods.CBEBIRR)) {
                                    return (
                                      <PaymentMethodButton onPress={() => {
                                        setSelectedPayMethod(paymentMethods.CBEBIRR);
                                        onPaymentMethodSelected(paymentMethods.CBEBIRR);
                                      }} title={'CBE Birr'} description={'Commercial Bank Of Ethiopia'} imageSrc={require('../assets/cbebirr.png')} isSelected={selectedPayMethod === paymentMethods.CBEBIRR ? true : false} btnStyles={{}} />
                                    );
                                  }
                                }
                              })()
                            }

                            {
                              (() => {
                                if (acceptedPaymentMethods.length !== 0) {
                                  if (acceptedPaymentMethods.includes(paymentMethods.AMOLE)) {
                                    return (
                                      <PaymentMethodButton onPress={() => {
                                        setSelectedPayMethod(paymentMethods.AMOLE);
                                        onPaymentMethodSelected(paymentMethods.AMOLE);
                                      }} title={'Amole'} description={'Powered by Dashen Bank'} imageSrc={require('../assets/amole.png')} isSelected={selectedPayMethod === paymentMethods.AMOLE ? true : false} btnStyles={{}} />
                                    );
                                  }
                                }
                              })()
                            }

                            {
                              (() => {
                                if (acceptedPaymentMethods.length !== 0) {
                                  if (acceptedPaymentMethods.includes(paymentMethods.BOA)) {
                                    return (
                                      <PaymentMethodButton onPress={() => {
                                        setSelectedPayMethod(paymentMethods.BOA);
                                        onPaymentMethodSelected(paymentMethods.BOA);
                                      }} title={'Abyssinia Bank'} description={'Bank of Abyssinia'} imageSrc={require('../assets/boa.png')} isSelected={selectedPayMethod === paymentMethods.BOA ? true : false} btnStyles={{}} />
                                    );
                                  }
                                }
                              })()
                            }

                            {
                              (() => {
                                if (acceptedPaymentMethods.length !== 0) {
                                  if (acceptedPaymentMethods.includes(paymentMethods.EBIRR)) {
                                    return (
                                      <PaymentMethodButton onPress={() => {
                                        setSelectedPayMethod(paymentMethods.EBIRR);
                                        onPaymentMethodSelected(paymentMethods.EBIRR);
                                      }} title={'EBirr'} description={''} imageSrc={require('../assets/ebirr.png')} isSelected={selectedPayMethod === paymentMethods.EBIRR ? true : false} btnStyles={{}} />

                                    );
                                  }
                                }
                              })()
                            }
                          </View>
                        </ScrollView>

                        <View style={{ paddingHorizontal: 20.0, paddingVertical: 10.0, height: windowHeight * 0.13 }}>


                          <View style={{ borderTopColor: colors.darkGray, borderTopWidth: 1, flexDirection: 'row', alignItems: 'center', paddingTop: windowHeight * 0.007 }}>
                            <Pressable onPress={() => {
                              //!Cancel btn
                              Alert.alert('Warning', 'Are You Sure?', [
                                {
                                  text: 'Yes', onPress: () => onCancel()
                                },
                                {
                                  text: 'No', onPress: () => {
                                  }, style: 'cancel'
                                },
                              ],
                                {
                                  cancelable: true
                                }
                              );
                            }} style={{ backgroundColor: colors.white, borderColor: colors.darkGray, borderWidth: 1, flex: 1, paddingVertical: windowHeight * 0.015, borderRadius: 5, flexDirection: 'row', justifyContent: 'center' }}
                              android_ripple={{ color: colors.rippleColor }}>
                              <View >
                                <Text style={{ color: colors.black, fontWeight: '600', fontSize: 16 }}>Cancel</Text>
                              </View>
                            </Pressable>

                            <Pressable onPress={() => {
                              //!Continue btn
                              if (selectedPayMethod !== null) {
                                setShouldNavToPay(true);
                              } else {
                                Alert.alert('Alert', 'Please select a payment method.');
                              }
                            }} style={{ backgroundColor: colors.teal, flex: 2, marginLeft: windowWidth * 0.02, paddingVertical: windowHeight * 0.015, borderRadius: 5, flexDirection: 'row', justifyContent: 'center' }}
                              android_ripple={{ color: colors.rippleColor }}>
                              <Text style={{ color: colors.white, fontWeight: '600', fontSize: 16 }}>Continue</Text>
                            </Pressable>
                          </View>
                        </View>
                      </View>
                    );

                  } else {
                    if (selectedPayMethod === paymentMethods.TELEBIRR) {
                      return (
                        <MedapayTelebirr
                          data={data}
                          config={config}
                          onPaymentCancel={() => {
                            setShouldNavToPay(false);
                          }}
                          onPaymentCompleted={() => {
                            onPaymentCompleted();
                          }}
                        />
                      );
                    } else if (selectedPayMethod === paymentMethods.AMOLE) {
                      return (
                        <MedapayAmole
                          data={data}
                          config={config}
                          //!payment start fix needed ?no way to detect 
                          // onPaymentStart={() => {
                          // }}
                          onPaymentCancel={() => {
                            setShouldNavToPay(false);
                          }}

                          onPaymentCompleted={() => {
                            onPaymentCompleted();
                          }}
                        />
                      );
                    } else if (selectedPayMethod === paymentMethods.BOA) {
                      return (
                        <MedapayBoa
                          data={data}
                          config={config}
                          onPaymentStart={() => {
                          }}
                          onPaymentCancel={() => {
                            setShouldNavToPay(false);
                          }}
                        //TODO: needs onPayment completed callback
                        />
                      );
                    } else if (selectedPayMethod === paymentMethods.CBEBIRR) {
                      return (
                        <MedapayCbe
                          data={data}
                          config={config}
                          onPaymentCompleted={() => {
                            onPaymentCompleted();
                          }}
                          onCancelPress={()=>{
                            setShouldNavToPay(false);
                          }}
                        //!needs onPayment completed callback
                        />
                      );
                    } else if (selectedPayMethod === paymentMethods.EBIRR) {
                      return (
                        <MedapayEbirr
                          data={data}
                          config={config}
                          onPaymentCompleted={() => {
                            onPaymentCompleted();
                          }}
                          onPaymentError={onPaymentError}
                        />
                      );
                    }
                  }

                }
              } else {
                return (
                  <View>
                    <Text>Incorrect Configuration</Text>
                  </View>
                );
              }

            })()}

          </Modal>
        );

      })()}

    </SafeAreaView>
  );
}


//!Components
//!
const ReferenceNumberBox = ({ billNumber }) => {
  return (
    <View style={{ height: 60, width: 35, marginRight: 10, borderColor: colors.darkGray, borderWidth: 1, borderRadius: 3, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 28, fontWeight: '600', color: colors.darkGray }}>{billNumber}</Text>
    </View>
  );
}

const PaymentMethodButton = ({ onPress, title, description, imageSrc, btnStyles, isSelected }) => {

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderColor: isSelected ? colors.orange : colors.lightGray, borderWidth: 2, borderRadius: 5, height: windowHeight * 0.075, marginTop: windowHeight * 0.01, paddingHorizontal: 5, ...btnStyles }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          <Image
            style={{ width: windowWidth * 0.1, height: windowHeight * 0.05, marginRight: windowWidth * 0.02, borderRadius: 5 }}
            source={imageSrc}
          />
          <View>
            <Text style={{ fontSize: 15, fontWeight: '500', color: colors.black }}>{title}</Text>
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.gray }}>{description}</Text>
          </View>
        </View>

        {isSelected && (
          <Image
            style={{ width: windowWidth * 0.0675, height: windowHeight * 0.0395, marginRight: windowWidth * 0.02, borderRadius: 5 }}
            source={require('../assets/ticked.png')}
          />
        )}

      </View>
    </TouchableOpacity>
  );
}

export const checkBillStat = async (authToken, refNumber, isSandBox) => {
  const baseUrl = isSandBox ? 'https://api.sandbox.pay.meda.chat' : 'https://api.pay.meda.chat';
  const url = `${baseUrl}/v1/bills/${refNumber}`;

  try {
    const response = await fetch(`${baseUrl}/v1/bills/${refNumber}`, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      return { "success": true, "data": data, "status": response.status, "error": null };
    } else {
      const data = await response.json();
      return { "success": false, "data": null, "status": response.status, "error": data.message };
    }

  } catch (error) {
    return { "success": false, "data": null, "status": null, "error": error };
  }
}


//!comps

//!Amole
const MedapayAmole = ({ data, config, onPaymentCancel, onPaymentCompleted }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: `${getBaseUrl(config)}/dp/amole/${data.billReferenceNumber}` }}
        onLoadEnd={(navigationEvent) => {
          setLoading(false);
        }}
        headers={{
          "Authorization": config.Authorization,
          "x-access-from": "mobile-app"
        }}
        style={{ marginTop: 20 }}

        onNavigationStateChange={(navigationEvent) => {
          if (!navigationEvent.loading) {
            if (navigationEvent.url.includes(`/dp/amole/${data.billReferenceNumber}`) && navigationEvent.title === 'MedaPay™ | Amole Payment Successful') {
              onPaymentCompleted();
            }
          }
        }}
      />
      {!loading && (
        <Pressable onPress={() => {
          onPaymentCancel();
        }}
          style={{ height: windowHeight * 0.075, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, borderRadius: 5, backgroundColor: colors.lightRed, marginBottom: 10 }}
          android_ripple={{ color: colors.rippleColor }}
        >
          <Text style={{ color: colors.white, fontSize: 18, fontWeight: '600' }}>Cancel</Text>
        </Pressable>
      )}

      {
        (() => {
          if (loading) {
            return (
              <View style={{ height: windowHeight, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.orange} />
                <Text style={{ marginTop: windowHeight * 0.01, color: colors.orange }}>Loading</Text>
              </View>
            );
          }
        })()
      }

    </View>

  );
}


//!BOA

const MedapayBoa = ({ data, config, onPaymentCancel, onPaymentStart }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //
  }, []);

  return (
    <View style={{ flex: 1 }}>

      <WebView
        source={{ uri: `${getBaseUrl(config)}/dp/boa/${data.billReferenceNumber}` }}
        onLoadEnd={() => {
          setLoading(false);
        }}
        headers={{
          "Authorization": config.Authorization,
          "x-access-from": "mobile-app"
        }}
        style={{ marginTop: 20 }}

        onNavigationStateChange={(navigationEvent) => {

          if (!navigationEvent.loading) {

            if (navigationEvent.url.includes('cybersource.com') && navigationEvent.title === 'Payment Acceptance - Billing Information (Step 1 of 4)') {
              onPaymentStart();
            }

            if (navigationEvent.url.includes('/canceled')) {
              onPaymentCancel();
            }

            if (navigationEvent.url.includes('/receipt')) {
              onPaymentCompleted();
            }

          }

        }}
      />

      {
        (() => {
          if (loading) {
            return (
              <View style={{ height: windowHeight, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.orange} />
                <Text style={{ marginTop: windowHeight * 0.01, color: colors.orange }}>Loading</Text>
              </View>
            );
          }
        })()
      }

    </View>
  );
}


//!CBE

const callNumber = (phone) => {
  let phoneNumber = phone;

  if (Platform.OS !== 'android') {
    phoneNumber = `telprompt:${phone}`;
  }
  else {
    phoneNumber = `tel:${phone}`;
  }

  Linking.canOpenURL(phoneNumber).then(supported => {
    if (!supported) {
      Alert.alert('Phone number is not available');
    } else {
      return Linking.openURL(phoneNumber);
    }
  }).catch(err => {
    console.error(err);
  });
};


const MedapayCbe = ({ data, config, onPaymentCompleted, onCancelPress }) => {
  const [loading, setLoading] = useState(false);

  const phoneNumber = `*847*5*2*717171*${data.billReferenceNumber}#`;

  useEffect(() => {
    // Linking.openURL(`tel:${phoneNumber}`);
  }, []);

  const checkPayStatus = async() =>{
    setLoading(true);
    try {
      const result = await checkBillStat(config.Authorization, data.billReferenceNumber, data.isSandBox);
      if(result.status === 200){
        if(result.data.status === "PAYED"){
          onPaymentCompleted();
          setLoading(false);
        }else{
          //!payment not done yet
          Alert.alert('Alert', 'Please complete payment first.');
          setLoading(false);
        }
      }else{
        //!payment check error
        Alert.alert('Alert', 'Something went wrong. Please try again.');
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      //!payment check error
      Alert.alert('Alert', 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{flexDirection: 'column', alignItems: 'center', padding: 20}}>
       <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
          <ReferenceNumberBox billNumber={data.billReferenceNumber[0]} />
          <ReferenceNumberBox billNumber={data.billReferenceNumber[1]} />
          <ReferenceNumberBox billNumber={data.billReferenceNumber[2]} />
          <ReferenceNumberBox billNumber={data.billReferenceNumber[3]} />
          <ReferenceNumberBox billNumber={data.billReferenceNumber[4]} />
          <ReferenceNumberBox billNumber={data.billReferenceNumber[5]} />
          <ReferenceNumberBox billNumber={data.billReferenceNumber[6]} />
          <ReferenceNumberBox billNumber={data.billReferenceNumber[7]} />
        </View>
      <View style={{flexDirection: 'column', alignItems: 'flex-start'}} >
        <Text style={{fontWeight: 'bold', fontSize: 18, color: '#000', marginVertical: 15}}>Steps to complete payment:</Text>

        <Text style={cbeStyles.stepStyle}><Text style={{...cbeStyles.stepStyle, fontSize: 18, fontWeight: '600'}}>1. </Text>Dial *847# (CBE Birr USSD) on your phone.</Text>
        <Text style={cbeStyles.stepStyle}><Text style={{...cbeStyles.stepStyle, fontSize: 18, fontWeight: '600'}}>2. </Text>Reply 5 for Pay Bill.</Text>
        <Text style={cbeStyles.stepStyle}><Text style={{...cbeStyles.stepStyle, fontSize: 18, fontWeight: '600'}}>3. </Text>Reply 2 for Input Short Code.</Text>
        <Text style={cbeStyles.stepStyle}><Text style={{...cbeStyles.stepStyle, fontSize: 18, fontWeight: '600'}}>4. </Text>Enter 717171 (MedaChat merchant short code) when promoted.</Text>
        <Text style={cbeStyles.stepStyle}><Text style={{...cbeStyles.stepStyle, fontSize: 18, fontWeight: '600'}}>5. </Text>{`When requested for Bill Reference No. \nEnter ${data.billReferenceNumber} as shown above.`}</Text>
        <Text style={cbeStyles.stepStyle}><Text style={{...cbeStyles.stepStyle, fontSize: 18, fontWeight: '600'}}>6. </Text>When requested to confirm the payment, Reply 1.</Text>
        <Text style={cbeStyles.stepStyle}><Text style={{...cbeStyles.stepStyle, fontSize: 18, fontWeight: '600'}}>7. </Text>Enter your CBE Birr PIN to complete the payment and you are done.</Text>

        <Text style={{marginVertical: 20, color: '#5800FF', fontSize: 18}}>{`${phoneNumber}`}</Text>

        <Text style={{marginBottom: 20}}>Once you have completed the payment. you will receive SMS notification from CBE Birr and you can proceed to complete purchase using the following button.</Text>

      </View>
     
      <TouchableOpacity onPress={()=> checkPayStatus()}>
        <View style={{width: windowWidth * 0.9, backgroundColor: '#EF5B0C', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5.0,  height: windowHeight * 0.075}}>
          {(()=>{
            if(loading){
              return (
                <ActivityIndicator color={'#fff'} size={30}/>
              );
            }else{
              return (
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Complete Payment</Text>
              );
            }
          })()}
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={onCancelPress}>
        <Text style={{color: '#000', marginTop: 10}}>Cancel Payment</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const cbeStyles = StyleSheet.create({
  stepStyle: {
    fontSize: 16,
    marginTop: 5,
    color: '#000'
  }
});




//!Ebirr

const MedapayEbirr = ({ data, config, onPaymentCompleted, onPaymentError }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pay();
  }, []);

  const pay = async () => {
    const response = await initPayment();
    if (response.success) {
      onPaymentCompleted();
    } else {
      onPaymentError(response);
    }
  }

  const initPayment = async () => {
    const baseUrl = `${getBaseUrl(config)}/api/ebirr/prepare`;

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.Authorization}`
        },
        body: JSON.stringify({
          "referenceNo": data.billReferenceNumber
        })
      });

      if (response.status == 200) {
        setLoading(false);
        const data = await response.json();
        if (data.status === "PAYED") {
          return { "success": true, "data": null, "status": 200, "error": null };
        }
      } else {
        setLoading(false);
        const data = await response.json();
        if (data.errorCode == "E10205" && data.responseMsg.includes('User Aborted')) {
          return { "success": false, "data": null, "status": null, "error": "User Aborted." };
        } else if (data.errorCode == "E10205" && data.responseMsg.includes('Invalid Credentials')) {
          return { "success": false, "data": null, "status": null, "error": "Invalid Credentials" };
        } else {
          return { "success": false, "data": null, "status": null, "error": data.responseMsg };
        }
      }
    } catch (error) {
      setLoading(false);
      return { "success": false, "data": null, "status": null, "error": error };
    }
  }

  return (
    <View>
      {
        (() => {
          if (loading) {
            return (
              <View style={{ height: windowHeight, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.orange} />
                <Text style={{ marginTop: windowHeight * 0.01, color: colors.orange }}>Loading</Text>
              </View>
            );
          } else {
            return (
              <View></View>
            );
          }
        })()
      }
    </View>

  );
}

//!Telebirr
const MedapayTelebirr = ({ data, config, onPaymentCancel, onPaymentCompleted }) => {
  const [loading, setLoading] = useState(true);
  const [reqUrl, setReqUrl] = useState(`https://telebirr.pay.meda.chat/production/pay/${data.billReferenceNumber}`);


  useEffect(() => {
    // isTelebirrInstalled();
  }, []);

  // const isTelebirrInstalled = async () => {
  //   const telebirrPackageName = "cn.tydic.ethiopay";
  //   setLoading(true);

  // try {
  //   await SharedGroupPreferences.isAppInstalledAndroid(telebirrPackageName);
  // console.log("Telebirr is installed on this device");
  // //!Open telebirr app and pay
  //   const baseUrl = 'https://app.ethiomobilemoney.et:2121/ammapi/payment/service-openup/toTradeMobielPay';
  //   const shortCode = "500291";
  //   const TELEBIRR_API_KEY = 'dd6ac349f7f24afc9deb09bdf218d384';
  //   const TELEBIRR_API_ID = '0ade18aaa8bb498e851da6393b977d6a';

  //   {
  //     "appId":"ce83aaa3dedd42ab88bd017ce1ca2dd8",
  //     "nonce":"8a743de3ae3346e9920ecc46200226d3",
  //     "notifyUrl":"http://www.google.com/notifyUrl",
  //     "outTradeNo":"426af391569b4e39b449d24b30bef93b",
  //     "receiveName":"Org Name",
  //     "returnApp":{
  //       "PackageName":"cn.tydic.ethiopay",
  //       "Activity":"cn.tydic.ethiopay.PayForOtherAppActivity"
  //     },
  //     "shortCode":"10011",
  //     "subject":"Goods Name",
  //     "timeoutExpress":"30",
  //     "totalAmount":"10"
  //   }
  //   setLoading(false);
  // } catch (err) {
  // console.log("Telebirr is not installed");
  //!Generate qr code if cant display the web 
  //   setLoading(false);
  // }
  // }


  return (
    <View style={{ flex: 1 }}>

      <WebView
        source={{ uri: reqUrl }}
        isVisible={false}
        onLoadEnd={() => {
          // setLoading(false);
        }}
        headers={{
          "Authorization": config.Authorization,
          // "x-access-from": "mobile-app"
        }}

        onNavigationStateChange={(navigationEvent) => {
          if (!navigationEvent.loading) {
            const sdkPayUrl = navigationEvent.url.replace('ammwebpay', 'ammsdkpay');
            setReqUrl(sdkPayUrl);

            if (navigationEvent.url.includes('ammsdkpay')) {
              setLoading(false);
            }

            if (navigationEvent.url.includes('result?status=200')) {
              onPaymentCompleted();
            }
          }
        }}

        style={{ marginTop: 20 }}
      />

      {!loading && (
        <Pressable onPress={() => {
          onPaymentCancel();
        }}
          style={{ height: windowHeight * 0.075, justifyContent: 'center', position: 'absolute', top: 0, alignItems: 'center', marginHorizontal: 10, borderRadius: 5, backgroundColor: colors.white, marginBottom: 10 }}
          android_ripple={{ color: colors.rippleColor }}
        >
          <Text style={{ color: colors.black, fontSize: 18, fontWeight: '600', paddingHorizontal: 20 }}>X</Text>
        </Pressable>
      )}

      {
        (() => {
          if (loading) {
            return (
              <View style={{ height: windowHeight, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.orange} />
                <Text style={{ marginTop: windowHeight * 0.01 }}>Loading</Text>
              </View>
            );
          }
        })()
      }

    </View>
  );
}


export default MedaPayModal;