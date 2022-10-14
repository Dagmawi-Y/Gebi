import {StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {StateContext} from '../../../global/context';
import firestore from '@react-native-firebase/firestore';
import colors from '../../../config/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Loading from '../../../components/lotties/Loading';
import StatusBox from '../../../components/misc/StatusBox';

const AddEmployee = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const {userInfo, isAdmin} = useContext(StateContext);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [orgName, setOrgName] = useState('');
  const [companyId, setCompanyId] = useState('');

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

  const updateUser = async () => {
    if (!name) return setNameError('This field cannot be empty!');
    if (!orgName) return setOrgNameError('This field cannot be empty!');
    const phoneNumber = '+251' + checkPhone(phone);
    if (!phoneNumber) return;

    const userData = {
      orgName,
      name,
      // phone: phoneNumber,
    };

    setUpdating(true);
    try {
      await firestore()
        .collection('users')
        .where('phone', '==', phoneNumber)
        .get()
        .then(res => {
          const docId = res.docs[0].id;
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
        });
    } catch (error) {
      console.log(error);
    }
  };

  const populate = () => {
    const user = userInfo[0].doc;
    setPhone(user.phone);
    setName(user.name);
    setOrgName(user.orgName);
    setLoading(false);
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
          {/* <View style={styles.input}>
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
          </View> */}
        </View>
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
  input: {
    paddingHorizontal: 5,
  },
  textInput: {
    backgroundColor: colors.white,
    borderRadius: 5,
    color: colors.black,
    padding: 5,
    paddingHorizontal: 15,
    fontSize: 18,
    elevation: 5,
    height: 55,
    shadowColor: colors.transBlack,
    borderColor: colors.faded_grey,
    borderWidth: 0.4,
  },
  inputLabel: {
    color: colors.black,
    fontSize: 18,
    marginBottom: 5,
  },
});
