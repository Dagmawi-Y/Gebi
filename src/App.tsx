import React from 'react';
import Splash from './screens/Splash';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {SCREENS} from './constants/screens';
import customTheme from './constants/customTheme';
import Intro from './screens/Intro';
import ChooseLanguage from './screens/ChooseLanguage';
import RegisterPhone from './screens/Register/RegisterPhone';
import {createTheme, ThemeProvider} from '@rneui/themed';
import colors from './constants/colors';
import RegisterUserInfo from './screens/Register/RegisterUserInfo';
import DropDownPicker from 'react-native-dropdown-picker';
import RegisterSuccess from './screens/Register/RegisterSuccess';
import ChooseRoute from './screens/ChooseRoute';
import Tabs from './screens/TabBarScreen';
import CreateNewSales from './screens/Sales/CreateNewSales';
import UpdateSales from './screens/Sales/UpdateSales';
import ItemDetails from './screens/Items/ItemDetail';
import QRList from './screens/Items/QRList';
const Stack = createNativeStackNavigator();
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.BODY_BACKGROUND_LIGHT,
  },
};
DropDownPicker.addTranslation('AM', {
  PLACEHOLDER: 'ይምረጡ',
  SEARCH_PLACEHOLDER: 'ይፍልጉ',
  SELECTED_ITEMS_COUNT_TEXT: '{count} ምርጫዎችን መርጠዋል', // See below for advanced options
  NOTHING_TO_SHOW: 'የሚታይ ምርጫ የለም',
});
DropDownPicker.setLanguage('AM');

const theme = createTheme({
  Input: {
    inputContainerStyle: {
      backgroundColor: 'white',
      borderWidth: 1,
      // borderColor:"#77869E",
      borderRadius: 5,
    },
    labelStyle: {
      // color:"black"
    },
  },
  lightColors: {
    primary: colors.APP_PRIMARY,
  },
  darkColors: {
    primary: colors.APP_PRIMARY,
  },
});
const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <NavigationContainer theme={MyTheme}>
          <Stack.Navigator initialRouteName={SCREENS.TabRoute}>
            <Stack.Screen
              name={SCREENS.Splash}
              component={Splash}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={SCREENS.ChooseLanguage}
              component={ChooseLanguage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={SCREENS.Intro}
              component={Intro}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={SCREENS.RegisterPhone}
              component={RegisterPhone}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={SCREENS.RegisterUserInfo}
              component={RegisterUserInfo}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={SCREENS.RegisterSuccess}
              component={RegisterSuccess}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={SCREENS.ChooseRoute}
              component={ChooseRoute}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={SCREENS.TabRoute}
              component={Tabs}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={SCREENS.CreateNewSales}
              component={CreateNewSales}
              options={{
                title: 'አዲስ የሽያጭ ደረሰኝ',
                headerStyle: {
                  backgroundColor: colors.BODY_BACKGROUND_LIGHT,
                },
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name={SCREENS.UpdateSales}
              component={UpdateSales}
              options={{
                title: 'የሽያጭ ደረሰኝ',
                headerStyle: {
                  backgroundColor: colors.BODY_BACKGROUND_LIGHT,
                },
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name={SCREENS.ItemDetails}
              component={ItemDetails}
              options={{
                title: 'ዕቃ መረጃ',
                headerStyle: {
                  backgroundColor: colors.APP_PRIMARY,
                },
                headerTitleStyle:{
                  color:"white"
                },
                headerShadowVisible: false,
                headerTintColor:"white",
              }}

            />
            <Stack.Screen
              name={SCREENS.QRList}
              component={QRList}
              options={{
                title: 'ዕቃ መረጃ',
                headerStyle: {
                  backgroundColor: colors.APP_PRIMARY,
                },
                headerTitleStyle:{
                  color:"white"
                },
                headerShadowVisible: false,
                headerTintColor:"white",
              }}

            />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
