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

import React, {useEffect, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import colors from '../../config/colors';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import routes from '../../navigation/routes';
import firestore from '@react-native-firebase/firestore';

const ItemDetails = ({route, navigation}) => {
  const {data, owner, itemId} = route.params;

  const [stockHistory, setStockHistory]: Array<any> = ([] = useState([]));

  const deleteItem = async () => {
    Alert.alert(`እርግጠኛ ነዎት?`, ``, [
      {
        text: 'ቀጥል',
        onPress: async () => {
          await firestore().collection('inventory').doc(itemId).delete();
          navigation.replace(routes.inventoryHome);
        },
        style: 'default',
      },
      {
        text: 'ተመለስ',
        onPress: () => {},
        style: 'cancel',
      },
    ]);
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
    getStockHistory();
  }, []);
  return (
    <SafeAreaView style={[styles.container]}>
      {/* <View style={header.topBar}>
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
      </View> */}
      {/* End Header */}

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
            <View>
              <Text style={styles.textBold}>የእቃ ስም</Text>
              <Text style={styles.textLight}>{data.item_name}</Text>
            </View>
            <View>
              <Image
                style={{width: 250, height: 150, borderRadius: 10}}
                resizeMode="cover"
                source={require('../../assets/images/phone_image.jpg')}
              />
            </View>
          </View>
          <Text style={styles.textBold}>ዕቃ መረጃ</Text>
          <View style={styles.boardContainer}>
            <View style={styles.boardCol}>
              <Text style={styles.boardTopTitle}>የመሸጫ ዋጋ</Text>
              <Text style={styles.boardSubTitle}>{data.unit_price} ብር</Text>
            </View>
            <View style={styles.boardCol}>
              <Text style={styles.boardTopTitle}>በእጅ ያለ</Text>
              <Text style={styles.boardSubTitle}>{data.currentCount}</Text>
            </View>
          </View>
          <Text style={styles.textBold}>የእቃ ታሪክ</Text>
          <View style={{marginVertical: 20}}>
            <View style={tableStyles.thead}>
              <Text style={tableStyles.theadFont}>ዋጋ</Text>
              <Text style={tableStyles.theadFont}>መመዝኛ</Text>
              <Text style={tableStyles.theadFont}>አቅራቢ</Text>
              <Text style={tableStyles.theadFont}>ቀን</Text>
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
                    {history.doc.unit_price} ብር
                  </Text>
                  <Text style={tableStyles.trowFont}>
                    {history.doc.initialCount} {history.doc.unit}
                  </Text>
                  <Text style={tableStyles.trowFont}>
                    {history.doc.supplier_name}
                  </Text>
                  <Text style={tableStyles.trowFont}>{history.doc.date}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          paddingHorizontal: 10,
        }}>
        <TouchableOpacity
          onPress={() => deleteItem()}
          style={{
            backgroundColor: colors.red,
            height: 60,
            marginBottom: 10,
            paddingHorizontal: 25,
            justifyContent: 'space-between',
            width: 'auto',
            alignItems: 'center',
            borderRadius: 30,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: colors.white,
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 25,
            }}>
            አጥፋ
          </Text>
          <Icon name="delete" size={25} color={colors.white} />
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 30,
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

const header = StyleSheet.create({
  topBar: {
    // backgroundColor: colors.primary,
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
