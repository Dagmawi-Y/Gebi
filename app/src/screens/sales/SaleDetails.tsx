import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import colors from '../../config/colors';
import Icon from 'react-native-vector-icons/AntDesign';
import {ScrollView} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import Loading from '../../components/lotties/Loading';
import StatusBox from '../../components/misc/StatusBox';

import RNPrint from 'react-native-print';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

import receipt from './reciept';

const SaleDetails = ({route, navigation}) => {
  const {data} = route.params;

  const [sum, setSum] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [menuvisible, setMenuvisible] = useState(false);

  const imageRef = useRef(null);

  const calculate = () => {
    let sum: number = 0;
    let total: number = 0;
    Object.keys(data.items).map(i => {
      sum = sum + data.items[i].quantity * data.items[i].unitPrice;
    });
    total = sum * 0.15 + sum;
    setSum(sum);
    setTotal(total);
  };

  const capture = () => {
    imageRef.current!.capture().then(uri => {
      Share.open({url: uri});
    });
  };

  const rollBackSale = async () => {
    setLoading(true);
    let proceed = false;
    try {
      const items = data.items;
      for (var i in items) {
        await firestore()
          .collection('inventory')
          .doc(items[i].id)
          .get()
          .then(async res => {
            if (!res.data()) {
              setLoading(false);
              setError('Item does not exist in stock!');
              Alert.alert(`Item does not exist in stock!`, ``, [
                {
                  text: 'ተመለስ',
                  onPress: () => {},
                  style: 'default',
                },
              ]);
              return;
            }
            proceed = true;
            await firestore()
              .collection('inventory')
              .doc(items[i].id)
              .update({
                currentCount:
                  parseFloat(res.data()!.currentCount) +
                  parseFloat(items[i].quantity),
              })
              .catch(err => {
                console.log(err);
              });
            setLoading(false);
          });
      }
      proceed && firestore().collection('sales').doc(data.id).delete();
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  const print = async () => {
    const printData = {
      data: data,
      sum: sum,
      tax: sum * 0.15,
      total: total,
    };

    await RNPrint.print({
      html: receipt(printData),
    });
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      calculate();
    }
    return () => {
      mounted = false;
    };
  }, [data]);

  return (
    <>
      {loading && (
        <StatusBox
          msg={'Please wait...'}
          type="loading"
          overlay={true}
          onPress={() => {}}
        />
      )}
      <View style={{backgroundColor: colors.white, width: '100%'}}>
        <TouchableOpacity
          style={{
            justifyContent: 'flex-end',
            marginLeft: 'auto',
          }}
          onPress={() => setMenuvisible(!menuvisible)}>
          <Icon
            name={!menuvisible ? 'sharealt' : 'close'}
            size={25}
            color={colors.primary}
            style={{margin: 5, marginLeft: 'auto'}}
          />
        </TouchableOpacity>
      </View>
      {menuvisible ? (
        <View
          style={{
            backgroundColor: 'white',
            elevation: 10,
            position: 'absolute',
            right: 30,
            zIndex: 10,
            top: 30,
            width: 100,
            justifyContent: 'space-around',
            paddingHorizontal: 10,
            height: 100,
            borderRadius: 15,
            borderTopRightRadius: 0,
            alignItems: 'flex-start',
            borderWidth: 0.6,
            borderColor: '#00000040',
          }}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}
            onPress={() => print()}>
            <Icon name={'pdffile1'} size={30} color={colors.primary} />
            <Text style={{marginLeft: 5, fontSize: 20, color: colors.black}}>
              PDF
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}
            onPress={() => capture()}>
            <Icon name={'picture'} size={30} color={colors.primary} />
            <Text style={{marginLeft: 5, fontSize: 20, color: colors.black}}>
              Photo
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <ViewShot
        ref={imageRef}
        options={{format: 'jpg', quality: 0.9}}
        style={{backgroundColor: 'white'}}>
        <ScrollView
          contentContainerStyle={{
            justifyContent: 'center',
          }}>
          <View style={styles.header}>
            <Text style={styles.pageTitle}>የሽያጭ ደረሰኝ</Text>
          </View>
          <View style={styles.topInfo}>
            <View style={styles.topInfoLeft}>
              <Text style={styles.textBold}>{data.date}</Text>
              <Text style={styles.textLight}>ቀን</Text>
            </View>
            <View style={styles.topInfoRight}>
              <Text style={styles.textLight}>የደረሰኝ ቁጥር</Text>
              <Text style={styles.textBold}>23/20/014</Text>
            </View>
          </View>
          <View style={{marginTop: 20}}>
            <Text style={styles.textBold}>ደንበኛ</Text>
            <Text style={styles.textValue}>{data.customerName}</Text>
          </View>
          <View style={styles.ListItemContainer}>
            <Text
              style={[
                styles.textBold,
                {marginVertical: 10, paddingHorizontal: 15},
              ]}>
              የእቃዎች ዝርዝር
            </Text>

            <ScrollView
              style={{maxHeight: 300, width: '100%'}}
              contentContainerStyle={{paddingHorizontal: 5}}>
              {Object.keys(data.items).map(i => {
                return (
                  <View key={Math.random()} style={styles.ListItem}>
                    <View style={styles.LeftContainer}>
                      <View style={{marginLeft: 10}}>
                        <Text style={styles.textBold}>
                          {data.items[i].itemName}
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.textBold}>
                            {data.items[i].quantity}
                            <Text style={styles.textLight}> - ብዛት</Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.RightContainer}>
                      <Text style={styles.textLight}>
                        <Text style={styles.textBold}>
                          {data.items[i].unitPrice}ብር
                        </Text>
                        /አንዱን
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.summaryContainer}>
            <View style={styles.summaryTop}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.textLight}>ድምር</Text>
                <Text
                  style={[styles.textBold, {textAlign: 'right', fontSize: 20}]}>
                  {sum} ብር
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Text style={styles.textLight}>ታክስ (15% ቫት)</Text>
                <Text
                  style={[styles.textBold, {textAlign: 'right', fontSize: 20}]}>
                  {sum * 0.15} ብር
                </Text>
              </View>
            </View>
            <View style={styles.summaryBottom}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={[styles.textBold, {fontSize: 20, fontWeight: '600'}]}>
                  አጠቃላይ ድምር
                </Text>
                <Text
                  style={[
                    styles.textBold,
                    {
                      textAlign: 'right',
                      fontSize: 25,
                      textDecorationStyle: 'solid',
                      textDecorationLine: 'underline',
                    },
                  ]}>
                  {total} ብር
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.paymentTypeContainer}>
            <View style={styles.paymentTop}>
              <Text
                style={[
                  styles.textBold,
                  {marginBottom: 5, paddingHorizontal: 15},
                ]}>
                የክፍያ አይነት
              </Text>
              <Text
                style={[
                  styles.textBold,
                  {
                    marginBottom: 5,
                    paddingHorizontal: 15,
                    color: colors.yellow,
                  },
                ]}>
                {data.paymentMethod}
              </Text>
            </View>
          </View>
        </ScrollView>
      </ViewShot>

      <View
        style={{
          paddingHorizontal: 10,
          marginTop: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(`እርግጠኛ ነዎት?`, ``, [
              {
                text: 'አዎ',
                onPress: () => {
                  rollBackSale();
                },
                style: 'default',
              },
              {
                text: 'ተመለስ',
                onPress: () => {},
                style: 'default',
              },
            ]);
          }}
          style={{
            backgroundColor: colors.red,
            height: 60,
            marginBottom: 5,
            paddingHorizontal: 20,
            justifyContent: 'space-between',
            width: 'auto',
            alignItems: 'center',
            borderRadius: 30,
            flexDirection: 'row',
          }}>
          <Text
            style={[
              styles.textBold,
              {color: colors.white, textAlign: 'center'},
            ]}>
            ተመላሽ አድርግ
          </Text>
          <Image
            resizeMethod="auto"
            source={require('../../assets/icons/arrow-right.png')}
            style={{width: 20, height: 20}}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SaleDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingVertical: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  pageTitle: {
    fontSize: 28,
    color: colors.black,
    fontWeight: 'bold',
    marginLeft: 10,
    textAlign: 'center',
    width: '100%',
  },
  topInfo: {
    borderBottomWidth: 1,
    marginTop: 10,
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topInfoLeft: {
    padding: 0,
  },
  topInfoRight: {
    alignItems: 'flex-end',
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

  textValue: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 20,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    paddingVertical: 15,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
  ListItemContainer: {
    justifyContent: 'center',
  },
  ListItem: {
    zIndex: 1,
    marginBottom: 5,
    elevation: 5,
    backgroundColor: colors.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
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
    marginLeft: 'auto',
  },
  summaryContainer: {
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 20,
    elevation: 1,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  summaryTop: {
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingTop: 15,
  },
  summaryBottom: {
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  paymentTypeContainer: {
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 1,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  paymentTop: {
    justifyContent: 'space-between',
    padding: 8,
    flexDirection: 'row',
  },
});
