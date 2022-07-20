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

const AddNewCategory = ({navigation}) => {
  const {user} = useContext(StateContext);
  const {t} = useTranslation();
  const [photo, setPhoto] = useState();
  const [error, setError] = useState('');
  const [writtingData, setWrittingData] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryPrice, setCategoryPrice] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const addCategory = () => {
    if (!photo || !categoryName || !categoryPrice || !categoryDescription) {
      setError('Empty_Empty_Fields_Are_Not_Allowed');
      return;
    }

    Alert.alert(t('Are_You_Sure'), ``, [
      {
        text: t('Yes'),
        onPress: async () => {
          try {
            setWrittingData(true);
            const reference = storage().ref(`image_${Date.now()}`);
            const pathToFile = photo;
            const task = reference.putFile(pathToFile);

            task.on('state_changed', taskSnapshot => {});

            task.then(async () => {
              const fileUrl = await reference.getDownloadURL();

              const category = {
                name: categoryName,
                price: categoryPrice,
                description: categoryDescription,
                photo: fileUrl,
                owner: user.uid,
              };
              firestore()
                .collection('categories')
                .add(category)
                .then(() => {
                  setWrittingData(false);
                  navigation.pop();
                });
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
        <ImageSelector photo={photo} setPhoto={setPhoto} />
        <View>
          <Text style={category.text}>Category Name</Text>
          <TextInput
            style={category.input}
            onChangeText={val => setCategoryName(val)}
          />
        </View>
        <View>
          <Text style={category.text}>Price</Text>
          <TextInput
            style={category.input}
            onChangeText={val => setCategoryPrice(val)}
            keyboardType="numeric"
          />
        </View>
        <View>
          <Text style={category.text}>Description</Text>
          <TextInput
            style={category.input}
            onChangeText={val => setCategoryDescription(val)}
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
              Alert.alert(t('Are_You_Sure'), ``, [
                {
                  text: t('Yes'),
                  onPress: () => {
                    navigation.goBack();
                  },
                  style: 'default',
                },
                {
                  text: t('Cancel'),
                  onPress: () => {},
                  style: 'default',
                },
              ]);
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
