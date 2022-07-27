import React, {useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import ImageSelector from '../../components/ImageSelector/ImageSelector';
import colors from '../../config/colors';
import ErrorBox from '../../components/ErrorBox/ErrorBox';
import LottieView from 'lottie-react-native';
import {StateContext} from '../../global/context';
import formatNumber from '../../utils/formatNumber';
import routes from '../../navigation/routes';

const AddNewCategory = ({navigation}) => {
  const {user} = useContext(StateContext);
  const {t} = useTranslation();
  const [error, setError] = useState('');
  const [writtingData, setWrittingData] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const addCategory = () => {
    if (!categoryName) {
      setError('Empty_Empty_Fields_Are_Not_Allowed');
      return;
    }

    Alert.alert(t('Are_You_Sure?'), ``, [
      {
        text: t('Yes'),
        onPress: async () => {
          try {
            console.log('yes');
            setWrittingData(true);

            const category = {
              name: categoryName,
              description: categoryDescription ?? '',
              owner: user.uid,
              count: 0,
            };

            firestore()
              .collection('categories')
              .add(category)
              .then(res => {
                navigation.pop();
              });
          } catch (error) {
            setWrittingData(false);
            setError(`Something went wrong.\nTry again`);
            console.log(error);
          }
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

  return (
    <>
      {error ? <ErrorBox errorMessage={error} setError={setError} /> : null}
      {writtingData ? (
        <View
          style={{
            position: 'absolute',
            zIndex: 12,
            flex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: '#00000090',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 100,
              borderRadius: 20,
              aspectRatio: 1,
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <LottieView
              style={{
                height: 80,
                backgroundColor: '#fff',
              }}
              source={require('../../assets/loading.json')}
              speed={1.3}
              autoPlay
              loop={true}
            />
          </View>
        </View>
      ) : null}
      <ScrollView
        style={{
          backgroundColor: colors.white,
          flex: 1,
          paddingHorizontal: 20,
          paddingVertical: 20,
          borderRadius: 10,
        }}>
        <View>
          <Text style={category.heading}>{t('Add_New_Category')}</Text>
        </View>
        <View>
          <Text style={category.text}>{t('Category_Name')}</Text>
          <TextInput
            style={category.input}
            value={categoryName}
            onChangeText={val => setCategoryName(val)}
          />
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
              paddingRight: 5,
            }}>
            <Text style={category.text}>
              {t('Description')} {`(${t('Optional')})`}
            </Text>
            <Text
              style={[
                {color: colors.black, fontSize: 15},
                categoryDescription.length >= 50 ? {color: colors.red} : {},
              ]}>
              {categoryDescription.length <= 50
                ? 50 - categoryDescription.length
                : 0}{' '}
              {t('Characters_Left')}
            </Text>
          </View>
          <TextInput
            style={[category.input]}
            multiline
            value={categoryDescription}
            onChangeText={val => {
              categoryDescription.length >= 50
                ? setCategoryDescription(val.substring(0, 50))
                : setCategoryDescription(val);
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 20,
          }}>
          <TouchableOpacity
            onPress={() => {
              if (categoryName.length) {
                Alert.alert(t('Are_You_Sure?'), ``, [
                  {
                    text: t('Yes'),
                    onPress: () => {
                      navigation.goBack();
                      return;
                    },
                    style: 'default',
                  },
                  {
                    text: t('Cancel'),
                    onPress: () => {},
                    style: 'default',
                  },
                ]);
              } else {
                navigation.goBack();
              }
            }}
            style={{
              backgroundColor: colors.white,
              height: 50,
              marginBottom: 40,
              paddingHorizontal: 20,
              justifyContent: 'space-between',
              width: 150,
              alignItems: 'center',
              borderRadius: 10,
              borderWidth: 0.3,
              borderColor: colors.primary,
              flexDirection: 'row',
            }}>
            <Image
              resizeMethod="auto"
              source={require('../../assets/icons/arrow-leftb.png')}
              style={{
                width: 20,
                height: 20,
              }}
            />
            <Text
              style={[
                category.textBold,
                {color: colors.primary, textAlign: 'center'},
              ]}>
              {t('Cancel')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              addCategory();
            }}
            style={{
              backgroundColor: colors.primary,
              height: 50,
              marginBottom: 40,
              paddingHorizontal: 20,
              justifyContent: 'space-between',
              width: 150,
              alignItems: 'center',
              borderRadius: 10,
              flexDirection: 'row',
            }}>
            <Text
              style={[
                category.textBold,
                {color: colors.white, textAlign: 'center'},
              ]}>
              {t('Submit')}
            </Text>
            <Image
              resizeMethod="auto"
              source={require('../../assets/icons/arrow-right.png')}
              style={{width: 20, height: 20}}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const category = StyleSheet.create({
  input: {
    borderColor: colors.black,
    borderWidth: 0.5,
    borderRadius: 10,
    fontSize: 20,
    paddingHorizontal: 10,
    color: colors.black,
  },
  heading: {
    fontSize: 30,
    fontWeight: '600',
    marginBottom: 40,
    textAlign: 'center',
    color: colors.black,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 5,
    color: colors.black,
  },
  textBold: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 20,
    paddingHorizontal: 10,
  },
  textLight: {
    paddingHorizontal: 10,
    color: colors.faded_grey,
    fontWeight: '300',
    fontSize: 18,
  },
});

export default AddNewCategory;
