import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Pressable,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text} from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';
import {StateContext} from '../../global/context';
import Icon from 'react-native-vector-icons/AntDesign';

import TopBar from '../../components/TopBar/TopBar';
import Loading from '../../components/lotties/Loading';
import EmptyBox from '../../components/lotties/EmptyBox';
import InvetoryListItem from './InventoryListItem';
import colors from '../../config/colors';
import routes from '../../navigation/routes';

import AddNew from './AddNew';
import FloatingButton from '../../components/FloatingButton/FloatingButton';

export default function Items({navigation}) {
  const {user} = useContext(StateContext);

  const [data, setData]: Array<any> = useState([]);
  const [filter, setFilter]: Array<any> = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchVisible, setSearchVisible] = useState(false);

  const [searchKey, setSearchKey] = useState('');
  const [sumPrice, setSumPrice] = useState('0');
  const [totalItems, setTotalItems] = useState('0');
  const [addNewModalVisible, setAddNewModalVisible] = useState(false);

  const formatNumber = num => {
    return String(num.toString()).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  };

  const reCalculate = dt => {
    let sumItem = 0;
    let sumItemPrice = 0;
    dt.map(it => {
      sumItem += parseFloat(it.doc.stock.quantity);
      sumItemPrice +=
        parseFloat(it.doc.stock.quantity) * parseFloat(it.doc.stock.unit_price);
    });

    setTotalItems(formatNumber(sumItem));
    setSumPrice(formatNumber(sumItemPrice));
  };

  const getInventory = async () => {
    setLoading(true);
    try {
      firestore()
        .collection('inventory')
        .where('owner', '==', user.uid)
        .onSnapshot(querySnapshot => {
          let result: Array<Object> = [];
          querySnapshot.forEach(documentSnapshot => {
            result.push({
              id: documentSnapshot.id,
              doc: documentSnapshot.data(),
            });
          });
          setData(result);
          reCalculate(result);
        });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getInventory();
    // onSnapshot()
  }, []);

  return (
    <>
      <FloatingButton
        action={setAddNewModalVisible}
        value={addNewModalVisible}
      />
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={colors.primary}
        />

        <ScrollView>
          {addNewModalVisible && (
            <AddNew
              setAddNewModalVisible={setAddNewModalVisible}
              addNewModalVisible={addNewModalVisible}
            />
          )}
          <TopBar
            title={'የእቃ ክፍል'}
            action={setSearchVisible}
            actionValue={searchVisible}>
            <View style={topCard.boardContainer}>
              <View style={topCard.boardCol}>
                <Text style={topCard.boardTopTitle}>{totalItems}</Text>
                <Text style={topCard.boardSubTitle}>ያሉ እቃዎች</Text>
              </View>
              <View style={[topCard.boardCol, {alignItems: 'flex-end'}]}>
                <Text style={topCard.boardTopTitle}>{sumPrice}</Text>
                <Text style={topCard.boardSubTitle}>አጠቃላይ ዋጋ</Text>
              </View>
            </View>
          </TopBar>

          {/* Search Input */}
          {searchVisible && (
            <View
              style={{
                width: '80%',
                alignSelf: 'flex-end',
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 10,
                marginVertical: 5,
                marginHorizontal: 10,
                backgroundColor: colors.white,
                paddingHorizontal: 10,
                borderWidth: 1,
              }}>
              <TextInput
                style={{
                  backgroundColor: colors.white,
                  flexGrow: 1,
                  height: 40,
                  fontSize: 20,
                  color: colors.black,
                }}
                selectionColor="black"
                placeholder="search..."
                onChangeText={val => {
                  setSearchKey(val);
                }}
                value={searchKey}
                keyboardType="default"
                placeholderTextColor={colors.faded_grey}
              />
              <Icon name="search1" size={20} color={colors.primary} />
            </View>
          )}
          <View style={styles.contentContainer}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: 5,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  color: colors.faded_dark,
                }}>
                ያሉ አቃዎች
              </Text>

              <TouchableOpacity
                style={[
                  styles.buttonwithIcon,
                  {marginLeft: 'auto', marginRight: 10},
                ]}
                onPress={() =>
                  navigation.navigate('AuthNavigator', {screen: 'Login'})
                }>
                <Image
                  source={require('./qr_icon.png')}
                  style={{width: 20, height: 20}}></Image>
                <Text
                  style={{
                    color: colors.black,
                  }}>
                  Print QR
                </Text>
              </TouchableOpacity>
              <View style={{marginRight: 10}}>
                {!searchVisible ? (
                  <Icon
                    name="search1"
                    color={colors.primary}
                    size={22}
                    onPress={() => setSearchVisible(!searchVisible)}
                  />
                ) : (
                  <Icon
                    name="close"
                    color={colors.primary}
                    size={22}
                    onPress={() => setSearchVisible(!searchVisible)}
                  />
                )}
              </View>
            </View>
            {loading ? (
              <Loading size={100} />
            ) : (
              <ScrollView>
                {data.length == 0 ? (
                  <EmptyBox message={'Inventory Empty'} />
                ) : data.length > 0 ? (
                  <View>
                    {data
                      .filter(dt =>
                        dt.doc.item_name
                          .toLowerCase()
                          .includes(searchKey.toLowerCase()),
                      )
                      .map(item => {
                        return (
                          <TouchableOpacity
                            activeOpacity={0.5}
                            key={item.id}
                            onPress={() => {
                              const id = item.id;
                              // console.log(item.doc);
                              navigation.navigate(routes.itemDetails, {
                                data: item.doc,
                                itemId: id,
                              });
                            }}>
                            <InvetoryListItem
                              title={item.doc.item_name}
                              unitPrice={item.doc.stock.unit_price}
                              quantity={item.doc.stock.quantity}
                            />
                          </TouchableOpacity>
                        );
                      })}
                  </View>
                ) : null}
              </ScrollView>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
  contentContainer: {
    paddingHorizontal: 10,
    flex: 1,
  },
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
    alignItems: 'center',
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
  Input: {
    color: colors.black,
    height: 50,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    fontSize: 20,
    marginBottom: 20,
  },
  boardTopTitle: {fontSize: 22, fontWeight: '900'},
  boardSubTitle: {color: colors.grey, fontWeight: 'bold', fontSize: 12},
});

const topCard = StyleSheet.create({
  statContainer: {
    marginTop: 10,
  },

  // Typetwo
  boardContainer: {
    marginVertical: 5,
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
  boardTopTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.black,
  },
  boardSubTitle: {color: colors.grey, fontWeight: 'bold', fontSize: 12},
});
