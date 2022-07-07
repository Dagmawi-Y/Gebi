import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';
import {Text} from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/AntDesign';
import routes from '../../navigation/routes';
import {StateContext} from '../../global/context';
import colors from '../../config/colors';

const Edit = ({route, navigation}) => {
  const {user} = useContext(StateContext);
  const {data, itemId} = route.params;

  const [successAnimation, setSuccessAnimation] = useState(false);
  const [failedAnimation, setFailedAnimation] = useState(false);
  const [writtingData, setWrittingData] = useState(false);

  const [errorMessage, setErrorNessage] = useState('');

  const [supplierName, setSupplierName] = useState('');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [photo, setPhoto] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [category, setCategory] = useState('');

  const quantifiers = ['pieces', 'Kilo-gram', 'Litres'];
  const categories = ['Phones', 'Desktops', 'Home appliances'];

  const populate = () => {
    setSupplierName(data.stock.supplier_name);
    setItemName(data.item_name);
    setPhoto(data.photo);
    setQuantity(data.stock.quantity);
    setUnit(data.stock.unit);
    setUnitPrice(data.stock.unit_price);
    setCategory(data.stock.category);
  };

  const checkEmpty = () => {
    if (!supplierName) return true;
    if (!itemName) return true;
    if (!quantity) return true;
    if (!unit) return true;
    // if (!photo) return true;
    if (!unitPrice) return true;
    return false;
  };
  const raiseError = msg => {
    setErrorNessage(msg);
    setFailedAnimation(true);
  };

  const updateItem = async () => {
    if (checkEmpty()) return raiseError('Empty Fields are not allowed');
    setWrittingData(true);

    try {
      await firestore()
        .collection('inventory')
        .doc(itemId)
        .update({
          item_name: itemName,
          photo: 'photourl',
          stock: {
            supplier_name: supplierName,
            quantity: quantity,
            date: new Date().toLocaleDateString(),
            unit: unit,
            category: category,
            unit_price: unitPrice,
          },
        });

      setWrittingData(false);
      setSuccessAnimation(true);
      setTimeout(() => {
        setSuccessAnimation(false);
        navigation.navigate(routes.inventory);
      }, 500);
      setTimeout(() => {}, 600);
    } catch (error) {
      setWrittingData(false);
      raiseError(`Something went wrong.\nTry again.`);
      console.log(error);
    }
  };

  useEffect(() => {
    populate();
  }, []);

  return (
    <View style={styles.container}>
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
              speed={1.3}
              autoPlay
              loop={false}
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
              onPress={updateItem}
            />
          </View>
        </Pressable>
      ) : null}
      <KeyboardAvoidingView style={styles.contentContainer}>
        <ScrollView>
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
                  setQuantity(val.replace(/[^0-9]/g, ''));
                }}
                value={quantity.toString()}
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
                  setUnitPrice(val.replace(/[^0-9]/g, ''));
                }}
                value={unitPrice}
                keyboardType="numeric"
                placeholderTextColor={colors.faded_grey}
              />
            </View>
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
              አይነት
            </Text>
            <SelectDropdown
              data={categories}
              defaultButtonText="የአቃው አይነት"
              renderDropdownIcon={() => (
                <View>
                  <Icon name="caretdown" size={20} color={colors.black} />
                </View>
              )}
              defaultValue={category.toString()}
              buttonStyle={styles.dropDown}
              onSelect={selectedItem => {
                setCategory(selectedItem);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
            />
            <Text
              style={{
                color: colors.black,
                fontSize: 20,
                marginBottom: 5,
              }}>
              መለኪያ
            </Text>
            <SelectDropdown
              data={quantifiers}
              defaultButtonText="የብዛት መለኪየ"
              renderDropdownIcon={() => (
                <View>
                  <Icon name="caretdown" size={20} color={colors.black} />
                </View>
              )}
              defaultValue={unit.toString()}
              buttonStyle={styles.dropDown}
              onSelect={selectedItem => {
                setUnit(selectedItem);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={updateItem}
            style={{
              width: '100%',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              backgroundColor: colors.primary,
            }}>
            <Text style={{color: colors.white, fontSize: 25}}>Update</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Edit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
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
  dropDown: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
    backgroundColor: colors.white,
  },
  boardTopTitle: {fontSize: 22, fontWeight: '900'},
  boardSubTitle: {color: colors.grey, fontWeight: 'bold', fontSize: 12},
});
