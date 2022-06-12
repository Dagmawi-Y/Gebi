import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  Button,
  ButtonGroup,
  Divider,
  Image,
  Input,
  ListItem,
  Text,
  useTheme,
} from '@rneui/themed';
import Dropdown from '../../Components/global/Dropdown';
import AntdIcons from 'react-native-vector-icons/AntDesign';
import DatePickerCustom from '../../Components/global/DatePicker';
import RadioButton from '../../Components/global/RadioButton';
import {PAYMENT_TYPES} from '../../constants/paymentTypes';
import colors from '../../constants/colors';
const ItemDetails = ({navigation}: any) => {
  const {theme} = useTheme();
  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView style={{flex: 1}}>
        <KeyboardAwareScrollView
          enableOnAndroid
          contentContainerStyle={[styles.keyboardAwareScrollContainer]}>
          {/* <View>
          </View> */}
          <View
            style={{
              backgroundColor: 'white',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 25,
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={{fontSize: 22, marginBottom: 5}}>የእቃ ስም</Text>
              <Text style={{fontSize: 22, fontWeight: 'bold'}}>
                ሲሚንቶ 50 ኪ.ግ
              </Text>
            </View>
            <View>
              <Image
                style={{width: 100, height: 100}}
                resizeMode="contain"
                source={require('../../../assets/images/cement.png')}
              />
            </View>
          </View>
          <Text
            style={{
              fontSize: 22,
              marginTop: 25,
              fontWeight: 'bold',
            }}>
            ዕቃ መረጃ
          </Text>
          <View style={styles.boardContainer}>
            <View style={styles.boardCol}>
              <Text style={styles.boardTopTitle}>የመሸጫ ዋጋ</Text>
              <Text style={styles.boardSubTitle}>300 ብር</Text>
            </View>
            <View style={styles.boardCol}>
              <Text style={styles.boardTopTitle}>ያሉ እቃዎች</Text>
              <Text style={styles.boardSubTitle}>38 አሁን አለ</Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 22,
              marginTop: 25,
              fontWeight: 'bold',
            }}>
            የእቃ ታሪክ
          </Text>
          <View style={{marginVertical: 20}}>
            <View style={tableStyles.thead}>
              <Text style={tableStyles.theadFont}>ዋጋ</Text>
              <Text style={tableStyles.theadFont}>ብዛት</Text>
              <Text style={tableStyles.theadFont}>ቀን</Text>
            </View>
            {[1, 2, 3, 4].map(e => {
              return <View style={[tableStyles.trow,{backgroundColor:e%2!=0?"transparent":"white"}]}>
                <Text style={tableStyles.trowFont}>3000 ብር</Text>
                <Text style={tableStyles.trowFont}>20 pcs</Text>
                <Text style={tableStyles.trowFont}>2/3/2021</Text>
              </View>;
            })}
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ItemDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    marginHorizontal: 15,
  },
  keyboardAwareScrollContainer: {
    paddingVertical: 10,
    justifyContent: 'space-between',
    display: 'flex',
    flexGrow: 1,
    flex: 1,
  },
  boardContainer: {
    marginVertical: 15,
    backgroundColor: 'white',
    height: 80,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  boardCol: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardTopTitle: {fontSize: 18},
  boardSubTitle: {
    color: colors.FADED_BLACK_1,
    fontWeight: 'bold',
    fontSize: 22,
  },
});

const tableStyles = StyleSheet.create({
  thead: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  theadFont: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trow: {
    justifyContent: 'space-between',
    flexDirection:"row",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  trowFont: {
    fontSize: 16,
  },
  oddRow: {
    backgroundColor: 'transparent',
  },
  evenRow: {
    backgroundColor: 'white',
  },
});

ItemDetails.routeName = 'ItemDetails';
