import {
  Alert,
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
import Loading from '../../../components/lotties/Loading';
import StatusBox from '../../../components/misc/StatusBox';

const AddEmployee = ({route, navigation}) => {
  const {id} = route.params;
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const {userInfo, isAdmin} = useContext(StateContext);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [orgName, setOrgName] = useState('');
  const [docId, setDocid] = useState<any>();

  const [plan, setPlan] = useState(false);
  const [sales, setSales] = useState(false);
  const [expense, setExpense] = useState(false);
  const [inventory, setInventory] = useState(false);
  const [checkboxError, setCheckboxError] = useState('');

  const [orgNameError, setOrgNameError] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
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

  const deleteUser = async () => {
    Alert.alert(t('Are_You_Sure?'), ``, [
      {
        text: t('Yes'),
        onPress: async () => {
          if (docId) {
            setUpdating(true);
            firestore()
              .collection('users')
              .doc(docId)
              .delete()
              .then(res => {
                setUpdating(false);
                setLoading(true)
                console.log(userInfo);
                // navigation.pop();
              })
              .catch(err => {
                setUpdating(false);
                setError('Something went wrong, try again.');
                console.log(err);
              });
          } else {
            setUpdating(false);
          }
        },
        style: 'default',
      },
      {
        text: t('Cancel'),
        onPress: () => {},
        style: 'cancel',
      },
    ]);
  };

  const updateUser = async () => {
    setError('');
    if (!name) return setNameError('This field cannot be empty!');
    if (!orgName) return setOrgNameError('This field cannot be empty!');
    const phoneNumber = '+251' + checkPhone(phone);
    if (!phoneNumber) return;

    const userData = {
      orgName,
      name,
      roles: [
        sales ? 'sales' : null,
        inventory ? 'inventory' : null,
        plan ? 'plan' : null,
        expense ? 'expense' : null,
      ],
      phone: phoneNumber,
    };
    userData.roles = userData.roles.filter(i => i !== null);
    setUpdating(true);
    try {
      if (docId) {
        firestore()
          .collection('users')
          .doc(docId)
          .update(userData)
          .then(res => {
            setUpdating(false);
            navigation.goBack();
          })
          .catch(err => {
            setUpdating(false);
            setError('Something went wrong, try again.');
            console.log(err);
          });
      } else {
        setUpdating(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const populate = () => {
    firestore()
      .collection('users')
      .where('phone', '==', id)
      .get()
      .then(res => {
        // console.log(res.docs[0].id);
        const user = res.docs[0].data();
        setDocid(res.docs[0].id);
        setName(user.name);
        setPhone(user.phone);
        setOrgName(user.orgName);

        user.roles.map(i => {
          switch (i) {
            case 'sales':
              setSales(true);
              break;
            case 'plan':
              setPlan(true);
              break;
            case 'expense':
              setExpense(true);
              break;
            case 'inventory':
              setInventory(true);
              break;
            default:
              break;
          }
        });
        console.log();

        setLoading(false);
      })
      .catch(err => {
        navigation.goBack();
        console.log(err);
      });
  };

  useEffect(() => {
    populate();
  }, []);

  if (loading) {
    return <Loading size={100} />;
  }

  return (
    <>
      {updating ? <StatusBox msg={t('Please_Wait')} /> : null}
      <View style={styles.container}>
        <Text style={[styles.inputLabel, {color: colors.red}]}>{error}</Text>
        <View style={styles.inputContainer}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>{t('Organization Name')}</Text>
            <TextInput
              editable={isAdmin}
              value={orgName}
              onChangeText={val => {
                setOrgNameError('');
                setOrgName(val);
              }}
              style={styles.textInput}
            />
            <Text style={[styles.inputLabel, {color: colors.red}]}>
              {orgNameError}
            </Text>
          </View>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>{t('Name')}</Text>
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
            <Text style={styles.inputLabel}>{t('Phone_Number')}</Text>
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
              <BouncyCheckbox
                isChecked={sales}
                style={styles.checkBoxStyle}
                textStyle={styles.checkBoxText}
                size={25}
                fillColor={colors.primary}
                unfillColor="#FFFFFF"
                text={'Sales'}
                iconStyle={{
                  borderColor: colors.black,
                  margin: 10,
                  alignSelef: 'center',
                }}
                onPress={(isChecked: boolean) => {
                  setCheckboxError('');
                  setSales(isChecked);
                }}
              />
              <BouncyCheckbox
                isChecked={expense}
                style={styles.checkBoxStyle}
                textStyle={styles.checkBoxText}
                size={25}
                fillColor={colors.primary}
                unfillColor="#FFFFFF"
                text={'Expenses'}
                iconStyle={{
                  borderColor: colors.black,
                  margin: 10,
                  alignSelef: 'center',
                }}
                onPress={(isChecked: boolean) => {
                  setCheckboxError('');
                  setExpense(isChecked);
                }}
              />
              <BouncyCheckbox
                isChecked={plan}
                style={styles.checkBoxStyle}
                textStyle={styles.checkBoxText}
                size={25}
                fillColor={colors.primary}
                unfillColor="#FFFFFF"
                text={'Plan'}
                iconStyle={{
                  borderColor: colors.black,
                  margin: 10,
                  alignSelef: 'center',
                }}
                onPress={(isChecked: boolean) => {
                  setCheckboxError('');
                  setPlan(isChecked);
                }}
              />
              <BouncyCheckbox
                isChecked={inventory}
                style={styles.checkBoxStyle}
                textStyle={styles.checkBoxText}
                size={25}
                fillColor={colors.primary}
                unfillColor="#FFFFFF"
                text={'Inventory'}
                iconStyle={{
                  borderColor: colors.black,
                  margin: 10,
                  alignSelef: 'center',
                }}
                onPress={(isChecked: boolean) => {
                  setCheckboxError('');
                  setInventory(isChecked);
                }}
              />
            </View>
            <Text
              style={[styles.inputLabel, {color: colors.red, marginTop: 10}]}>
              {checkboxError}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            onPress={() => updateUser()}
            style={{
              backgroundColor: colors.primary,
              width: 150,
              alignItems: 'center',
              paddingVertical: 10,
              borderRadius: 5,
            }}>
            <Text style={{color: colors.white}}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteUser()}
            style={{
              backgroundColor: colors.red,
              width: 150,
              alignItems: 'center',
              paddingVertical: 10,
              borderRadius: 5,
            }}>
            <Text style={{color: colors.white}}>Delete employee</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  checkBoxStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
  },
  checkBoxText: {
    textAlign: 'center',
    marginLeft: 0,
    left: 0,
    textDecorationLine: 'none',
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
