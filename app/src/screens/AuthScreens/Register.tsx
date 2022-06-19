import {
  View,
  StyleSheet,
  StatusBar,
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

export default function RegisterPhone({navigation}: any) {
  const [phoneNo, setPhoneNo] = useState();
  const [phoneCode, setPhoneCode] = useState('');
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

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
      <StatusBar barStyle="light-content" backgroundColor={'#EEF1F2'} />

      <KeyboardAwareScrollView
        enableOnAndroid
        contentContainerStyle={{
          paddingVertical: 10,
          justifyContent: 'space-between',
          display: 'flex',
          flexGrow: 1,
        }}>
        <View>
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
            <Text style={{fontSize: 16, marginBottom: 5, fontWeight: 'bold'}}>
              የስልክዎን ቁጥር ያስገቡ
            </Text>
            <PhoneInput
              defaultValue={phoneNo}
              defaultCode="ET"
              layout="first"
              containerStyle={{width: '100%'}}
              disableArrowIcon
              countryPickerProps={{}}
              placeholder="ስልክ ቂጥር"
              onChangeText={(text: any) => {
                console.log(text);
              }}
              onChangeFormattedText={(text: any) => {
                setPhoneNo(text);
              }}
            />
          </View>

          <View>
            <Text style={{fontSize: 16, marginBottom: 5, fontWeight: 'bold'}}>
              ወደ ቁጥሮ የተላከውን ኮድ ያስገቡ {`${phoneNo ?? ''}`}
            </Text>
            <Text
              style={{
                fontSize: 14,
                marginTop: 20,
                textDecorationLine: 'underline',
              }}>
              ኮድ እንደገና ላክ
            </Text>
          </View>
        </View>
        <View>
          <Button
            btnStyle={'outlined'}
            title={'ቀጥል'}
            onPress={() => alert('registering')}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    marginHorizontal: 15,
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
});

RegisterPhone.routeName = 'RegisterPhone';
