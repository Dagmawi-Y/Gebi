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
import {SCREENS} from '../constants/screens';
import {SafeAreaView} from 'react-native-safe-area-context';
import PhoneInput from 'react-native-phone-number-input';
import {Dimensions} from 'react-native';
import {StackActions} from '@react-navigation/native';
import colors from '../constants/colors';
import RouteButton from '../Components/ChooseRouet/RouteButton';
export default function ChooseRoute({navigation}: any) {
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
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 10,
          justifyContent: 'flex-start',
          display: 'flex',
          flexGrow: 1,
        }}>
        <View
          style={{alignItems: 'center', marginTop: dimensions.height * 0.2}}>
          <Text h3 style={{marginBottom: 40, color: colors.APP_PRIMARY}}>
            የት መሄድ ይፈልጋሉ?
          </Text>
        </View>
        <View>
          <RouteButton
            onPress={() =>
              navigation.dispatch(StackActions.replace(SCREENS.TabRoute))
            }
            title={`ሽያጭ`}
          />
          <RouteButton
            onPress={() =>
              navigation.dispatch(StackActions.replace(SCREENS.TabRoute))
            }
            title={`እቃ ክፍል`}
          />
          <RouteButton
            onPress={() =>
              navigation.dispatch(StackActions.replace(SCREENS.TabRoute))
            }
            title={`የገንዘብ እቅድ`}
          />
          <RouteButton
            onPress={() =>
              navigation.dispatch(StackActions.replace(SCREENS.TabRoute))
            }
            title={`የስራ እቅድ`}
          />
          <RouteButton
            onPress={() =>
              navigation.dispatch(StackActions.replace(SCREENS.TabRoute))
            }
            title={`ግንበኛ`}
          />
          <RouteButton
            onPress={() =>
              navigation.dispatch(StackActions.replace(SCREENS.TabRoute))
            }
            title={`ትርፍ ማስያ`}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    marginHorizontal: 15,
  },
});

ChooseRoute.routeName = 'ChooseRoute';
