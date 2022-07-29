import React, {useContext, useEffect, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import StatusBox from '../../components/misc/StatusBox';
import firestore from '@react-native-firebase/firestore';
import {StateContext} from '../../global/context';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import colors from '../../config/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';

const AddNewItem = ({setIsModalVisible, setAddedItems, addedItems}) => {
  const {t} = useTranslation();
  const {user} = useContext(StateContext);
  const [loading, setLoading] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);

  const [selectedItem, setSelectedItem]: Array<any> = useState([]);
  const [detailsItem, setDetailsItem] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [quantityInputError, setQuntityInputError] = useState('');
  const [priceInputError, setPriceInputError] = useState('');

  const [data, setData]: Array<any> = useState([]);
  const [filterValue, setFilterValue] = useState('');

  let unmounted = false;

  const handleSubmit = () => {
    if (quantityInputError) return;
    // if (!quantity) return setQuntityInputError(t('Item_Out_Of_Stock'));
    let q = parseFloat(selectedItem[0].quantity);
    let p = parseFloat(selectedItem[0].unitPrice);

    let totalItems = quantity ? parseFloat(quantity) : q;
    let unitSalePrice = price ? parseFloat(price) : p;
    let saleProfit = totalItems * unitSalePrice - totalItems * p;

    const newItem = {
      listId: new Date(),
      id: selectedItem[0].id,
      itemName: selectedItem[0].itemName,
      saleProfit: saleProfit,
      originalPrice: p,
      unitPrice: unitSalePrice,
      quantity: totalItems,
    };
    setAddedItems([...addedItems, newItem]);
    setIsModalVisible(false);
    setDetailsVisible(false);
  };

  const getItems = async () => {
    setLoading(true);
    try {
      firestore()
        .collection('inventory')
        .where('owner', '==', user.uid)
        .onSnapshot(querySnapshot => {
          let result: Array<Object> = [];
          querySnapshot.forEach(sn => {
            const item = {
              id: sn.id,
              itemName: sn.data().item_name,
              quantity: sn.data().currentCount,
              unitPrice: sn.data().unit_SalePrice,
            };
            if (addedItems.length) {
              addedItems.map(i => {
                if (item.id == i.id) {
                  item.quantity = item.quantity - i.quantity;
                }
              });
              result.push(item);
            } else {
              result.push(item);
            }
          });
          setData(result);
        });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getItems();
    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        width: '100%',
        position: 'absolute',
        backgroundColor: colors.white,
        zIndex: 1,
      }}>
      {loading ? (
        <StatusBox msg={'loading'} onPress={() => {}} type="loading" />
      ) : (
        <>
          {detailsVisible ? (
            <Pressable
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                backgroundColor: '#00000090',
                position: 'absolute',
                flex: 1,
                zIndex: 4,
              }}>
              <View
                style={{
                  width: '90%',
                  maxWidth: 360,
                  paddingVertical: 20,
                  paddingHorizontal: 10,
                  borderRadius: 20,
                  backgroundColor: colors.white,
                }}>
                <Text
                  style={[
                    styles.textBold,
                    {textAlign: 'center', marginBottom: 20},
                  ]}>
                  {detailsItem!.itemName}
                </Text>
                <Text
                  style={{
                    color: colors.black,
                    fontWeight: '600',
                    marginHorizontal: 5,
                    marginTop: 10,
                    fontSize: 18,
                  }}>
                  {t('Amount')} {`(${t('Current_Amount')}: `}
                  {detailsItem!.quantity}
                  {')'}
                </Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={val => {
                    setQuantity(val.replace(/[^0-9\.?]/g, ''));
                    if (parseFloat(val) > parseFloat(detailsItem!.quantity)) {
                      setQuntityInputError('Maximum value exceeded.');
                    } else {
                      setQuntityInputError('');
                    }
                  }}
                  value={quantity}
                  placeholder={t('Enter_Amount')}
                  keyboardType="numeric"
                  placeholderTextColor={colors.faded_grey}
                />
                <Text style={{color: colors.red}}>{quantityInputError}</Text>

                <Text
                  style={{
                    color: colors.black,
                    fontWeight: '600',
                    marginHorizontal: 5,
                    marginTop: 10,
                    fontSize: 18,
                  }}>
                  {t('Sale_Price')}
                  {` (${detailsItem!.unitPrice} ${t('Birr')})`}
                </Text>

                <TextInput
                  style={styles.textInput}
                  onChangeText={val => {
                    setPrice(val.replace(/[^0-9\.?]/g, ''));
                  }}
                  placeholder={t('Enter_Unit_Price')}
                  value={price}
                  keyboardType="numeric"
                  placeholderTextColor={colors.faded_grey}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    marginTop: 10,
                  }}>
                  <TouchableOpacity onPress={() => setDetailsVisible(false)}>
                    <Text
                      style={[
                        styles.textBold,
                        {
                          borderWidth: 0.5,
                          color: colors.black,
                          textAlign: 'center',
                          width: 120,
                          maxWidth: 200,
                          alignSelf: 'center',
                          padding: 10,
                          borderRadius: 10,
                          marginBottom: 5,
                          marginTop: 5,
                        },
                      ]}>
                      {t('Cancel')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSubmit}>
                    <Text
                      style={[
                        styles.textBold,
                        {
                          backgroundColor: colors.faded_dark,
                          color: colors.white,
                          textAlign: 'center',
                          width: 120,
                          borderWidth: 2,
                          borderColor: colors.black,
                          maxWidth: 200,
                          alignSelf: 'center',
                          padding: 10,
                          borderRadius: 10,
                          marginBottom: 5,
                          marginTop: 5,
                        },
                      ]}>
                      {t('Add')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          ) : null}

          <KeyboardAvoidingView>
            <Text
              style={[
                styles.textBold,
                {
                  textAlign: 'center',
                  paddingTop: 20,
                  fontSize: 23,
                  width: '95%',
                  alignSelf: 'center',
                  paddingVertical: 10,
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                },
              ]}>
              {t('Add_Item')}
            </Text>

            <View
              style={{
                backgroundColor: colors.white,
                marginHorizontal: 20,
                marginVertical: 10,
                paddingHorizontal: 10,
                elevation: 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 10,
                borderWidth: 0.8,
              }}>
              <TextInput
                style={{
                  flexGrow: 1,
                  padding: 5,
                  paddingHorizontal: 10,
                  fontSize: 18,
                  color: colors.black,
                }}
                autoFocus={true}
                placeholder={`${t('Search')}...`}
                placeholderTextColor={'#00000070'}
                onChangeText={val => setFilterValue(val)}
              />

              <Icon2
                name="search1"
                color={colors.primary}
                size={25}
                style={{}}
              />
            </View>
            <Icon
              name="close"
              color={colors.black}
              size={35}
              style={{position: 'absolute', right: 10, top: 10}}
              onPress={() => setIsModalVisible(false)}
            />
          </KeyboardAvoidingView>

          <ScrollView
            contentContainerStyle={{
              borderRadius: 20,
            }}
            style={{
              maxHeight: '80%',
              borderRadius: 10,
              borderTopRightRadius: 0,
              borderTopLeftRadius: 0,
              paddingBottom: 20,
              marginHorizontal: 10,
              backgroundColor: colors.white,
              width: '95%',
              alignSelf: 'center',
            }}>
            {data
              .filter(i => parseFloat(i.quantity) > 0)
              .filter(i =>
                i.itemName.toLowerCase().includes(filterValue.toLowerCase()),
              )
              .map(item => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    key={item.id}
                    onPress={() => {
                      setDetailsVisible(true);
                      setDetailsItem(item);
                      setSelectedItem([...selectedItem, item]);
                    }}
                    style={styles.ListItem}>
                    <View style={styles.LeftContainer}>
                      <View style={{marginLeft: 10}}>
                        <Text style={styles.textBold}>{item.itemName}</Text>
                        <Text style={styles.textLight}>
                          <Text style={styles.textBold}>
                            {item.unitPrice}
                            {t('Birr')}
                          </Text>
                          /{t('Single')}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.RightContainer}>
                      <Text style={styles.textBold}>
                        {t('Amount')} {item.quantity}
                      </Text>
                    </View>
                    <Icon name="plus-circle" color={colors.black} size={30} />
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default AddNewItem;

const styles = StyleSheet.create({
  textBold: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 18,
    paddingHorizontal: 10,
  },
  textLight: {
    paddingHorizontal: 10,
    color: colors.faded_grey,
    fontWeight: '300',
    fontSize: 18,
  },

  ListItemContainer: {},
  ListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
    marginTop: 5,
    marginBottom: 5,
    paddingVertical: 5,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: '95%',
    elevation: 5,
  },
  LeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  RightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  textInput: {
    color: colors.black,
    height: 50,
    borderWidth: 1,
    paddingHorizontal: 20,
    borderRadius: 10,
    fontSize: 18,
    marginTop: 10,
  },
});
