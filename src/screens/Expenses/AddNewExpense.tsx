import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import colors from '../../config/colors';
import {useTranslation} from 'react-i18next';
import StatusBox from '../../components/misc/StatusBox';
import {StateContext} from '../../global/context';
import routes from '../../navigation/routes';

const AddNewExpense = ({navigation}) => {
  const {t} = useTranslation();
  const {userInfo} = useContext(StateContext);
  const [resultVisible, setResultVisible] = useState(false);
  const [expTypes, setExpTypes]: Array<any> = useState([]);
  const [customExpTypes, setCustomExpTypes]: Array<any> = useState([]);
  const [error, setError] = useState('');
  const [duplicateError, setDuplicateError] = useState('');
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDecription] = useState('');

  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [expenses, setExpenses]: Array<any> = useState([]);

  const updateExpenseList = newExpense => {
    setExpenses([...expenses, newExpense]);
  };

  const populateTypes = () => {
    const types = [
      {
        name: 'Rent',
      },

      {
        name: 'Salary',
      },

      {
        name: 'Equipment_Rentals',
      },

      {
        name: 'Bank_Interest_Fee',
      },

      {
        name: 'Stationery_Item',
      },

      {
        name: 'Food',
      },

      {
        name: 'Clothing',
      },

      {
        name: 'Fruits',
      },

      {
        name: 'Shopping',
      },

      {
        name: 'Transport',
      },

      {
        name: 'Home',
      },

      {
        name: 'Water_Bill',
      },

      {
        name: 'Electric_Bill',
      },

      {
        name: 'Telephone/Mobile_Bill',
      },

      {
        name: 'TAX',
      },

      {
        name: 'Entertainment',
      },

      {
        name: 'Sales_Commission',
      },
    ];

    types.map(i => firestore().collection('defaultExpenseTypes').add(i));
  };

  const addNewExpenseType = () => {
    if (!newName) {
      setError('Empty_Empty_Fields_Are_Not_Allowed');
      return;
    }

    const matchOne = expTypes.filter(
      i => i.data.name.toLowerCase() == newName.toLowerCase().trim(),
    ).length;
    const matchTow = expTypes.filter(
      i => i.data.name.toLowerCase() == newName.toLowerCase().trim(),
    ).length;

    if (matchOne || matchTow) {
      return setDuplicateError('Expense_Type_Names_Must_Be_Unique');
    }

    setLoading(true);

    try {
      firestore()
        .collection('customExpenseTypes')
        .add({
          name: newName.trim(),
          description: newDescription.trim() ?? '',
          date: new Date().toLocaleDateString(),
          owner: userInfo[0]?.doc?.companyId,
        })
        .then(res => {
          console.log(res);
          setLoading(false);
          setModalVisible(false);
          setNewDecription('');
          setNewName('');
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleSubmit = () => {
    if (!expenseName) {
      setError('Empty_Empty_Fields_Are_Not_Allowed');
      return;
    }
    if (!amount) {
      setError('Empty_Empty_Fields_Are_Not_Allowed');
      return;
    }
    setLoading(true);

    try {
      firestore()
        .collection('expenses')
        .add({
          expenseName,
          amount: amount ?? '',
          note: note ?? '',
          date: new Date().toLocaleDateString(),
          owner: userInfo[0]?.doc?.companyId,
        })
        .then(() => {
          setLoading(false);

          setExpenseName('');
          setAmount('');
          setNote('');
          setTimeout(() => {
            navigation.goBack();
          }, 400);
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getDefaultTypes = async () => {
    let result: Array<any> = [];
    firestore()
      .collection('defaultExpenseTypes')
      // .orderBy('name')
      .onSnapshot(qsn => {
        qsn.forEach(sn => {
          result.push({
            id: sn.id,
            data: sn.data(),
          });
        });
        setExpTypes([]);
        setExpTypes(result);
      });
  };

  const getCustomTypes = async () => {
    let result: Array<Object> = [];
    firestore()
      .collection('customExpenseTypes')
      .where('owner', '==', userInfo[0]?.doc.companyId)
      // .orderBy('name')
      .onSnapshot(qsn => {
        if (qsn) {
          qsn.forEach(sn => {
            result.push({
              id: sn.id,
              data: sn.data(),
            });
            setCustomExpTypes([]);
            setCustomExpTypes(result);
          });
        }
      });
  };

  useEffect(() => {
    getDefaultTypes();
    getCustomTypes();
    // populateTypes();
  }, []);

  return (
    <>
      {error ? (
        <StatusBox msg={t(error)} type={'warn'} onPress={() => setError('')} />
      ) : null}
      {loading ? (
        <StatusBox msg={t('Please_Wait')} type={'loading'} onPress={() => {}} />
      ) : null}
      {modalVisible ? (
        <Pressable
          onPress={() => setModalVisible(false)}
          style={{
            flex: 1,
            backgroundColor: colors.transBlack,
            height: '100%',
            width: '100%',
            position: 'absolute',
            zIndex: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.white,
              height: 400,
              width: 380,
              borderRadius: 5,
              position: 'absolute',
              // zIndex: 5,
              paddingHorizontal: 25,
            }}>
            <Text style={styles.pageLabel}>{t('New_Expense_Type')}</Text>
            <View style={styles.input}>
              <Text style={styles.inputLable}>
                {t('Unique_Name')} {'*'}
              </Text>
              <TextInput
                value={newName}
                onChangeText={val => {
                  setNewName(val);
                  setDuplicateError('');
                }}
                style={styles.textInput}
              />
              <Text style={[styles.inputLable, {color: colors.red}]}>
                {t(duplicateError)}
              </Text>
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLable}>
                {t('Description')} {`(${t('Optional')})`}
              </Text>
              <TextInput
                value={newDescription}
                onChangeText={val => setNewDecription(val)}
                style={styles.textInput}
              />
            </View>
            <TouchableOpacity
              onPress={() => addNewExpenseType()}
              activeOpacity={0.5}
              style={styles.button}>
              <Text style={styles.buttonLable}>{t('Add')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      ) : null}
      <View style={styles.container}>
        <View>
          <Text style={styles.pageLabel}>{t('Add_New_Expense')}</Text>
          {resultVisible ? (
            <ScrollView
              contentContainerStyle={{
                justifyContent: 'center',
                paddingBottom: 25,
              }}
              showsVerticalScrollIndicator
              style={styles.searchList}>
              {customExpTypes.length
                ? customExpTypes
                    .filter(i =>
                      i.data.name
                        .toLowerCase()
                        .includes(expenseName.toLowerCase()),
                    )
                    .map(i => (
                      <TouchableOpacity
                        key={i.id}
                        onPress={() => {
                          setExpenseName(i.data.name);
                          setResultVisible(false);
                        }}
                        activeOpacity={0.3}
                        style={styles.searchListItem}>
                        <Text
                          style={{
                            fontSize: 45,
                            color: colors.primary,
                            position: 'absolute',
                            right: 5,
                            top: -28,
                          }}>
                          .
                        </Text>
                        <Text style={styles.searchListLable}>
                          {t(i.data.name)}
                        </Text>
                      </TouchableOpacity>
                    ))
                : null}
              {expTypes.length
                ? expTypes
                    .filter(i =>
                      i.data.name
                        .toLowerCase()
                        .includes(expenseName.toLowerCase()),
                    )
                    .map(i => (
                      <TouchableOpacity
                        key={i.id}
                        onPress={() => {
                          setExpenseName(i.data.name);
                          setResultVisible(false);
                        }}
                        activeOpacity={0.3}
                        style={styles.searchListItem}>
                        <Text style={styles.searchListLable}>
                          {t(i.data.name.toString().trim())}
                        </Text>
                      </TouchableOpacity>
                    ))
                : null}
            </ScrollView>
          ) : null}
          <View>
            <View style={[styles.input, {alignItems: 'stretch'}]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingRight: 5,
                  marginBottom: 5,
                  alignItems: 'baseline',
                }}>
                <Text style={styles.inputLable}>{t('Expense_Type')}</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Icon name="plus" color={colors.black} size={30} />
                </TouchableOpacity>
              </View>
              <TextInput
                value={t(expenseName)}
                onChangeText={val => setExpenseName(val)}
                onEndEditing={() =>
                  setTimeout(() => setResultVisible(false), 500)
                }
                onFocus={() => setResultVisible(true)}
                style={styles.textInput}
              />
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLable}>{t('Amount')}</Text>
              <TextInput
                value={amount}
                onChangeText={val => setAmount(val)}
                style={styles.textInput}
                keyboardType="numeric"
              />
            </View>
            {/* <View style={styles.input}>
            <Text style={styles.inputLable}>ቀን</Text>
            <TextInput style={styles.textInput} />
          </View> */}
            <View style={styles.input}>
              <Text style={styles.inputLable}>{t('Note')}</Text>
              <TextInput
                value={note}
                onChangeText={val => setNote(val)}
                style={styles.textInput}
                multiline
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => handleSubmit()}
            activeOpacity={0.5}
            style={styles.button}>
            <Text style={styles.buttonLable}>{t('Submit')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default AddNewExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  pageLabel: {
    color: colors.black,
    textAlign: 'center',
    fontSize: 25,
    fontWeight: '700',
    marginVertical: 20,
  },
  input: {
    marginBottom: 10,
    padding: 5,
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
  inputLable: {
    color: colors.black,
    fontSize: 15,
    marginBottom: 5,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 20,
    height: 55,
    elevation: 5,
    marginHorizontal: 5,
  },

  searchList: {
    backgroundColor: colors.white,
    position: 'absolute',
    marginHorizontal: 5,
    left: 0,
    right: 0,
    top: 175,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 10,
    elevation: 10,
    maxHeight: 200,
    zIndex: 10,
  },
  searchListItem: {
    borderBottomWidth: 0.3,
    borderColor: colors.transBlack,
    paddingVertical: 2,
    marginHorizontal: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchListLable: {
    color: colors.black,
    fontSize: 15,
    marginBottom: 5,
  },
  buttonLable: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 5,
  },
});
