import {
  View,
  TextInput,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, SpeedDial, Text} from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';

import TopBar from '../../components/TopBar/TopBar';
import Loading from '../../components/lotties/Loading';
import EmptyBox from '../../components/lotties/EmptyBox';
import InvetoryListItem from './InventoryListItem';
import AddNew from './AddNew';
import routes from '../../navigation/routes';
import colors from '../../config/colors';

export default function Items({navigation}) {
  const [data, setData]: Array<any> = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [successAnimation, setSuccessAnimation] = useState(false);
  const [failedAnimation, setFailedAnimation] = useState(false);
  const [writtingData, setWrittingData] = useState(false);

  const [errorMessage, setErrorNessage] = useState('');

  const [supplierName, setSupplierName] = useState('');
  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('');
  const [photo, setPhoto] = useState('');
  const [unitPrice, setUnitPrice] = useState('');

  const reset = () => {
    setSuccessAnimation(false);
    setFailedAnimation(false);
    setWrittingData(false);
  };
  const checkEmpty = () => {
    if (!supplierName) return true;
    if (!itemName) return true;
    if (!amount) return true;
    if (!unit) return true;
    // if (!photo) return true;
    if (!unitPrice) return true;
    return false;
  };
  const raiseError = msg => {
    setErrorNessage(msg);
    setFailedAnimation(true);
  };

  const getInventory = async () => {
    setLoading(true);
    try {
      firestore()
        .collection('inventory')
        .onSnapshot(querySnapshot => {
          let result: Array<Object> = [];
          querySnapshot.forEach(documentSnapshot => {
            result.push({
              id: documentSnapshot.id,
              doc: documentSnapshot.data(),
            });
          });
          setData(result);
        });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const addNewInventory = async () => {
    if (checkEmpty()) return raiseError('Empty Fields are not allowed');
    setWrittingData(true);

    try {
      await firestore()
        .collection('inventory')
        .add({
          amount: amount,
          date: new Date(),
          item_name: itemName,
          photo: 'photoId',
          supplier_name: supplierName,
          unit: 'number',
          unit_price: '35540',
        })
        .then(res => {
          setWrittingData(false);
          setSuccessAnimation(true);
          setTimeout(() => {
            setSuccessAnimation(false);
            setModalVisible(false);
          }, 500);
          setTimeout(() => {
            setModalVisible(false);
          }, 600);
        });
    } catch (error) {
      setWrittingData(false);
      raiseError(`Something went wrong.\nTry again.`);
      console.log(error);
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    getInventory();
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView>
          {/* MODAL ADD NEW ITEM*/}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              console.log('Closed');
              toggleModal();
            }}>
            {writtingData ? (
              <View
                style={{
                  position: 'absolute',
                  zIndex: 12,
                  flex: 1,
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#00000060',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    height: 100,
                    borderRadius: 20,
                    aspectRatio: 1,
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <LottieView
                    style={{
                      height: 80,
                      backgroundColor: '#fff',
                    }}
                    source={require('../../assets/loading.json')}
                    autoPlay
                    loop={true}
                  />
                </View>
              </View>
            ) : successAnimation ? (
              <View
                style={{
                  position: 'absolute',
                  zIndex: 12,
                  flex: 1,
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#00000060',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    height: 100,
                    borderRadius: 20,
                    aspectRatio: 1,
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <LottieView
                    style={{
                      height: 80,
                      backgroundColor: '#fff',
                    }}
                    source={require('../../assets/success.json')}
                    speed={1.3}
                    autoPlay
                    loop={false}
                  />
                </View>
              </View>
            ) : failedAnimation ? (
              <Pressable
                onPress={() => {
                  setFailedAnimation(false);
                  setWrittingData(false);
                  setSuccessAnimation(false);
                }}
                style={{
                  position: 'absolute',
                  zIndex: 12,
                  flex: 1,
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#00000060',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    height: 250,
                    borderRadius: 20,
                    aspectRatio: 1,
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <LottieView
                    style={{
                      height: 80,
                      backgroundColor: '#fff',
                    }}
                    source={require('../../assets/failed.json')}
                    speed={1.3}
                    autoPlay
                    loop={false}
                  />
                  <Text
                    style={{
                      fontSize: 20,
                      textAlign: 'center',
                    }}>
                    {errorMessage}
                  </Text>
                  <Icon
                    name="refresh"
                    size={50}
                    color={colors.primary}
                    style={{alignSelf: 'center', marginTop: 40}}
                    onPress={addNewInventory}
                  />
                </View>
              </Pressable>
            ) : null}
            <View
              style={{
                padding: 10,
                flex: 1,
                backgroundColor: '#00000060',
              }}>
              <ScrollView>
                <View
                  style={{
                    flex: 8,
                    backgroundColor: '#fff',
                    marginBottom: 20,
                    borderRadius: 20,
                    padding: 20,
                  }}>
                  <TouchableOpacity onPress={() => toggleModal()}>
                    <Icon
                      name="close"
                      size={25}
                      color={colors.black}
                      style={{alignSelf: 'flex-end'}}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 30,
                      color: colors.primary,
                      textAlign: 'center',
                      marginVertical: 20,
                    }}>
                    የእቃ መመዝቢያ ፎርም
                  </Text>
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: 20,
                      marginBottom: 5,
                    }}>
                    የአከፋፋይ ስም
                  </Text>
                  <TextInput
                    style={[styles.Input]}
                    onChangeText={val => {
                      setSupplierName(val);
                    }}
                    value={supplierName}
                    keyboardType="default"
                    placeholderTextColor={colors.faded_grey}
                  />
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: 20,
                      marginBottom: 5,
                    }}>
                    የእቃ ስም
                  </Text>
                  <TextInput
                    style={[styles.Input]}
                    onChangeText={val => {
                      setItemName(val);
                    }}
                    value={itemName}
                    keyboardType="default"
                    placeholderTextColor={colors.faded_grey}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}>
                    <View
                      style={{
                        flex: 1,
                        marginHorizontal: 5,
                      }}>
                      <Text
                        style={{
                          color: colors.black,
                          fontSize: 20,
                          marginBottom: 5,
                        }}>
                        ብዛት
                      </Text>
                      <TextInput
                        style={[styles.Input]}
                        onChangeText={val => {
                          setAmount(val);
                        }}
                        value={amount}
                        keyboardType="numeric"
                        placeholderTextColor={colors.faded_grey}
                      />
                    </View>

                    <View
                      style={{
                        flex: 1,
                        marginHorizontal: 5,
                      }}>
                      <Text
                        style={{
                          color: colors.black,
                          fontSize: 20,
                          marginBottom: 5,
                        }}>
                        የአንዱ ዋጋ
                      </Text>
                      <TextInput
                        style={[styles.Input]}
                        onChangeText={val => {
                          setUnitPrice(val);
                        }}
                        value={unitPrice}
                        keyboardType="numeric"
                        placeholderTextColor={colors.faded_grey}
                      />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        marginHorizontal: 5,
                      }}>
                      <Text
                        style={{
                          color: colors.black,
                          fontSize: 20,
                          marginBottom: 5,
                        }}>
                        መለኪያ
                      </Text>
                      <TextInput
                        style={[styles.Input]}
                        onChangeText={val => {
                          setUnit(val);
                        }}
                        value={unit}
                        keyboardType="default"
                        placeholderTextColor={colors.faded_grey}
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={{
                      width: '100%',
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 10,
                      backgroundColor: colors.primary,
                    }}>
                    <Text style={{color: colors.white, fontSize: 25}}>
                      የእቃ ፎቶ ማያያዣ
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
              <View style={{flex: 2}}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={addNewInventory}
                  style={{
                    width: '100%',
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                    backgroundColor: colors.primary,
                  }}>
                  <Text style={{color: colors.white, fontSize: 25}}>ጨምር</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
        {/* MODAL END */}

        <TopBar
          title={'የእቃ ክፍል'}
          income={''}
          expense={''}
          calc={false}
          totalCost={'234,008 ብር'}
          totalItem={'314'}
        />

        <View style={styles.contentContainer}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 5,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                color: colors.faded_dark,
              }}>
              ያሉ አቃዎች
            </Text>
            <TouchableOpacity
              style={styles.buttonwithIcon}
              onPress={() => {
                setSuccessAnimation(false);
                setWrittingData(false);
                setModalVisible(true);
              }}>
              <Text
                style={{
                  color: colors.black,
                }}>
                Add New
              </Text>
              <Icon
                name="plus"
                size={25}
                color={colors.black}
                style={{alignSelf: 'flex-end'}}
                onPress={() => {
                  setWrittingData(false);
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonwithIcon}
              onPress={() =>
                navigation.navigate('AuthNavigator', {screen: 'Login'})
              }>
              <Image
                source={require('./qr_icon.png')}
                style={{width: 20, height: 20}}></Image>
              <Text
                style={{
                  color: colors.black,
                }}>
                Print QR
              </Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <Loading size={40} />
          ) : (
            <ScrollView>
              {data.length == 0 ? (
                <EmptyBox message={'Inventory Empty'} />
              ) : data.length > 0 ? (
                <View style={{}}>
                  {data.map((item, i) => {
                    return (
                      <InvetoryListItem
                        key={i}
                        title={item.doc.item_name}
                        unitPrice={item.doc.unit_price}
                        amount={item.doc.amount}
                      />
                    );
                  })}
                </View>
              ) : null}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
  },
  boardContainer: {
    marginHorizontal: 5,
    marginVertical: 20,
    backgroundColor: 'white',
    height: 80,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  boardCol: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonwithIcon: {
    backgroundColor: colors.lightBlue,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    width: '25%',
    padding: 10,
    gap: 2,
  },
  Input: {
    color: colors.black,
    height: 50,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    fontSize: 20,
    marginBottom: 20,
  },
  boardTopTitle: {fontSize: 22, fontWeight: '900'},
  boardSubTitle: {color: colors.grey, fontWeight: 'bold', fontSize: 12},
});
