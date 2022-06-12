import {
  View,
  StyleSheet,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Input, Text} from '@rneui/themed';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {SvgXml} from 'react-native-svg';
import {SCREENS} from '../../constants/screens';
import {SafeAreaView} from 'react-native-safe-area-context';
import PhoneInput from 'react-native-phone-number-input';
import {Dimensions} from 'react-native';
import PhoneCodeInput from '../../Components/RegisterPhone/PhoneCodeInput';
import colors from '../../constants/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {StackActions} from '@react-navigation/native';
export default function RegisterPhone({navigation}: any) {
  useEffect(() => {
    // SystemNavigationBar.lightNavigationBar(false);
    SystemNavigationBar.setNavigationColor(colors.BODY_BACKGROUND_LIGHT);
    // SystemNavigationBar.fullScreen();
  }, []);
  const done = () => {
    navigation.navigate(SCREENS.Intro);
  };
  const [phoneNo, setPhoneNo] = useState();
  const [phoneCode, setPhoneCode] = useState('');
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
            style={{alignItems: 'center', marginTop: dimensions.height * 0.2}}>
            <Text h3 style={{marginBottom: 40, color: colors.APP_PRIMARY}}>
              ለመጀመር ይመዝገቡ
            </Text>
            {/* <Input
          label={'ስልክዎን ቁጥር ያስገቡ'}
          //   leftIcon={"test"}
          shake={() => {
            console.log('The hell dis');
          }}
          keyboardType={'phone-pad'}
        /> */}
          </View>
          <View style={{marginBottom: dimensions.height * 0.1}}>
            <Text style={{fontSize: 16, marginBottom: 5, fontWeight: 'bold'}}>
              የስልክዎን ቁጥር ያስገቡ
            </Text>
            <PhoneInput
              // ref={phoneInput}
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
                //   setFormattedValue(text);
                setPhoneNo(text);
              }}
              //   withDarkTheme
              //   withShadow
              //   autoFocus
            />
          </View>

          <View>
            <Text style={{fontSize: 16, marginBottom: 5, fontWeight: 'bold'}}>
              ወደ ቁጥሮ የተላከውን ኮድ ያስገቡ {`${phoneNo ?? ''}`}
            </Text>
            <PhoneCodeInput value={phoneCode} setValue={setPhoneCode} />
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
            title={'ቀጥል'}
            titleStyle={{fontWeight: 'bold', fontSize: 18}}
            buttonStyle={{
              // borderWidth: 5,
              borderColor: 'transparent',
              borderRadius: 25,
              paddingVertical: 10,
              justifyContent: 'space-between',
              paddingRight: 15,
            }}
            containerStyle={{
              marginVertical: 20,
            }}
            icon={{
              name: 'rightcircle',
              type: 'antdesign',
              size: 35,
              color: 'rgba(255,255,255,0.5)',
            }}
            iconRight
            onPress={() =>
              navigation.dispatch(StackActions.replace(SCREENS.RegisterUserInfo))
            }
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
    // padding: 20,
  },
});

RegisterPhone.routeName = 'RegisterPhone';
