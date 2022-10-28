import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Share,
  Animated,
  ScrollView,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../config/colors';
import routes from '../../navigation/routes';
import {StateContext} from '../../global/context';
import firestore from '@react-native-firebase/firestore';
import Loading from '../../components/lotties/Loading';
import auth from '@react-native-firebase/auth';

const Settings = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [langDropDownVisible, setLangDropDownVisible] = useState(false);
  const [accountsVisible, setAccountsVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const {userInfo, user, isAdmin} = useContext(StateContext);
  const [employes, setEmployees] = useState<any>([]);

  const progress = useRef(new Animated.Value(0)).current;
  const progressAccount = useRef(new Animated.Value(0)).current;

  const animateAccountsOpen = () => {
    Animated.timing(progressAccount, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const animateAccountsClose = () => {
    Animated.timing(progressAccount, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const animateOpen = () => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const animateClose = () => {
    Animated.timing(progress, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const fetchEmployes = () => {
    if (userInfo)
      firestore()
        .collection('users')
        .where('companyId', '==', userInfo[0].doc.companyId)
        .onSnapshot(qsn => {
          let arr: any = [];
          qsn.forEach(u => {
            arr.push(u.data());
          });
          setEmployees(arr);
        });
  };

  const onShare = async (name, number, company) => {
    try {
      const result = await Share.share({
        message: `Gebi\n\nHello ${name}\n${company} has added you as an employee on Gebi.\n\nGebi allows you to manage my business sales, expense and stock please download the app from PlayStore and singup with your number ${number}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const availableLanguages = [
    {name: 'Amharic', code: 'am'},
    {name: 'English', code: 'en'},
  ];

  const changeLang = async (lang: string) => {
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem('lang', lang);
  };

  const deleteAccount = () => {
    Alert.alert(t('Are_You_Sure?'), `Do you want to delete your account??`, [
      {
        text: t('Yes'),
        onPress: () => {
          const userCollections = [
            'categories',
            'customExpenseTypes',
            'customers',
            'expenses',
            'inventory',
            'sales',
            'stock',
            'suppliers',
            'users',
          ];

          const userId = userInfo[0].doc.companyId;
          userCollections.map(coll => {
            firestore()
              .collection(coll)
              .get()
              .then(res => {
                res.docs.map(i => {
                  console.log(i.data().owner);
                  setDeleting(true);
                  if (coll == 'users') {
                    if (i.data().companyId === userId && isAdmin) {
                      return firestore()
                        .collection(coll)
                        .doc(i.id)
                        .delete()
                        .then(res => console.log('DELETED', res, '\n'))
                        .catch(err => console.log('DELETE ERROR', err, '\n'));
                    }
                  }

                  if (i.data().owner === userId && isAdmin) {
                    return firestore()
                      .collection(coll)
                      .doc(i.id)
                      .delete()
                      .then(res => console.log('DELETED', res, '\n'))
                      .catch(err => console.log('DELETE ERROR', err, '\n'));
                  }
                });
              });
            if (user) {
              auth().signOut();
            }
            setDeleting(false);
          });
        },
        style: 'default',
      },
      {
        text: t('Cancel'),
        onPress: () => {},
        style: 'default',
      },
    ]);
  };

  useEffect(() => {
    fetchEmployes();
  }, [userInfo]);
  if (userInfo.length == 0 || !user) return <Loading size={50} />;

  if (deleting) return <Loading size={40} />;

  return (
    <View style={{flex: 1, padding: 20}}>
      <View style={{alignItems: 'center'}}>
        <View
          style={{
            backgroundColor: 'white',
            width: 150,
            height: 150,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 150,
          }}>
          <Text
            style={{
              fontSize: 100,
              padding: 0,
              color: colors.primary,
              fontWeight: 'bold',
            }}>
            {userInfo[0].doc.orgName.substring(0, 1)}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(routes.editProfile)}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              borderWidth: 0.1,
              borderColor: colors.primary,
              borderRadius: 200,
            }}>
            <Icon2 name="account-edit" size={30} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => deleteAccount()}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            borderWidth: 0.1,
            borderColor: colors.primary,
            borderRadius: 200,
          }}>
          <Icon2 name="delete-circle" size={30} color={colors.red} />
        </TouchableOpacity>

        <View style={{alignItems: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
              alignItems: 'center',
              position: 'relative',
            }}>
            <Text
              style={{
                fontSize: 20,

                color: colors.black,
                fontWeight: 'bold',
              }}>
              {userInfo[0].doc.orgName}
            </Text>
          </View>

          <Text
            style={{
              fontSize: 20,
              marginBottom: 20,
              color: colors.black,
            }}>
            {userInfo[0].doc.name}
          </Text>
        </View>
      </View>
      {isAdmin ? (
        <TouchableOpacity
          onPress={() => {
            if (!accountsVisible) {
              setAccountsVisible(!accountsVisible);
              animateAccountsOpen();
            } else {
              setAccountsVisible(!accountsVisible);
              animateAccountsClose();
            }
          }}
          activeOpacity={0.6}
          style={{
            backgroundColor: colors.white,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 0.4,
            borderColor: '#00000040',
            shadowColor: '#00000040',
            elevation: 10,
          }}>
          <Icon2
            name="account-circle-outline"
            color={colors.black}
            size={25}
            style={{}}
          />
          <Text
            style={{
              color: colors.black,
              fontSize: 23,
              marginRight: 'auto',
              marginLeft: 10,
            }}>
            {t('Accounts')}
          </Text>
          <Icon
            name={accountsVisible ? 'up' : 'down'}
            color={colors.primary}
            size={20}
          />
        </TouchableOpacity>
      ) : null}

      {accountsVisible ? (
        <ScrollView
          style={{
            backgroundColor: colors.white,
            marginTop: 5,
            padding: 10,
            borderRadius: 10,
            maxHeight: 200,
          }}>
          {employes.length
            ? employes
                .filter(j => j.phone !== userInfo[0].doc.phone)
                .map(i => {
                  return (
                    <View
                      key={i.phone}
                      style={[
                        {
                          padding: 10,
                          alignItems: 'center',
                          flexDirection: 'row',
                          marginVertical: 5,
                          width: '90%',
                          borderBottomColor: colors.grey,
                          borderBottomWidth: 0.2,
                          alignSelf: 'center',
                        },
                      ]}>
                      <Icon2
                        name={'account'}
                        color={colors.black}
                        size={25}
                        style={{marginRight: 5}}
                      />
                      <Text
                        style={{
                          color: colors.black,
                          fontSize: 22,
                          marginRight: 'auto',
                        }}>
                        {i.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => onShare(i.name, i.phone, i.orgName)}>
                        <Icon2
                          name="share"
                          color={colors.black}
                          size={25}
                          style={{marginRight: 10}}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate(routes.editEmployee, {
                            id: i.phone,
                          })
                        }>
                        <Icon2
                          name="account-edit"
                          color={colors.black}
                          size={25}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })
            : null}
          <TouchableOpacity
            onPress={() => navigation.navigate(routes.addEmployee)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.white,
              borderWidth: 1,
              borderRadius: 5,
              borderColor: colors.lightBlue,
              padding: 5,
              marginVertical: 5,
              marginTop: 10,
              marginBottom: 30,
              alignSelf: 'center',
              width: '90%',
            }}>
            <Icon2 name="plus" color={colors.black} size={25} />
            <Text
              style={{
                color: colors.black,
                fontSize: 22,
              }}>
              Add Account
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : null}

      <Text
        style={{
          color: colors.black,
          fontSize: 18,
          fontWeight: 'bold',
          marginVertical: 10,
        }}>
        {t('Language')}
      </Text>

      <TouchableOpacity
        onPress={() => {
          if (!langDropDownVisible) {
            setLangDropDownVisible(!langDropDownVisible);
            animateOpen();
          } else {
            setLangDropDownVisible(!langDropDownVisible);
            animateClose();
          }
        }}
        activeOpacity={0.6}
        style={{
          backgroundColor: colors.white,
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderWidth: 0.4,
          borderColor: '#00000040',
          shadowColor: '#00000040',
          elevation: 10,
        }}>
        <Text style={{color: colors.black, fontSize: 23}}>
          {t(availableLanguages.filter(l => l.code == i18n.language)[0].name)}
        </Text>
        <Icon
          name={langDropDownVisible ? 'up' : 'down'}
          color={colors.primary}
          size={20}
        />
      </TouchableOpacity>

      {langDropDownVisible ? (
        <View
          style={{
            backgroundColor: colors.white,
            marginTop: 5,
            padding: 10,
            borderRadius: 10,
          }}>
          {availableLanguages.map(lang => {
            return (
              <TouchableOpacity
                onPress={() => {
                  changeLang(lang.code);
                  if (!langDropDownVisible) {
                    setLangDropDownVisible(!langDropDownVisible);
                    animateOpen();
                  } else {
                    setLangDropDownVisible(!langDropDownVisible);
                    animateClose();
                  }
                }}
                key={lang.code}
                activeOpacity={0.7}
                style={[
                  {
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 10,
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginVertical: 5,
                  },
                  i18n.language == lang.code
                    ? {borderColor: colors.primary}
                    : {borderColor: '#00000040'},
                ]}>
                <Text
                  style={{
                    color: colors.black,
                    fontSize: 22,
                  }}>
                  {t(`${lang.name}`)}
                </Text>
                {i18n.language == lang.code ? (
                  <Icon
                    name="checkcircle"
                    color={colors.primary}
                    size={22}
                    style={{marginLeft: 'auto'}}
                  />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({});

export default Settings;
