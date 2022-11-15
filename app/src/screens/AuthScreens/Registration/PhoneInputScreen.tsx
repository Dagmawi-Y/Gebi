import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  KeyboardAvoidingView,
  StatusBar,
  Alert,
} from 'react-native';
import {Text} from '@rneui/themed';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Dimensions} from 'react-native';
import colors from '../../../config/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Button from '../../../components/misc/Button';
import Loading from '../../../components/lotties/Loading';
import {TouchableOpacity} from 'react-native-gesture-handler';
import StatusBox from '../../../components/misc/StatusBox';
import routes from '../../../navigation/routes';
import {StateContext} from '../../../global/context';
import {useTranslation} from 'react-i18next';

const PhoneInputScreen = ({navigation}) => {
  const {t} = useTranslation();
  const [phoneNumber, setphoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {user} = useContext(StateContext);

  const [minutes, setMinutes] = useState(0);
  const [start, setStart] = useState(Date.now());
  const [seconds, setSeconds] = useState(59);
  const [startCountDown, setStartCountDown] = useState(false);

  // OTP Section
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [code, setCode] = useState('');

  // Handle the button press
  async function signInWithPhoneNumber(number: string) {
    setError('');
    try {
      const phone = checkPhone(number.toString());

      if (phone) {
        setLoading(true);
        console.log('OTP', '+251' + phone);
        await auth()
          .signInWithPhoneNumber('+251' + phone)
          .then(confirmation => {
            console.log('SENT');
            setConfirm(confirmation);
            setLoading(false);
            setStartCountDown(true);
          }).catch(err=>{console.log(err)})
      }
    } catch (error) {
      setLoading(false);
      setError(t('Something_Went_Wrong'));
      console.log(error);
    }
  }

  const confirmCode = async () => {
    setLoading(true);
    try {
      const user = await confirm?.confirm(code);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(t('Invalid_Code'));
      setLoading(false);
    }
  };

  const checkPhone = (val: String) => {
    let num = val;

    if (val.startsWith('+251')) {
      num = val.substring(4);
    }
    if (val.startsWith('251')) {
      num = val.substring(3);
    }
    if (val.startsWith('0')) {
      num = val.substring(1);
    }
    if (num.length > 9 || num.length < 9 || !num.startsWith('9')) {
      setError(t('Wrong_Number'));
      return null;
    }
    setphoneNumber(num.toString());
    return num.toString();
  };
  // END OTP Section

  useEffect(() => {
    if (confirm) {
      let myInterval = setInterval(() => {
        const millis = Date.now() - start;
        const elapsed = Math.floor(millis / 1000);

        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(myInterval);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
      return () => {
        clearInterval(myInterval);
      };
    }
  }, [startCountDown, minutes, seconds]);

  useEffect(() => {
    user ? navigation.navigate(routes.register) : null;

    SystemNavigationBar.setNavigationColor(colors.light);
  }, [user]);

  let dimensions = Dimensions.get('window');

  return (
    <SafeAreaView style={[styles.container]}>
      {loading ? (
        <StatusBox
          msg={t('Please_Wait...')}
          type={'loading'}
          overlay={false}
          onPress={() => {}}
        />
      ) : (
        <View
          style={{
            paddingVertical: 10,
            justifyContent: 'space-evenly',
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
                  {t('Register_Here')} {}
                </Text>
              </View>
              <View style={{marginBottom: dimensions.height * 0.1}}>
                <Text
                  style={{fontSize: 23, marginBottom: 5, fontWeight: '500'}}>
                  {t('Enter_Your_Phone_Number')}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    borderRadius: 10,
                    borderWidth: 1,
                    padding: 0,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('../../../assets/ethiopianflag.png')}
                    style={{
                      width: 50,
                      height: 50,
                      marginHorizontal: 10,
                      borderRadius: 50,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 23,
                      marginLeft: 5,
                      fontWeight: 'bold',
                    }}>
                    +251
                  </Text>
                  <TextInput
                    style={[styles.phoneInput, {flexGrow: 1, marginRight: 0}]}
                    onChangeText={val => {
                      setError('');
                      setphoneNumber(val);
                    }}
                    value={phoneNumber}
                    placeholder={t('Enter_Phone_Number')}
                    keyboardType="numeric"
                    placeholderTextColor={colors.faded_grey}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'red',
                    marginVertical: 15,
                    paddingHorizontal: 10,
                  }}>
                  {error}
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    signInWithPhoneNumber(phoneNumber);
                  }}
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
                        fontSize: 26,
                        fontWeight: 'bold',
                        color: colors.white,
                      }}>
                      {t('Submit')}
                    </Text>
                    <Icon name={'arrow-right'} color={'white'} size={35} />
                  </View>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View
              style={{
                flex: 1,
                paddingTop: 150,
              }}>
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
                  source={require('../../../assets/logo-blue.png')}
                />
              </View>
              {minutes > 0 || seconds > 0 ? (
                <Text
                  style={{
                    fontSize: 20,
                    marginBottom: 10,
                    fontWeight: '500',
                    textAlign: 'center',
                    color: colors.primary,
                  }}>
                  {t('Send_Code_Again')}{' '}
                  <Text
                    style={{
                      fontSize: 20,
                      marginBottom: 10,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: colors.primary,
                    }}>
                    {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                  </Text>
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(t('Resend_Code'), t('Edit_Your_Phone_?'), [
                      {
                        text: t('Cancel'),
                        onPress: () => {},
                        style: 'default',
                      },
                      {
                        text: t('Edit'),
                        onPress: () => {
                          setConfirm(null);
                        },
                        style: 'default',
                      },
                      {
                        text: t('Resend_Code'),
                        onPress: () => {
                          signInWithPhoneNumber(phoneNumber);
                          setConfirm(null);
                        },
                        style: 'default',
                      },
                    ]);
                  }}
                  style={{
                    backgroundColor: colors.primary,
                    padding: 10,
                    borderRadius: 10,
                    alignSelf: 'center',
                    marginBottom: 10,
                    // width: 100,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: colors.white,
                    }}>
                    {t('Resend_Code')}
                  </Text>
                </TouchableOpacity>
              )}
              
              {phoneNumber ? (
                <View
                  style={{
                    marginBottom: 10,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      textAlign: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    ኮድ የተላከበት፡
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      color: colors.primary,
                      fontStyle: 'italic',
                      fontWeight: '600',
                    }}>
                    {' +251'}
                    {phoneNumber}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setConfirm(null)}
                    style={{
                      borderRadius: 5,
                      padding: 5,
                      marginLeft: 5,
                    }}>
                    <Icon name="lead-pencil" size={25} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ) : null}
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TextInput
                  style={[styles.confirmInput]}
                  onChangeText={(code: any) => setCode(code)}
                  value={code}
                  placeholder={`${t('Example')}: 123456`}
                  placeholderTextColor={colors.faded_grey}
                  keyboardType="numeric"
                />
                <Text
                  style={{
                    fontSize: 15,
                    color: 'red',
                    marginVertical: 15,
                    paddingHorizontal: 10,
                  }}>
                  {error}
                </Text>
              </View>
              <View
                style={{
                  flex: 0.2,
                  marginTop: 20,
                  justifyContent: 'space-around',
                  width: '80%',
                  alignSelf: 'center',
                }}>
                <Button
                  btnStyle={'normal'}
                  title={'አረጋግጥ'}
                  onPress={() => confirmCode()}
                />
              </View>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    marginHorizontal: 15,
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
    borderRadius: 10,
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
    fontSize: 15,
  },
  confirmInput: {
    color: colors.black,
    height: 50,
    backgroundColor: colors.white,
    elevation: 10,
    shadowColor: colors.transWhite,
    padding: 10,
    borderRadius: 10,
    fontSize: 23,
    marginVertical: 10,
    flexGrow: 1,
    width: '80%',
    textAlign: 'center',
  },
  phoneInput: {
    height: 60,
    margin: 12,
    color: colors.black,
    padding: 5,
    fontSize: 20,
  },
});

export default PhoneInputScreen;
PhoneInputScreen.routeName = 'RegisterPhone';
