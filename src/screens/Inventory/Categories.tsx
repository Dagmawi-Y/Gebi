import {Alert, BackHandler, StyleSheet, Text, View} from 'react-native';
// import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {StateContext} from '../../global/context';
import StatusBox from '../../components/misc/StatusBox';
import colors from '../../config/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/AntDesign';
import routes from '../../navigation/routes';
import {NativeModules} from 'react-native';
const {PrinterModule} = NativeModules;

const Categories = ({navigation}) => {
  const {userInfo} = useContext(StateContext);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories]: any = useState([]);
  const {t} = useTranslation();

  const getCategories = async () => {
    try {
      setLoading(true);
      await firestore()
        .collection('categories')
        .where('owner', '==', userInfo[0]?.doc?.companyId)
        .onSnapshot(qsn => {
          console.log('Categories Fetched');
          let result: Array<any> = [];
          qsn.forEach(i => {
            result.push({id: i.id, data: i.data()});
          });

          setCategories(result);
          setLoading(false);
        });
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  if (loading)
    return (
      <StatusBox msg="" type={'loading'} overlay={false} onPress={() => {}} />
    );

  return (
    <View style={{padding: 20}}>
      <Text
        style={{
          fontSize: 30,
          color: colors.black,
          textAlign: 'center',
          fontWeight: '600',
          marginBottom: 10,
        }}>
        {t('Categories')}
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate(routes.addNewCategory)}
        style={{
          backgroundColor: colors.primary,
          borderRadius: 10,
          padding: 10,
          flexDirection: 'row',
          width: 150,
          justifyContent: 'space-evenly',
          alignItems: 'center',
          marginVertical: 5,
          marginRight: 10,
        }}>
        <Icon name="plus" color={colors.white} size={15} />
        <Text style={{color: colors.white, fontSize: 15}}>
          {t('Add_New_Category')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={PrinterModule.paperOut}
        style={{
          backgroundColor: colors.primary,
          borderRadius: 10,
          padding: 10,
          flexDirection: 'row',
          width: 150,
          justifyContent: 'space-evenly',
          alignItems: 'center',
          marginVertical: 5,
          marginRight: 10,
        }}>
        <Icon name="plus" color={colors.white} size={15} />
        <Text style={{color: colors.white, fontSize: 15}}>
          {t('Print Bar Code')}
        </Text>
      </TouchableOpacity>
      <View>
        {categories.length > 0 ? (
          categories.map(i => (
            <View
              key={i.id}
              style={{
                padding: 10,
                backgroundColor: colors.white,
                borderRadius: 10,
                paddingHorizontal: 20,
                marginBottom: 10,
              }}>
              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: colors.black,
                  }}>
                  {i.data.name}
                </Text>
                <Text style={{fontSize: 20, color: colors.black}}>
                  {i.data.count} {t('Items')}
                </Text>
              </View> */}
              {i.data.description ? (
                <Text
                  style={{
                    fontSize: 15,
                    marginTop: 5,
                    color: colors.faded_grey,
                  }}>
                  {i.data.description.length > 50
                    ? i.data.description.substring(0, 50) + '...'
                    : i.data.description}
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 15,
                    marginTop: 5,
                    color: colors.faded_grey,
                  }}>
                  {t('No-Description')}
                </Text>
              )}
            </View>
          ))
        ) : (
          <View
            style={{
              padding: 10,
              backgroundColor: colors.white,
              borderRadius: 10,
              paddingHorizontal: 20,
              marginBottom: 10,
              alignItems: 'center',
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  color: colors.black,
                }}>
                {t('No_Categories_Yet')}
              </Text>

              <Text
                style={{
                  fontSize: 15,
                  marginTop: 5,
                  color: colors.faded_grey,
                }}>
                {t('Add_One_First')}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({});
