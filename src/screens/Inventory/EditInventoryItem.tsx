import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  ToastAndroid,
  AppRegistry,
} from 'react-native';

import React, {useContext, useEffect, useState} from 'react';
import {TextInput, TouchableHighlight} from 'react-native-gesture-handler';
import colors from '../../config/colors';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {StateContext} from '../../global/context';
import Loading from '../../components/lotties/Loading';
import LoadingModal from '../../components/lotties/LoadingModal';
import SelectDropdown from 'react-native-select-dropdown';
const EditInventoryItem = ({route, navigation}) => {
  const {data, itemId, updateCategoryCount, totalStock} = route.params;
  const [total, setTotal] = useState(0);
  const [unit, setUnit] = useState('');
  const [unit_price, setUnitPrice] = useState(0);
  const [shouldEdit, setShouldEdit] = useState(false);
  const [createdDate, setCreatedDate] = useState('');
  const [supplier, setSupplier] = useState('');
  const {t} = useTranslation();
  const [headerMessage, setHeaderMessage] = useState('Item Detail');
  const {userInfo} = useContext(StateContext);
  const [loading, setLoading] = useState(false);
  const quantifiers = [
    t('Piece'),
    t('Kg'),
    t('Litre'),
    t('Metre'),
    t('Quintal'),
  ];
  const [invoiceNumber, setInvoiceNumber] = useState('');

  useEffect(() => {
    setTotal(data.doc.initialCount);
    setUnit(data.doc.unit);
    setUnitPrice(data.doc.unit_price);
    setCreatedDate(data.doc.date);
    setSupplier(data.doc.supplier_name);
    setInvoiceNumber(data.doc.invoiceNumber);
  }, [route]);

  function ValidateForm(): boolean {
    if (!total || !unit || !unit_price || !supplier) {
      return false;
    } else {
      return true;
    }
  }
  const deleteItem = async () => {
    Alert.alert(t('Are_You_Sure?'), ``, [
      {
        text: t('Yes'),
        onPress: async () => {
          await firestore()
            .collection('stock')
            .doc(data.id)
            .delete()
            .then(async () => {
              await firestore()
                .collection('inventory')
                .doc(itemId)
                .update({
                  currentCount: firestore.FieldValue.increment(
                    -data.doc.initialCount,
                  ),
                });
            })
            .catch(error => {
              ToastAndroid.show('Delete Error', ToastAndroid.SHORT);
            });

          //this means now the item is left 1 in stock and this has to be deleted from inventory as well
          if (totalStock == 1) {
            await firestore().collection('inventory').doc(itemId).delete();
          }
          updateCategoryCount(-data.doc.initialCount);

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

  const CustomTextInput = (
    value: any,
    setValue: any,
    shouldEdit: boolean,
    placeholder: string,
    keyboardInput,
    hardDisable: boolean,
  ) => {
    return (
      <TextInput
        style={styles.input}
        onChangeText={(value: any) => setValue(value)}
        value={value}
        placeholder={placeholder}
        keyboardType={keyboardInput}
        placeholderTextColor={colors.black}
        editable={hardDisable ? false : shouldEdit}
      />
    );
  };

  const handleEdit = async () => {
    // console.log("unit : " + unit);
    // console.log("total : " + total);
    // console.log("Supplier : " + supplier);
    // console.log("Unit price : " + unit_price);
    // console.log("created date :" + createdDate);
    if (ValidateForm()) {
      const newTotalItems: number = total - data.doc.initialCount;
      Alert.alert(t('Are_You_Sure?'), ``, [
        {
          text: t('Yes'),
          onPress: async () => {
            setLoading(true);
            await firestore()
              .collection('stock')
              .doc(data.id)
              .update({
                initialCount: total,
                unit: unit,
                supplier_name: supplier,
                invoiceNumber: invoiceNumber,
                unit_price: unit_price,
              })
              .then(async () => {
                data.doc.initialCount = total;
                await firestore()
                  .collection('inventory')
                  .doc(itemId)
                  .update({
                    currentCount: firestore.FieldValue.increment(newTotalItems),
                    invoiceNumber: invoiceNumber,
                  });
              })
              .catch(error => {
                ToastAndroid.show('Update Error', ToastAndroid.SHORT);
              });
            setLoading(false);
            setShouldEdit(false);
            updateCategoryCount(newTotalItems);
          },
          style: 'default',
        },
        {
          text: t('Cancel'),
          onPress: () => {},
          style: 'cancel',
        },
      ]);
    } else {
      ToastAndroid.show('Field is requied', ToastAndroid.SHORT);
    }
  };

  return (
    <View>
      <ScrollView>
        <Text
          style={{
            marginTop: 10,
            fontWeight: 'bold',
            fontSize: 25,
            textAlign: 'center',
            color: 'black',
          }}>
          {headerMessage}
        </Text>

        <Text
          style={{
            color: colors.black,
            fontWeight: 'bold',
            fontSize: 18,
            marginLeft: 20,
          }}>
          {'Invocie Number'}
        </Text>

        {CustomTextInput(
          invoiceNumber.toString(),
          setInvoiceNumber,
          shouldEdit,
          'invoice',
          'text',
          false,
        )}

        <Text
          style={{
            color: colors.black,
            fontWeight: 'bold',
            fontSize: 18,
            marginLeft: 20,
          }}>
          {'Total'}
        </Text>

        {CustomTextInput(
          total.toString(),
          setTotal,
          shouldEdit,
          'total',
          'numeric',
          false,
        )}

        <Text
          style={{
            color: colors.black,
            fontWeight: 'bold',
            fontSize: 18,
            marginLeft: 20,
          }}>
          {'Unit'}
        </Text>
        <View style={{marginLeft: 21, marginRight: 40}}>
          <SelectDropdown
            data={quantifiers}
            defaultButtonText={unit}
            renderDropdownIcon={() => (
              <View>
                <Icon name="chevron-down" size={20} color={colors.black} />
              </View>
            )}
            buttonStyle={styles.dropDown}
            disabled={!shouldEdit}
            onSelect={selectedItem => {
              setUnit(selectedItem);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
          />
        </View>

        <Text
          style={{
            color: colors.black,
            fontWeight: 'bold',
            fontSize: 18,
            marginLeft: 20,
          }}>
          {'Supplier'}
        </Text>
        {CustomTextInput(
          supplier,
          setSupplier,
          shouldEdit,
          'Supplier',
          'text',
          false,
        )}

        <Text
          style={{
            color: colors.black,
            fontWeight: 'bold',
            fontSize: 18,
            marginLeft: 20,
          }}>
          {'Unit Price'}
        </Text>
        {CustomTextInput(
          unit_price,
          setUnitPrice,
          shouldEdit,
          'Unit Price',
          'numeric',
          false,
        )}

        <Text
          style={{
            color: colors.black,
            fontWeight: 'bold',
            fontSize: 18,
            marginLeft: 20,
          }}>
          {'Created Date'}
        </Text>
        {CustomTextInput(
          createdDate,
          setCreatedDate,
          shouldEdit,
          'Created Date',
          'text',
          true,
        )}
        {shouldEdit ? (
          <TouchableHighlight onPress={handleEdit} style={styles.button}>
            <Text style={styles.buttonText}>
              {!loading ? 'Save' : 'Saving...'}
            </Text>
          </TouchableHighlight>
        ) : (
          <View></View>
        )}
        <View style={styles.editAndDelteStyle}>
          <TouchableOpacity onPress={() => setShouldEdit(!shouldEdit)}>
            <Icon
              style={{padding: 20}}
              name={!shouldEdit ? 'pencil' : 'close'}
              size={25}
              color={colors.black}
            />
          </TouchableOpacity>

          {!shouldEdit ? (
            <TouchableOpacity onPress={() => deleteItem()}>
              <Icon
                style={{padding: 20, color: '#BF2626'}}
                name="delete"
                size={25}
                color={colors.black}
              />
            </TouchableOpacity>
          ) : (
            <View></View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    marginLeft: 20,
    marginTop: 3,
    marginBottom: 10,
    width: 350,
    height: 50,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'black',
    paddingLeft: 5,
    color: colors.black,
  },
  button: {
    backgroundColor: '#203FBB',
    borderRadius: 15,
    margin: 20,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },

  editAndDelteStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dropDown: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
    backgroundColor: colors.white,
  },
});

export default EditInventoryItem;
