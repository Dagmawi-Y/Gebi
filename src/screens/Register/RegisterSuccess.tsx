import {
  View,
  StyleSheet,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  ScrollView,
  Image,
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
import Quote from '../../../assets/images/quotes.svg';
import { StackActions } from '@react-navigation/native';
export default function RegisterSuccess({navigation}: any) {
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
        <View
          style={{
            alignItems: 'center',
            marginHorizontal: 5,
            flex: 1,
            flexGrow: 1,
          }}>
          <Image
            // style={styles.tinyLogo}
            source={require('../../../assets/images/register_success.png')}
            style={{marginVertical: 25}}
          />
          <Text h3 style={{color: colors.APP_PRIMARY, marginBottom: 5}}>
            እንኳን ደስ አላችሁ!
          </Text>
          <Text style={{fontSize: 16, marginBottom: 5, fontWeight: 'bold'}}>
            መለያዎን በተሳካ ሁኔታ አቀናብረውታል!
          </Text>
          <View style={styles.quoteContainer}>
            <View style={{position: 'absolute', left: 0, right: 0}}>
              <SvgXml width="150" height="150" xml={Quote} />
            </View>
            <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text style={{fontSize: 28, textAlign: 'center'}}>
              " ለስኬት ምንም ሚስጥሮች የሉም። የዝግጅት፣ የድካም እና ከውድቀት የመማር ውጤት ነው። "
            </Text>
            <View>
              <Text style={{fontSize:14,fontWeight:"bold",marginVertical:10,fontStyle:"italic"}}>- Colin Powell</Text>
            </View>
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
              navigation.dispatch(StackActions.replace(SCREENS.ChooseRoute))
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
  quoteContainer: {
    margin: 20,
    width: '100%',
    flex: 1,
    flexGrow: 1,
  },
});

RegisterSuccess.routeName = 'RegisterSuccess';
