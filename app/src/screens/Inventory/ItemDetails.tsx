import {useContext} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  Pressable,
} from 'react-native';

import React, {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import colors from '../../config/colors';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import routes from '../../navigation/routes';
import firestore from '@react-native-firebase/firestore';
import {StateContext} from '../../global/context';

import Edit from './Edit';

const ItemDetails = ({route, navigation}) => {
  const {data, itemId} = route.params;
  const {user} = useContext(StateContext);

  const deleteItem = async () => {
    Alert.alert(`Are you sure,you want to delete`, `${data.item_name}?`, [
      {
        text: 'Yes',
        onPress: async () => {
          await firestore()
            .collection('users')
            .doc(user.uid)
            .collection('inventory')
            .doc(itemId)
            .delete();
          navigation.replace(routes.inventory);
        },
        style: 'default',
      },
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
    ]);
  };
  return (
    <SafeAreaView style={[styles.container]}>
      <View style={header.topBar}>
        <View
          style={{
            marginVertical: 0,
            marginHorizontal: 5,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginBottom: 5,
          }}>
          <Pressable
            onPress={() =>
              navigation.navigate(routes.EditItem, {
                data: data,
                itemId: itemId,
              })
            }
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              marginHorizontal: 10,
            }}>
            <Icon name="lead-pencil" size={25} color={colors.white} />
            <Text style={{color: colors.white}}>Edit</Text>
          </Pressable>
          <Pressable
            onPress={() => deleteItem()}
            style={{
              alignSelf: 'flex-end',
              marginHorizontal: 10,
              alignItems: 'center',
            }}>
            <Icon name="delete" size={25} color={colors.white} />
            <Text style={{color: colors.white}}>Delete</Text>
          </Pressable>
        </View>
      </View>
      {/* End Header */}

      <ScrollView style={{flex: 1}}>
        <KeyboardAwareScrollView
          enableOnAndroid
          contentContainerStyle={[styles.keyboardAwareScrollContainer]}>
          <View
            style={{
              backgroundColor: 'white',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 25,
              justifyContent: 'space-between',
            }}>
            <View>
              <Text
                style={{fontSize: 22, marginBottom: 5, color: colors.black}}>
                የእቃ ስም
              </Text>
              <Text
                style={{fontSize: 22, fontWeight: 'bold', color: colors.black}}>
                {data.item_name}
              </Text>
            </View>
            <View>
              <Image
                style={{width: 100, height: 100}}
                resizeMode="contain"
                source={require('../../assets/images/phone_image.jpg')}
              />
            </View>
          </View>
          <Text
            style={{
              fontSize: 22,
              marginTop: 25,
              fontWeight: 'bold',
              color: colors.black,
            }}>
            ዕቃ መረጃ
          </Text>
          <View style={styles.boardContainer}>
            <View style={styles.boardCol}>
              <Text style={styles.boardTopTitle}>የመሸጫ ዋጋ</Text>
              <Text style={styles.boardSubTitle}>
                {data.stock.unit_price} ብር
              </Text>
            </View>
            <View style={styles.boardCol}>
              <Text style={styles.boardTopTitle}>በእጅ ያለ</Text>
              <Text style={styles.boardSubTitle}>{data.stock.quantity}</Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 22,
              marginTop: 25,
              fontWeight: 'bold',
              color: colors.black,
            }}>
            የእቃ ታሪክ
          </Text>
          <View style={{marginVertical: 20}}>
            <View style={tableStyles.thead}>
              <Text style={tableStyles.theadFont}>ዋጋ</Text>
              <Text style={tableStyles.theadFont}>ብዛት</Text>
              <Text style={tableStyles.theadFont}>አቅራቢ</Text>
              <Text style={tableStyles.theadFont}>ቀን</Text>
            </View>
            {[1].map(e => {
              return (
                <View
                  key={e}
                  style={[
                    tableStyles.trow,
                    {backgroundColor: e % 2 != 0 ? 'transparent' : 'white'},
                  ]}>
                  <Text style={tableStyles.trowFont}>
                    {data.stock.unit_price} ብር
                  </Text>
                  <Text style={tableStyles.trowFont}>
                    {data.stock.quantity} pcs
                  </Text>
                  <Text style={tableStyles.trowFont}>
                    {data.stock.supplier_name}
                  </Text>
                  <Text style={tableStyles.trowFont}>{data.stock.date}</Text>
                  {/* <Text style={tableStyles.trowFont}>{data.stock.date}</Text> */}
                </View>
              );
            })}
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
  keyboardAwareScrollContainer: {
    marginHorizontal: 5,
    paddingVertical: 10,
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
    paddingHorizontal: 30,
  },
  boardCol: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardTopTitle: {fontSize: 18, color: colors.black, fontWeight: '800'},
  boardSubTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    color: colors.black,
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

const header = StyleSheet.create({
  topBar: {
    backgroundColor: colors.primary,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  topBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  statContainer: {
    marginTop: 10,
  },

  // Typetwo
  boardContainer: {
    marginHorizontal: 5,
    marginVertical: 20,
    backgroundColor: 'white',
    height: 80,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  boardCol: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  buttonwithIcon: {
    backgroundColor: colors.lightBlue,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    width: '25%',
    padding: 10,
    gap: 2,
  },
  boardTopTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.black,
  },
  boardSubTitle: {color: colors.grey, fontWeight: 'bold', fontSize: 12},
});
export default ItemDetails;
