import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  Button,
  ButtonGroup,
  Divider,
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
const UpdateSales = ({navigation}: any) => {
  const [customer, setCustomer] = useState('ABC building');
  const [date, setDate] = useState(new Date());
  const {theme} = useTheme();
  const [items, setitems] = useState([1, 2, 3]);
  const [paymentType, setPaymentType] = useState<String | null>(
    PAYMENT_TYPES.CASH,
  );
  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView style={{flex: 1}}>
        <KeyboardAwareScrollView
          enableOnAndroid
          contentContainerStyle={[styles.keyboardAwareScrollContainer]}>
          <View>
            <DatePickerCustom
              label="የክፍያ መጠየቂያ ቀን"
              value={date}
              setValue={setDate}
              containerStyle={{height: 85, marginBottom: 0}}
            />

            <Input
              label={`የደረሰኝ ቁጥር`}
              value={'235467897654'}
              containerStyle={{height: 85}}
              labelStyle={{marginBottom: 2}}
              shake={() => {
                console.log('The hell dis');
              }}
            />
            <Dropdown
              label="ደንበኛ"
              value={customer}
              setValue={setCustomer}
              dropdownItems={[{label: 'ABC building', value: 'ABC building'}]}
              containerStyle={{height: 85, marginBottom: 0}}
            />
            <View style={{marginHorizontal: 10, marginBottom: 10}}>
              <Text
                style={{
                  fontSize: 16,
                  marginBottom: 5,
                  fontWeight: 'bold',
                  color: theme.colors.grey3,
                }}>
                {`የእቃዎች ዝርዝር  `}
              </Text>

              {items.map(i => (
                <ListItem
                  bottomDivider
                  key={i}
                  containerStyle={{borderRadius: 5}}>
                  <AntdIcons
                    name={'minuscircleo'}
                    color={'grey'}
                    size={20}
                    onPress={() => {
                      var itemss = [...items];
                      itemss.pop();
                      setitems(itemss);
                    }}
                  />
                  <ListItem.Content>
                    <ListItem.Title style={{fontWeight: 'bold'}}>
                      {'ሲሚንቶ 50 ኪ.ግ'}
                    </ListItem.Title>
                    <ListItem.Subtitle
                      style={{fontSize: 16, fontWeight: 'bold'}}>
                      {'3 ብዛት'}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                  <Text style={{color: 'green', fontSize: 16}}>6,000 ብር</Text>
                </ListItem>
              ))}
              <Button
                containerStyle={{
                  marginTop: 10,
                  width: '50%',
                  alignSelf: 'center',
                }}
                titleStyle={{fontSize: 14}}
                onPress={() => {
                  var itemss = [...items];
                  itemss.push(itemss[itemss.length - 1] + 1);
                  setitems(itemss);
                }}
                title="አዲስ እቃ ጨምር"></Button>
            </View>
            <View style={styles.whiteContainer}>
              <View style={styles.priceRow}>
                <Text style={styles.priceRowText}>ድምር</Text>
                <Text style={styles.priceRowText}>12,500.50 ብር</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceRowText}>ታክስ (15% ቫት)</Text>
                <Text style={styles.priceRowText}>1,875.07 ብር</Text>
              </View>
              <Divider style={{marginBottom: 5}} />
              <View style={styles.priceRow}>
                <Text style={styles.totalPriceRowText}>አጠቃላይ ድምር</Text>
                <Text style={styles.totalPriceRowText}>14,375.57 ብር</Text>
              </View>
            </View>
            <View style={styles.whiteContainer}>
              <Text
                style={{
                  fontSize: 16,
                  marginBottom: 10,
                  fontWeight: 'bold',
                  color: theme.colors.grey3,
                }}>
                {`የክፍያ አይነት`}
              </Text>
              <View style={styles.radioButtonContainer}>
                <RadioButton
                  data={{label: 'ዱቤ', value: PAYMENT_TYPES.CREDIT}}
                  onPress={(e: string) => setPaymentType(e)}
                  selected={paymentType == PAYMENT_TYPES.CREDIT}
                />
                <RadioButton
                  data={{label: 'ካሽ', value: PAYMENT_TYPES.CASH}}
                  onPress={(e: string) => setPaymentType(e)}
                  selected={paymentType == PAYMENT_TYPES.CASH}
                />
                <RadioButton
                  data={{label: 'ቼክ', value: PAYMENT_TYPES.CHECK}}
                  onPress={(e: string) => setPaymentType(e)}
                  selected={paymentType == PAYMENT_TYPES.CHECK}
                />
              </View>
            </View>
          </View>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Button
              title={'አስገባ'}
              titleStyle={{fontWeight: 'bold', fontSize: 18}}
              buttonStyle={{
                // borderWidth: 5,
                borderColor: 'transparent',
                borderRadius: 5,
                paddingVertical: 10,
                justifyContent: 'space-between',
                paddingRight: 15,
                backgroundColor: '#1BC773',
              }}
              containerStyle={{
                marginTop: 20,
                marginBottom: 5,
                flex: 1,
                marginHorizontal: 10,
              }}
              icon={{
                name: 'check',
                type: 'antdesign',
                size: 35,
                color: 'rgba(255,255,255,0.5)',
              }}
              iconRight
              onPress={() => navigation.pop()}
            />
            <Button
              title={'ተመላሽ አርግ'}
              titleStyle={{fontWeight: 'bold', fontSize: 18}}
              buttonStyle={{
                // borderWidth: 5,
                borderColor: 'transparent',
                borderRadius: 5,
                paddingVertical: 10,
                justifyContent: 'space-between',
                paddingRight: 15,
                backgroundColor: '#F24750',
              }}
              containerStyle={{
                marginTop: 20,
                marginBottom: 5,
                flex: 1,
                marginHorizontal: 10,
              }}
              icon={{
                name: 'close',
                type: 'antdesign',
                size: 35,
                color: 'rgba(255,255,255,0.5)',
              }}
              iconRight
              onPress={() => navigation.pop()}
            />
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateSales;

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
  whiteContainer: {
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 10,
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  priceRow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceRowText: {
    color: '#6F6F6F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalPriceRowText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

UpdateSales.routeName = 'UpdateSales';
