import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import StatusBox from '../../components/misc/StatusBox';

import React, {useContext, useEffect, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import colors from '../../config/colors';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import routes from '../../navigation/routes';
import firestore, {firebase} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {useTranslation} from 'react-i18next';
import formatNumber from '../../utils/formatNumber';
import {StateContext} from '../../global/context';
import ImageSelector from '../../components/ImageSelector/ImageSelector';

const ItemDetails = ({route, navigation}) => {
  const {owner, itemId} = route.params;
  const {userInfo} = useContext(StateContext);
  const {t} = useTranslation();
  const [totalSaleCount, setTotalSaleCount] = useState(0);
  const [photo, setPhoto] = useState();
  const [pickerVisible, setPickerVisible] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(false);

  const [stockHistory, setStockHistory]: Array<any> = ([] = useState([]));
  const [data, setData]: Array<any> = ([] = useState([]));

  const deleteStock = async () => {
    let batch = firestore().batch();
    let totSaleCount: number = 0;
    await firestore()
      .collection('stock')
      .where('owner', '==', userInfo[0].doc.companyId)
      .where('item_id', '==', itemId)
      .get()
      .then(sales => {
        sales.docs.map(i => (totSaleCount += parseInt(i.data().initialCount)));
        setTotalSaleCount(totSaleCount);
        sales.forEach(sale => {
          batch.delete(sale.ref);
        });
      })
      .catch(err => console.log(err));
    return batch.commit().then(async () => [
      await firestore()
        .collection('categories')
        .doc(data.categoryId)
        .update({
          count: firestore.FieldValue.increment(-totSaleCount),
        }),
    ]);
  };

  const deleteItem = async () => {
    Alert.alert(t('Are_You_Sure?'), ``, [
      {
        text: t('Yes'),
        onPress: async () => {
          if (data.picture) {
            let pictureRef = storage().refFromURL(data.picture);
            pictureRef.delete().catch(err => console.log(err));
          }
          await firestore().collection('inventory').doc(itemId).delete();
          deleteStock();
          navigation.goBack();
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

  const updateImage = async () => {
    if (!photo) return null;
    setUpdating(true);
    try {
      const reference = storage().ref(`image_${Date.now()}`);
      const pathToFile = photo;
      const task = reference.putFile(pathToFile);

      task.then(async () => {
        const link = await reference.getDownloadURL();
        console.log(link);
        firestore()
          .collection('inventory')
          .doc(itemId)
          .update({
            picture: link,
          })
          .then(res => {
            setUpdating(false);
            setPickerVisible(false);
          })
          .catch(err => {
            setUpdating(false);
            setPickerVisible(false);
            console.log(err);
          });
      });
    } catch (err) {}
  };

  const getItemInfo = async () => {
    try {
      firestore()
        .collection('inventory')
        .doc(itemId)
        .onSnapshot(res => {
          setData(res.data());
        });
    } catch (error) {
      console.log(error);
    }
  };
  const getStockHistory = async () => {
    try {
      firestore()
        .collection('stock')
        .where('owner', '==', owner)
        .where('item_id', '==', itemId)
        .onSnapshot(querySnapshot => {
          let result: Array<any> = [];
          querySnapshot.forEach(documentSnapshot => {
            result.push({
              id: documentSnapshot.id,
              doc: documentSnapshot.data(),
            });
          });
          setStockHistory(result);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getItemInfo();
    getStockHistory();
  }, [itemId]);

  return (
    <SafeAreaView style={[styles.container]}>
      {pickerVisible ? (
        <ImageUpdatePicker
          updating={updating}
          photo={photo}
          setPhoto={setPhoto}
          updateImage={updateImage}
          setPickerVisible={setPickerVisible}
        />
      ) : null}
      {loading ? (
        <StatusBox msg="Loading..." overlay={false} />
      ) : (
        <>
          {data ? (
            <>
              <ScrollView style={{flex: 1}}>
                <View style={[styles.viewContainer]}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 10,
                      justifyContent: 'space-between',
                    }}>
                    <View style={{justifyContent: 'flex-start'}}>
                      <Text style={[styles.textBold, {marginHorizontal: 0}]}>
                        {t('Item_Name')}
                      </Text>
                      <Text style={[styles.textLight, {marginHorizontal: 10}]}>
                        {data.item_name}
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        onPress={() => setPickerVisible(true)}
                        style={{
                          position: 'absolute',
                          right: 10,
                          top: 10,
                          zIndex: 10,
                        }}>
                        <Icon
                          name="camera"
                          size={25}
                          color={colors.white}
                          style={{
                            elevation: 10,
                            shadowColor: 'black',
                            backgroundColor: colors.primary,
                            borderRadius: 100,
                            padding: 2,
                          }}
                        />
                      </TouchableOpacity>
                      <Image
                        style={{width: 250, height: 150, borderRadius: 10}}
                        resizeMode="cover"
                        source={
                          data.picture
                            ? {uri: data.picture}
                            : require('../../assets/images/no_image.jpg')
                        }
                      />
                    </View>
                  </View>
                  <Text style={styles.textBold}>{t('Item_Details')}</Text>
                  <View style={styles.boardContainer}>
                    <View style={styles.boardCol}>
                      <Text style={styles.boardTopTitle}>{t('Price')}</Text>
                      <Text style={styles.boardSubTitle}>
                        {formatNumber(data.unit_price)} {t('Birr')}
                      </Text>
                    </View>
                    <View style={styles.boardCol}>
                      <Text style={styles.boardTopTitle}>{t('Total')}</Text>
                      <Text
                        style={[styles.boardSubTitle, {textAlign: 'right'}]}>
                        {formatNumber(data.currentCount).split('.')[0]}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.textBold}>{t('Item_History')}</Text>
                  <View style={{marginVertical: 20}}>
                    <View style={tableStyles.thead}>
                      <Text style={tableStyles.theadFont}>{t('Price')}</Text>
                      <Text style={tableStyles.theadFont}>{t('Unit')}</Text>
                      <Text style={tableStyles.theadFont}>{t('Supplier')}</Text>
                      <Text style={tableStyles.theadFont}>{t('date')}</Text>
                    </View>
                    {stockHistory.map(history => {
                      return (
                        <View
                          key={Math.random()}
                          style={[
                            tableStyles.trow,
                            {
                              backgroundColor:
                                history.doc % 2 != 0 ? 'transparent' : 'white',
                            },
                          ]}>
                          <Text style={tableStyles.trowFont}>
                            {formatNumber(history.doc.unit_price)} {t('Birr')}
                          </Text>
                          <Text style={tableStyles.trowFont}>
                            {
                              formatNumber(history.doc.initialCount).split(
                                '.',
                              )[0]
                            }{' '}
                            {history.doc.unit}
                          </Text>
                          <Text style={tableStyles.trowFont}>
                            {history.doc.supplier_name}
                          </Text>
                          <Text style={tableStyles.trowFont}>
                            {history.doc.date}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </ScrollView>
              <View
                style={{
                  paddingHorizontal: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                {/* <TouchableOpacity
          onPress={() =>
            navigation.navigate(routes.EditItem, {
              data,
              owner,
              itemId,
            })
          }
          style={{
            backgroundColor: colors.primary,
            height: 45,
            marginBottom: 10,
            paddingHorizontal: 20,
            justifyContent: 'space-between',
            width: '30%',
            alignItems: 'center',
            borderRadius: 10,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: colors.white,
              textAlign: 'center',
              fontSize: 19,
            }}>
            {t('Update')}
          </Text>
          <Icon name="pencil" size={25} color={colors.white} />
        </TouchableOpacity> */}

                <TouchableOpacity
                  onPress={() => deleteItem()}
                  style={{
                    backgroundColor: colors.red,
                    height: 45,
                    marginBottom: 10,
                    paddingHorizontal: 20,
                    justifyContent: 'space-between',
                    width: '30%',
                    alignItems: 'center',
                    borderRadius: 10,
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      color: colors.white,
                      textAlign: 'center',
                      fontSize: 19,
                    }}>
                    {t('Delete')}
                  </Text>
                  <Icon name="delete" size={25} color={colors.white} />
                </TouchableOpacity>
              </View>
            </>
          ) : null}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
  viewContainer: {
    marginHorizontal: 5,
    justifyContent: 'space-between',
    display: 'flex',
    flexGrow: 1,
    flex: 1,
  },
  boardContainer: {
    marginVertical: 15,
    backgroundColor: 'white',
    height: 80,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  boardCol: {
    justifyContent: 'center',
  },
  boardTopTitle: {
    fontSize: 18,
    color: colors.black,
    fontWeight: '800',
  },
  boardSubTitle: {
    fontWeight: '300',
    textAlign: 'left',
    fontSize: 22,
    color: colors.black,
  },
  textBold: {
    fontSize: 22,
    marginTop: 25,
    fontWeight: 'bold',
    color: colors.black,
    paddingHorizontal: 10,
  },
  textLight: {
    fontSize: 22,
    fontWeight: '400',
    color: colors.black,
    marginHorizontal: 20,
  },
});

const tableStyles = StyleSheet.create({
  thead: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  theadFont: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  trow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#00000030',
  },
  trowFont: {
    fontSize: 16,
    color: colors.black,
  },
  oddRow: {
    backgroundColor: 'transparent',
  },
  evenRow: {
    backgroundColor: 'white',
  },

  textStyle: {
    color: colors.black,
  },
});

export default ItemDetails;

const ImageUpdatePicker = ({
  photo,
  setPhoto,
  updateImage,
  updating,
  setPickerVisible,
}) => {
  //   const [photo, setPhoto] = useState('');
  const {t} = useTranslation();

  const pickImage = type => {
    type == 'image'
      ? ImagePicker.openPicker({})
          .then(image => {
            setPhoto(image.path);
          })
          .catch(err => console.log(err))
      : ImagePicker.openCamera({useFrontCamera: false})
          .then(image => {
            setPhoto(image.path);
          })
          .catch(err => console.log(err));
  };

  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 200,
        backgroundColor: colors.transBlack,
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}>
      <View
        style={{
          // height: 200,
          width: '80%',
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.white,
          borderRadius: 5,
        }}>
        {photo ? (
          <View
            style={{
              padding: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View>
                <Image
                  source={{
                    uri: photo,
                  }}
                  style={{
                    width: 145,
                    borderRadius: 5,
                    aspectRatio: 1,
                  }}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => !updating && setPhoto('')}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    zIndex: 10,
                    backgroundColor: colors.red,
                    borderRadius: 30,
                    height: 30,
                    width: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon name="close" size={25} color={colors.white} />
                </TouchableOpacity>
              </View>

              <View>
                <TouchableOpacity onPress={() => pickImage('image')}>
                  <Icon
                    name="image"
                    size={50}
                    color={colors.black}
                    style={{marginBottom: 15}}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => pickImage('camera')}>
                  <Icon name="camera" size={50} color={colors.black} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              {!updating ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    marginRight: 10,
                    backgroundColor: colors.white,
                    paddingHorizontal: 20,
                    paddingVertical: 5,
                    marginTop: 30,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: colors.primary,
                  }}
                  onPress={() => {
                    if (!updating) setPickerVisible(false);
                  }}>
                  <Text style={{color: colors.black}}>Cancel</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  marginRight: 10,
                  backgroundColor: !updating
                    ? colors.primary
                    : colors.lightBlue,
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                  marginTop: 30,
                  borderRadius: 5,
                }}
                onPress={() => updateImage()}>
                <Text style={{color: colors.white}}>
                  {!updating ? 'Update' : 'Updating...'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <Text style={{color: colors.black, marginVertical: 10}}>
              {t('Update_Item_Image')}
            </Text>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
                flexDirection: 'row',
              }}>
              <TouchableOpacity onPress={() => pickImage('image')}>
                <Icon
                  name="image"
                  size={65}
                  color={colors.black}
                  style={{marginRight: 15}}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => pickImage('camera')}>
                <Icon name="camera" size={65} color={colors.black} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                marginRight: 10,
                backgroundColor: colors.white,
                paddingHorizontal: 20,
                paddingVertical: 5,
                marginTop: 30,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: colors.primary,
              }}
              onPress={() => {
                if (!updating) setPickerVisible(false);
              }}>
              <Text style={{color: colors.black}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};
