import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../../config/colors';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import StatusBox from '../../../components/misc/StatusBox';
import routes from '../../../navigation/routes';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {StateContext} from '../../../global/context';
import {useTranslation} from 'react-i18next';

const UserInfoInputScreen = ({navigation}) => {
  const {t} = useTranslation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {user} = useContext(StateContext);
  const {setIsNewUser, isReady} = useContext(StateContext);

  const [userInfo, setUserInfo] = useState([]);

  // OTP
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  // input fields
  const [name, setName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [plan, setPlan] = useState('');
  const [financial, setFinancial] = useState('');

  const checkEmpty = () => {
    if (!name) return true;
    if (!orgName) return true;
    if (!plan) return true;
    if (!financial) return true;
    return false;
  };

  const handleSubmit = async () => {
    if (checkEmpty()) {
      setError('Empty_Empty_Fields_Are_Not_Allowed');
      return;
    }
    setLoading(true);
    const userData = {
      userId: user.uid,
      name: name,
      orgName: orgName,
      plan: plan,
      financial: financial,
    };

    try {
      await firestore()
        .collection('users')
        .where('userId', '==', user?.uid)
        .get()
        .then(async res => {
          if (!res.docs.length) {
            await firestore().collection('users').add(userData);
            navigation.replace(routes.mainNavigator);
            setLoading(false);
          }
          if (res.docs.length) navigation.replace(routes.mainNavigator);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getUserInfo = async () => {
    setLoading(true);
    try {
      if (user)
        firestore()
          .collection('users')
          .where('userId', '==', user?.uid)
          .get()
          .then(res => {
            if (res.docs.length > 0) {
              navigation.replace(routes.mainNavigator, {
                screen: routes.salesNav,
              });
            } else {
              setLoading(false);
            }
          });
    } catch (error) {
      console.log(error);
    }
    return;
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  if (loading)
    return (
      <StatusBox
        msg={t('Please_Wait...')}
        onPress={() => {}}
        overlay={false}
        type="loading"
      />
    );

  const dropDownOptions = [
    t('Daily'),
    t('Monthly'),
    t('Six_Months'),
    t('Yearly'),
  ];

  if (!isReady) return null;

  return (
    <>
      {loading ? (
        <StatusBox msg={'Please wait...'} onPress={() => {}} type="loading" />
      ) : (
        <>
          {error ? (
            <StatusBox
              msg={t(error)}
              type={'warn'}
              onPress={() => setError('')}
            />
          ) : null}
          <SafeAreaView style={[styles.container]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.pageTitle}>
                {t('Personal_And_Bussiness_Information')}
              </Text>
              <Text style={styles.pageDescription}>
                {t('This_information_will_be_used_to_set_up_your_profile')}
              </Text>

              <View>
                <Text style={styles.inputLable}>{t('Full_Name')}</Text>
                <View style={styles.inputContiner}>
                  <TextInput
                    style={[styles.input]}
                    onChangeText={val => {
                      setError('');
                      setName(val);
                    }}
                    value={name}
                    placeholder={t('Full_Name')}
                    keyboardType="default"
                    placeholderTextColor={colors.faded_grey}
                  />
                </View>
              </View>

              <View>
                <Text style={styles.inputLable}>{t('Organization_Name')}</Text>
                <View style={styles.inputContiner}>
                  <TextInput
                    style={[styles.input]}
                    onChangeText={val => {
                      setError('');
                      setOrgName(val);
                    }}
                    value={orgName}
                    placeholder={t('Organization_Name')}
                    keyboardType="default"
                    placeholderTextColor={colors.faded_grey}
                  />
                </View>
              </View>

              <View>
                <Text style={styles.inputLable}>
                  {t('Profit_Plan_Duration')}
                </Text>
                <View
                  style={[
                    styles.inputContiner,
                    {
                      backgroundColor: '#00000000',
                      borderWidth: 0,
                      paddingVertical: 0,
                    },
                  ]}>
                  <SelectDropdown
                    data={dropDownOptions}
                    renderDropdownIcon={() => (
                      <View>
                        <Icon2
                          name="caretdown"
                          size={20}
                          color={colors.black}
                        />
                      </View>
                    )}
                    defaultButtonText={t('Select_Option')}
                    buttonStyle={styles.dropDown}
                    onSelect={(selectedItem, index) => {
                      setPlan(selectedItem);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item;
                    }}
                  />
                </View>
              </View>

              {plan ? (
                <View>
                  <Text style={styles.inputLable}>
                    {t('Financial_Plan')}
                    <Text
                      style={[
                        styles.inputLable,
                        {
                          fontStyle: 'italic',
                          textDecorationLine: 'underline',
                          textDecorationStyle: 'solid',
                        },
                      ]}>
                      {t('For')} {t(plan)}
                    </Text>
                  </Text>
                  <View style={styles.inputContiner}>
                    <TextInput
                      style={[styles.input]}
                      onChangeText={val => {
                        setError('');
                        setFinancial(val.replace(/[^0-9]/g, ''));
                      }}
                      value={financial}
                      placeholder={t('Financial_Plan')}
                      keyboardType="numeric"
                      placeholderTextColor={colors.faded_grey}
                    />
                  </View>
                </View>
              ) : null}

              <TouchableOpacity
                onPress={handleSubmit}
                activeOpacity={0.7}
                style={[
                  styles.buttonContainer,
                  checkEmpty() ? {backgroundColor: colors.faded_grey} : null,
                ]}>
                <View style={styles.buttonInner}>
                  <Text style={styles.buttonText}>{t('Submit')}</Text>
                  <Icon
                    name={checkEmpty() ? 'alert-circle-outline' : 'arrow-right'}
                    color={'white'}
                    size={35}
                  />
                </View>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightBlue,
    flex: 1,
    display: 'flex',
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  pageTitle: {
    marginTop: 30,
    marginBottom: 15,
    textAlign: 'center',
    color: colors.primary,
    fontSize: 25,
    fontWeight: 'bold',
  },
  pageDescription: {
    color: colors.black,
    fontSize: 15,
    marginBottom: 20,
  },
  inputContiner: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    padding: 0,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 10,
  },
  inputLable: {
    fontSize: 18,
    marginBottom: 5,
    color: colors.black,
  },
  input: {
    flexGrow: 1,
    marginRight: 0,
    backgroundColor: 'white',
    height: 30,
    margin: 12,
    color: colors.black,
    padding: 5,
    fontSize: 15,
  },
  dropDown: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
    backgroundColor: colors.white,
  },
  buttonContainer: {
    marginTop: 30,
    width: '100%',
    height: 60,
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    marginVertical: 20,
  },
  buttonInner: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: colors.white,
  },
});

export default UserInfoInputScreen;
UserInfoInputScreen.routeName = 'RegisterPhone';
