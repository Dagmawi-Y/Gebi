import {
  View,
  StyleSheet,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Image,
  Animated,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Input, Text} from '@rneui/themed';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {SafeAreaView} from 'react-native-safe-area-context';
import PhoneInput from 'react-native-phone-number-input';
import {Dimensions} from 'react-native';
// import PhoneCodeInput from './PhoneCodeInput';
import colors from '../../config/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Button from '../../components/misc/Button';
import auth from '@react-native-firebase/auth';
import {color} from '@rneui/base';
import CustomTextInput from '../../components/Input/CustomTextInput';

export default function RegisterPhone({navigation}: any) {
  const [phoneNumber, setphoneNumber] = useState();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [error, setError] = useState('');

  // OTP Section
  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);

  const [code, setCode] = useState('');

  // Handle the button press
  async function signInWithPhoneNumber(phoneNumber) {
    try {
      setLoading(true);
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function confirmCode() {
    setLoading(true);
    try {
      await confirm.confirm(code);
      setLoading(false);
    } catch (error) {
      console.log('Invalid code.');
      setLoading(false);
    }
  }

  const handleCodeChange = value => {
    setCode(value);
  };
  // END OTP Section

  const onAuthStateChanged = user => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  const anonymousLogin = () => {
    auth()
      .signInAnonymously()
      .then(() => {
        console.log(user);
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    SystemNavigationBar.setNavigationColor(colors.light);
  }, []);

  let dimensions = Dimensions.get('window');

  return (
    <SafeAreaView style={[styles.container]}>
  
      {loading ? (
        <ActivityIndicator animating={true} />
      ) : (
        <KeyboardAwareScrollView
          enableOnAndroid
          contentContainerStyle={{
            paddingVertical: 10,
            justifyContent: 'space-between',
            display: 'flex',
            flexGrow: 1,
          }}>
          {!confirm ? (
            <>
              <View
                style={{
                  alignItems: 'center',
                  marginTop: dimensions.height * 0.2,
                }}>
                <Text h3 style={{marginBottom: 40, color: colors.primary}}>
                  ለመጀመር ይመዝገቡ
                </Text>
              </View>
              <View style={{marginBottom: dimensions.height * 0.1}}>
                <Text
                  style={{fontSize: 16, marginBottom: 5, fontWeight: 'bold'}}>
                  የስልክዎን ቁጥር ያስገቡ
                </Text>
                <PhoneInput
                  defaultValue={phoneNumber}
                  defaultCode="ET"
                  layout="first"
                  containerStyle={{width: '100%'}}
                  disableArrowIcon
                  countryPickerProps={{}}
                  placeholder="ስልክ ቂጥር"
                  onChangeFormattedText={(text: any) => {
                    setphoneNumber(text);
                  }}
                />
              </View>
              <View>
                <Button
                  btnStyle={'outlined'}
                  title={'ቀጥል'}
                  onPress={() => signInWithPhoneNumber(phoneNumber)}
                />
              </View>
            </>
          ) : (
            <View style={{flex: 0.6, justifyContent: 'center'}}>
              <View
                style={{
                  marginHorizontal: 'auto',
                  width: '100%',
                  marginBottom: 50,
                  maxHeight: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                }}>
                <Image
                  style={{resizeMode: 'center'}}
                  source={require('../../assets/logo-blue.png')}
                />
              </View>
              <Text
                style={{fontSize: 16, marginBottom: 10, fontWeight: 'bold'}}>
                {phoneNumber ? (
                  <Text
                    style={{
                      fontSize: 20,
                      width: '100%',
                      textAlign: 'center',
                    }}>
                    {' '}
                    ወደ{' '}
                    <Text
                      style={{
                        color: colors.primary,
                        fontStyle: 'italic',
                        fontWeight: '600',
                      }}>
                      {phoneNumber}
                      {'  '}
                    </Text>
                    የተላከውን ኮድ ያስገቡ
                  </Text>
                ) : (
                  ''
                )}
              </Text>
              <TextInput
                style={styles.confirmInput}
                onChangeText={(code: any) => setCode(code)}
                value={code}
                placeholder="ምሳሌ፡ 123456"
                placeholderTextColor={colors.faded_grey}
                keyboardType="numeric"
              />
              <View style={{flex: 0.2, justifyContent: 'space-around'}}>
                <Button
                  btnStyle={'normal'}
                  title={'አረጋግጥ'}
                  onPress={() => confirmCode()}
                />
                <Button
                  btnStyle={'outlined'}
                  title={'አረጋግጥ'}
                  onPress={() => confirmCode()}
                />
              </View>
            </View>
          )}
        </KeyboardAwareScrollView>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    // backgroundColor: "blue",
    flex: 1,
    display: 'flex',
    marginHorizontal: 15,
    // justifyContent: 'center',
    // alignItems: 'center'
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
  },
});

RegisterPhone.routeName = 'RegisterPhone';
