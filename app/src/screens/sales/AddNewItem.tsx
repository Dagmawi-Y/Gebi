import React, {useContext, useEffect, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
} from 'react-native';
import StatusBox from '../../components/misc/StatusBox';
import firestore from '@react-native-firebase/firestore';
import {StateContext} from '../../global/context';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../config/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {v4 as uuidv4} from 'uuid';

const AddNewItem = ({setIsModalVisible, setAddedItems, addedItems}) => {
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

  let unmounted = false;

  const handleSubmit = () => {
    if (quantityInputError) return;
    const newItem = {
      listId: new Date(),
      id: selectedItem[0].id,
      itemName: selectedItem[0].itemName,
      unitPrice: price ? price : selectedItem[0].unitPrice,
      quantity: quantity ? quantity : selectedItem[0].quantity,
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
              quantity: sn.data().stock.quantity,
              unitPrice: sn.data().stock.unit_price,
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
        backgroundColor: '#00000060',
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
                backgroundColor: '#00000060',
                position: 'absolute',
                flex: 1,
                zIndex: 4,
              }}>
              <View
                style={{
                  backgroundColor: colors.white,
                  width: '90%',
                  maxWidth: 360,
                  paddingVertical: 20,
                  paddingHorizontal: 10,
                  borderRadius: 20,
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
                    fontSize: 20,
                  }}>
                  Quantity {'(Total: '}
                  {detailsItem!.quantity}
                  {')'}
                </Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={val => {
                    setQuantity(val.replace(/[^0-9]/g, ''));
                    if (parseFloat(val) > parseFloat(detailsItem!.quantity)) {
                      setQuntityInputError('Maximum value exceeded.');
                    } else {
                      setQuntityInputError('');
                    }
                  }}
                  value={quantity}
                  placeholder={'Enter Quantity'}
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
                    fontSize: 20,
                  }}>
                  Unit Price{' (Unit Price: '}
                  {detailsItem!.unitPrice}
                  {')'}
                </Text>

                <TextInput
                  style={styles.textInput}
                  onChangeText={val => {
                    setPrice(val.replace(/[^0-9]/g, ''));
                  }}
                  placeholder={'Enter Unit Price'}
                  value={price}
                  keyboardType="numeric"
                  placeholderTextColor={colors.faded_grey}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                  }}>
                  <TouchableOpacity onPress={() => setDetailsVisible(false)}>
                    <Text
                      style={[
                        styles.textBold,
                        {
                          backgroundColor: colors.white,
                          borderWidth: 2,
                          color: colors.black,
                          textAlign: 'center',
                          width: 120,
                          maxWidth: 200,
                          alignSelf: 'center',
                          padding: 10,
                          borderRadius: 20,
                          marginBottom: 5,
                          marginTop: 5,
                        },
                      ]}>
                      Cancel
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
                          maxWidth: 200,
                          alignSelf: 'center',
                          padding: 10,
                          borderRadius: 20,
                          marginBottom: 5,
                          marginTop: 5,
                        },
                      ]}>
                      Add Item
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          ) : null}
          <View>
            <Text
              style={[
                styles.textBold,
                {
                  textAlign: 'center',
                  backgroundColor: colors.white,
                  marginTop: 20,
                  paddingTop: 20,
                  fontSize: 25,
                  width: '95%',
                  alignSelf: 'center',
                  paddingVertical: 20,
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                },
              ]}>
              Add Item
            </Text>
            <Icon
              name="close"
              color={colors.black}
              size={30}
              style={{position: 'absolute', right: 30, top: 35}}
              onPress={() => setIsModalVisible(false)}
            />
          </View>

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
            {data.map(item => {
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
                        <Text style={styles.textBold}>{item.unitPrice}ብር</Text>
                        /አንዱን
                      </Text>
                    </View>
                  </View>
                  <View style={styles.RightContainer}>
                    <Text style={styles.textBold}>ብዛት {item.quantity}</Text>
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
    fontSize: 20,
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
    zIndex: 1,
    marginTop: 5,
    marginBottom: 10,
    elevation: 5,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    width: '95%',
    alignSelf: 'center',
  },
  LeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
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
    fontSize: 20,
    marginTop: 10,
  },
});
