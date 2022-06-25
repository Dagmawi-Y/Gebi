import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Dimensions} from 'react-native';
import colors from '../../../config/colors';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SelectDropdown from 'react-native-select-dropdown';

const PhoneInputScreen = ({navigator}) => {
  const [phoneNumber, setphoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Section
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [code, setCode] = useState('');

  // Handle the button press
  async function signInWithPhoneNumber(n) {
    try {
      if (n.length > 9 || n.length < 9 || !n.startsWith('9')) {
        setError('Invalid phone number');
        return;
      }
      setLoading(true);
      console.log(n);
      const confirmation = await auth().signInWithPhoneNumber('+251' + n);
      setConfirm(confirmation);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const confirmCode = async () => {
    setLoading(true);
    try {
      await confirm?.confirm(code);
      setLoading(false);
    } catch (error) {
      console.log('Invalid code.');
      setLoading(false);
    }
  };

  const checkPhone = (val: String) => {};
  // END OTP Section

  useEffect(() => {
    SystemNavigationBar.setNavigationColor(colors.light);
  }, []);

  let dimensions = Dimensions.get('window');

  const dropDownOptions = ['pieces', 'Kilo-gram', 'Litres'];

  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView>
        <View
          style={{
            alignItems: 'center',
            marginTop: 20,
          }}>
          <Text
            style={{
              marginVertical: 30,
              color: colors.primary,
              fontSize: 40,
              fontWeight: 'bold',
            }}>
            የግል እና የንግድ መረጃ
          </Text>
        </View>
        <View>
          <Text style={styles.inputLable}>ሙሉ ስም</Text>
          <View
            style={{
              flexDirection: 'row',
              borderRadius: 10,
              borderWidth: 1,
              padding: 0,
              alignItems: 'center',
            }}>
            <TextInput
              style={[styles.input, {flexGrow: 1, marginRight: 0}]}
              onChangeText={val => {
                setError('');
                setphoneNumber(val);
              }}
              value={phoneNumber}
              placeholder="ሙሉ ስም"
              keyboardType="default"
              placeholderTextColor={colors.faded_grey}
            />
          </View>
          <Text
            style={{
              fontSize: 20,
              color: 'red',
              marginVertical: 15,
              paddingHorizontal: 10,
            }}>
            {error}
          </Text>
        </View>
        <View>
          <Text style={styles.inputLable}>{'የንግድ ስምዎ (ድርጅት ካሎት)'}</Text>
          <View
            style={{
              flexDirection: 'row',
              borderRadius: 10,
              borderWidth: 1,
              padding: 0,
              alignItems: 'center',
            }}>
            <TextInput
              style={[styles.input, {flexGrow: 1, marginRight: 0}]}
              onChangeText={val => {
                setError('');
                setphoneNumber(val);
              }}
              value={phoneNumber}
              placeholder="ሙሉ ስም"
              keyboardType="default"
              placeholderTextColor={colors.faded_grey}
            />
          </View>
          <Text
            style={{
              fontSize: 20,
              color: 'red',
              marginVertical: 15,
              paddingHorizontal: 10,
            }}>
            {error}
          </Text>
        </View>
        <View>
          <Text style={styles.inputLable}>የትርፍ ግብዎን ለምን ያህል ግዜ ማቀድ ይፈልጋሉ?</Text>
          <View
            style={{
              flexDirection: 'row',
              borderRadius: 10,
              borderWidth: 1,
              padding: 0,
              alignItems: 'center',
            }}>
            <SelectDropdown
              data={dropDownOptions}
              renderDropdownIcon={() => (
                <View>
                  <Icon name="caretdown" size={20} color={colors.black} />
                </View>
              )}
              buttonStyle={styles.dropDown}
              onSelect={selectedItem => {}}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
            />
          </View>
          <Text
            style={{
              fontSize: 20,
              color: 'red',
              marginVertical: 15,
              paddingHorizontal: 10,
            }}>
            {error}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => signInWithPhoneNumber(phoneNumber)}
            activeOpacity={0.7}
            style={{
              width: '100%',
              height: 70,
              justifyContent: 'center',
              borderRadius: 30,
              backgroundColor: colors.primary,
              paddingHorizontal: 30,
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 25,
                  color: colors.white,
                }}>
                ቀጥል
              </Text>
              <Icon name={'arrow-right'} color={'white'} size={35} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightBlue,
    flex: 1,
    display: 'flex',
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'space-between',
    display: 'flex',
  },
  buttonStyle: {
    backgroundColor: 'green',
    borderColor: 'transparent',
    borderRadius: 25,
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingRight: 15,
  },
  buttonGrayStyle: {
    borderColor: 'transparent',
    borderRadius: 25,
    paddingVertical: 10,
    justifyContent: 'space-between',
    paddingRight: 15,
    flexGrow: 1,
  },
  buttonTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  confirmInput: {
    color: colors.black,
    height: 50,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    fontSize: 20,
    marginBottom: 20,
    flexGrow: 1,
  },
  input: {
    height: 40,
    margin: 12,

    color: colors.black,
    padding: 5,
    fontSize: 20,
  },
  inputLable: {
    fontSize: 25,
    marginBottom: 5,
    color: colors.black,
  },
  dropDown: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
    backgroundColor: colors.white,
  },
});

export default PhoneInputScreen;
PhoneInputScreen.routeName = 'RegisterPhone';
