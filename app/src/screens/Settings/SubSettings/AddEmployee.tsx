import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {StateContext} from '../../../global/context';
import firestore from '@react-native-firebase/firestore';
import colors from '../../../config/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import StatusBox from '../../../components/misc/StatusBox';

const AddEmployee = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const {userInfo} = useContext(StateContext);

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [plan, setPlan] = useState(false);
  const [sales, setSales] = useState(false);
  const [expense, setExpense] = useState(false);
  const [inventory, setInventory] = useState(false);
  const [checkboxError, setCheckboxError] = useState('');
  const [error, setError] = useState('');

  const {user} = useContext(StateContext);
  const {t} = useTranslation();

  const checkPhone = (val: String) => {
    let num = val;
    if (!num) {
      return setPhoneError('Please enter phone number.');
    }
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
      setPhoneError(t('Invalid phone number'));
      return null;
    }
    return num.toString();
  };

  const createUser = async () => {
    if (!checkPhone(phone)) return;
    if (!name) return setNameError('This field cannot be empty!');
    const phoneNumber = '+251' + checkPhone(phone);
    if (!plan && !expense && !sales && !inventory)
      setCheckboxError('Please check atleast one role');

    const userData = {
      companyId: user.uid,
      orgName: userInfo[0].doc.orgName,
      name: name,
      isFree: userInfo[0].doc.isFree,
      roles: [
        sales ? 'sales' : null,
        inventory ? 'inventory' : null,
        plan ? 'plan' : null,
        expense ? 'expense' : null,
      ],
      phone: phoneNumber,
    };
    userData.roles = userData.roles.filter(i => i !== null);
    setLoading(true);
    try {
      await firestore()
        .collection('users')
        .where('phone', '==', phoneNumber)
        .get()
        .then(async res => {
          if (!res.docs.length) {
            firestore()
              .collection('users')
              .add(userData)
              .then(res => {
                navigation.goBack();
              })
              .catch(err => {
                setLoading(false);
                console.log(err);
              });
          } else {
            setLoading(false);
            setError('Phone number already taken.');
          }
        }).catch(err=>console.log(err))
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {}, []);

  return (
    <>
      {loading ? <StatusBox msg={t('Please_Wait')} /> : null}
      <KeyboardAvoidingView style={styles.container}>
        <Text style={[styles.inputLabel, {color: colors.red}]}>{error}</Text>
        <View style={styles.inputContainer}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>
              {t('Name')} {'*'}
            </Text>
            <TextInput
              value={name}
              onChangeText={val => {
                setNameError('');
                setName(val);
              }}
              style={styles.textInput}
            />
            <Text style={[styles.inputLabel, {color: colors.red}]}>
              {nameError}
            </Text>
          </View>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>
              {t('Phone_Number')} {'*'}
            </Text>
            <TextInput
              value={phone}
              keyboardType="numeric"
              onChangeText={val => {
                setPhoneError('');
                setError('');
                setPhone(val);
              }}
              style={styles.textInput}
            />
            <Text style={[styles.inputLabel, {color: colors.red}]}>
              {phoneError}
            </Text>
          </View>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>
              {t('Privileges')} {'*'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {['Sales', 'Expense', 'Plan', 'Inventory'].map(i => {
                return (
                  <BouncyCheckbox
                    key={i}
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignContent: 'center',
                    }}
                    textStyle={{
                      textAlign: 'center',
                      marginLeft: 0,
                      left: 0,
                      textDecorationLine: 'none',
                    }}
                    size={25}
                    fillColor={colors.primary}
                    unfillColor="#FFFFFF"
                    text={i}
                    iconStyle={{
                      borderColor: colors.black,
                      margin: 10,
                      alignSelef: 'center',
                    }}
                    onPress={(isChecked: boolean) => {
                      setCheckboxError('');
                      switch (i) {
                        case 'Sales':
                          setSales(isChecked);
                          break;
                        case 'Plan':
                          setPlan(isChecked);
                          break;
                        case 'Expense':
                          setExpense(isChecked);
                          break;
                        case 'Inventory':
                          setInventory(isChecked);
                          break;
                        default:
                          break;
                      }
                    }}
                  />
                );
              })}
            </View>
            <Text
              style={[styles.inputLabel, {color: colors.red, marginTop: 10}]}>
              {checkboxError}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => createUser()}
          style={{
            backgroundColor: colors.primary,
            width: 150,
            alignItems: 'center',
            paddingVertical: 10,
            borderRadius: 5,
          }}>
          <Text style={{color: colors.white}}>Create account</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </>
  );
};

export default AddEmployee;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  inputContainer: {
    marginTop: 35,
  },
  input: {
    paddingHorizontal: 5,
  },
  textInput: {
    backgroundColor: colors.white,
    borderRadius: 5,
    color: colors.black,
    padding: 5,
    paddingHorizontal: 15,
    fontSize: 15,
    elevation: 5,
    height: 55,
    shadowColor: colors.transBlack,
    borderColor: colors.faded_grey,
    borderWidth: 0.4,
  },
  inputLabel: {
    color: colors.black,
    fontSize: 15,
    marginBottom: 5,
  },
});
