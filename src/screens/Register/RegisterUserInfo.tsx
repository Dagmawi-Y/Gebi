import {
  View,
  StyleSheet,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Input, Text, useTheme} from '@rneui/themed';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {SvgXml} from 'react-native-svg';
import {SCREENS} from '../../constants/screens';
import {SafeAreaView} from 'react-native-safe-area-context';
import PhoneInput from 'react-native-phone-number-input';
import {Dimensions} from 'react-native';
import colors from '../../constants/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DropDownPicker from 'react-native-dropdown-picker';
import {periodGoals, goalToPeriod} from '../../constants/timePeriods';
import { StackActions } from '@react-navigation/native';
export default function RegisterUserInfo({navigation}: any) {
  useEffect(() => {
    SystemNavigationBar.lightNavigationBar(false);
    SystemNavigationBar.setNavigationColor(colors.BODY_BACKGROUND_LIGHT);
    // SystemNavigationBar.fullScreen();
  }, []);
  const done = () => {
    // input.current.shake();
  };
  const [items, setItems] = useState([
    {label: periodGoals.DAILY, value: periodGoals.DAILY},
    {label: periodGoals.MONTHLY, value: periodGoals.MONTHLY},
    {label: periodGoals.SIX_MONTHS, value: periodGoals.SIX_MONTHS},
    {label: periodGoals.ANUALY, value: periodGoals.ANUALY},
  ]);
  const [period, setPeriod] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  let dimensions = Dimensions.get('window');
  const {theme} = useTheme();
  const input = React.createRef();
  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.BODY_BACKGROUND_LIGHT}
      />
      <KeyboardAwareScrollView
        nestedScrollEnabled
        enableOnAndroid
        contentContainerStyle={{
          paddingVertical: 10,
          paddingTop: 20,

          justifyContent: 'space-between',
          display: 'flex',
          flexGrow: 1,
        }}>
        <View>
          <View style={{alignItems: 'center', marginHorizontal: 5}}>
            <Text h3 style={{color: colors.APP_PRIMARY, marginBottom: 5}}>
              የግል እና የንግድ መረጃ
            </Text>
            <Text style={{fontSize: 16, marginBottom: 5, fontWeight: 'bold'}}>
              ይህ መረጃ የእርስዎን መለያ ለማዘጋጀት ጥቅም ላይ ይውላል
            </Text>
            <View style={styles.formContainer}>
              <Input
                containerStyle={styles.inputContainer}
                label={'ሙሉ ስም'}
                labelStyle={{marginBottom: 2}}
                shake={() => {
                  console.log('Shake ?');
                }}
              />
              <Input
                containerStyle={styles.inputContainer}
                label={'የንግድ ስምዎ (ድርጅት ካሎት)?'}
                labelStyle={{marginBottom: 2}}
                shake={() => {
                  console.log('Shake ?');
                }}
              />
              <View style={{marginHorizontal: 10, marginBottom: 25}}>
                <Text
                  style={{
                    fontSize: 16,
                    marginBottom: 5,
                    fontWeight: 'bold',
                    color: theme.colors.grey3,
                  }}>
                  የትርፍ ግብዎን ለምን ያህል ግዜ ማቀድ ይፈልጋሉ?
                </Text>
                <DropDownPicker
                  style={{
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#77869E',
                  }}
                  setOpen={setDropdownOpen}
                  listMode="SCROLLVIEW"
                  open={dropdownOpen}
                  value={period}
                  items={items}
                  setValue={setPeriod}
                  setItems={setItems}
                />
              </View>
              <Input
                label={`ምን ያህል ብር ${goalToPeriod(period)} መስራት ያስባሉ?`}
                labelStyle={{marginBottom: 2}}
                shake={() => {
                  console.log('The hell dis');
                }}
                keyboardType={'numeric'}
              />
            </View>
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
              navigation.dispatch(
                StackActions.replace(SCREENS.RegisterSuccess),
              )
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
  formContainer: {
    marginVertical: 10,
    width: '100%',
  },
  inputContainer: {},
});

RegisterUserInfo.routeName = 'RegisterUserInfo';
