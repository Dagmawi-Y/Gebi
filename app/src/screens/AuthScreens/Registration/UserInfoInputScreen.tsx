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

const UserInfoInputScreen = ({navigation}) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {user} = useContext(StateContext);
  const {isNewUser, setIsNewUser, isReady} = useContext(StateContext);

  useEffect(() => {
    !isNewUser && navigation.navigate(routes.Gebi, {screen: routes.salesNav});
  }, []);

  if (!isReady) return null;
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
      setError('Empty fields are not allowed!');
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
      await firestore().collection('users').add(userData);
      setLoading(false);
      setIsNewUser(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {}, []);

  const dropDownOptions = ['ዕለታዊ ግብ', 'ወርሃዊ ግብ', 'የስድስት ወር ግብ', 'አመታዊ ግብ'];

  return (
    <>
      {loading ? (
        <StatusBox msg={'Please wait...'} onPress={() => {}} type="loading" />
      ) : (
        <>
          {error ? (
            <StatusBox msg={error} type={'warn'} onPress={() => setError('')} />
          ) : null}
          <SafeAreaView style={[styles.container]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.pageTitle}>የግል እና የንግድ መረጃ</Text>
              <Text style={styles.pageDescription}>
                ይህ መረጃ የእርስዎን መለያ ለማዘጋጀት ጥቅም ላይ ይውላል
              </Text>

              <View>
                <Text style={styles.inputLable}>ሙሉ ስም</Text>
                <View style={styles.inputContiner}>
                  <TextInput
                    style={[styles.input]}
                    onChangeText={val => {
                      setError('');
                      setName(val);
                    }}
                    value={name}
                    placeholder="ሙሉ ስም"
                    keyboardType="default"
                    placeholderTextColor={colors.faded_grey}
                  />
                </View>
              </View>

              <View>
                <Text style={styles.inputLable}>የንግድ ስምዎ (ድርጅት ካሎት)?</Text>
                <View style={styles.inputContiner}>
                  <TextInput
                    style={[styles.input]}
                    onChangeText={val => {
                      setError('');
                      setOrgName(val);
                    }}
                    value={orgName}
                    placeholder="የንግድ ስምዎ (ድርጅት ካሎት)?"
                    keyboardType="default"
                    placeholderTextColor={colors.faded_grey}
                  />
                </View>
              </View>

              <View>
                <Text style={styles.inputLable}>
                  የትርፍ ግብዎን ለምን ያህል ግዜ ማቀድ ይፈልጋሉ?
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
                    በ
                    <Text
                      style={[
                        styles.inputLable,
                        {
                          fontStyle: 'italic',
                          textDecorationLine: 'underline',
                          textDecorationStyle: 'solid',
                        },
                      ]}>
                      {plan}
                    </Text>
                    ፣ ምን ያህል ብር መስራት ያስባሉ?
                  </Text>
                  <View style={styles.inputContiner}>
                    <TextInput
                      style={[styles.input]}
                      onChangeText={val => {
                        setError('');
                        setFinancial(val.replace(/[^0-9]/g, ''));
                      }}
                      value={financial}
                      placeholder="ምን ያህል ብር በቀን መስራት ያስባሉ?"
                      keyboardType="numeric"
                      placeholderTextColor={colors.faded_grey}
                    />
                  </View>
                </View>
              ) : null}

              <View>
                <TouchableOpacity
                  onPress={handleSubmit}
                  activeOpacity={0.7}
                  style={styles.buttonContainer}>
                  <View style={styles.buttonInner}>
                    <Text style={styles.buttonText}>ቀጥል</Text>
                    <Icon name={'arrow-right'} color={'white'} size={35} />
                  </View>
                </TouchableOpacity>
              </View>
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
    marginBottom: 10,
    textAlign: 'center',
    color: colors.primary,
    fontSize: 40,
    fontWeight: 'bold',
  },
  pageDescription: {
    color: colors.black,
    fontSize: 20,
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
    fontSize: 25,
    marginBottom: 5,
    color: colors.black,
  },
  input: {
    flexGrow: 1,
    marginRight: 0,
    backgroundColor: 'white',
    height: 40,
    margin: 12,
    color: colors.black,
    padding: 5,
    fontSize: 20,
  },
  dropDown: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
    backgroundColor: colors.white,
  },
  buttonContainer: {
    width: '100%',
    height: 70,
    justifyContent: 'center',
    borderRadius: 30,
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
    fontSize: 25,
    color: colors.white,
  },
});

export default UserInfoInputScreen;
UserInfoInputScreen.routeName = 'RegisterPhone';
