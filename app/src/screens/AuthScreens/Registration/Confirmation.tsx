import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  KeyboardAvoidingView,
  StatusBar,
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

const PhoneInputScreen = ({navigation, route}) => {
  const {resendCode} = route.params;

  const {t} = useTranslation();
  const [phoneNumber, setphoneNumber] = useState('');
  const [error, setError] = useState('');
  const [countDown, setCountDown]: any = useState(0);
  const [loading, setLoading] = useState(false);
  const {user} = useContext(StateContext);

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(5);

  // OTP Section
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [code, setCode] = useState('');

  const confirmCode = () => {
    setLoading(true);
    try {
      confirm?.confirm(code);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    user ? navigation.navigate(routes.register) : null;

    SystemNavigationBar.setNavigationColor(colors.light);
  }, [user]);

  useEffect(() => {
    let myInterval = setInterval(() => {
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
  });

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
                  fontSize: 18,
                  marginBottom: 10,
                  fontWeight: '500',
                  textAlign: 'center',
                  color: colors.primary,
                }}>
                {t('Send_Code_Again_In')}{' '}
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
              <TouchableOpacity onPress={() => resendCode()}>
                <Text
                  style={{
                    fontSize: 16,
                    marginBottom: 10,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Resend Code
                </Text>
              </TouchableOpacity>
            )}

            <Text
              style={{
                fontSize: 16,
                marginBottom: 10,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {phoneNumber ? (
                <Text
                  style={{
                    fontSize: 23,
                    width: '100%',
                    textAlign: 'center',
                  }}>
                  {' '}
                  ወደ
                  <Text
                    style={{
                      color: colors.primary,
                      fontStyle: 'italic',
                      fontWeight: '600',
                    }}>
                    {' +251'}
                    {phoneNumber}
                    {'  '}
                  </Text>
                  የተላከውን ኮድ ያስገቡ
                </Text>
              ) : (
                ''
              )}
            </Text>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TextInput
                style={[styles.confirmInput]}
                onChangeText={(code: any) => setCode(code)}
                value={code}
                placeholder={'ምሳሌ፡ 123456'}
                placeholderTextColor={colors.faded_grey}
                keyboardType="numeric"
              />
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
    fontSize: 23,
  },
});

export default PhoneInputScreen;
PhoneInputScreen.routeName = 'RegisterPhone';
