import React, {useEffect, useState, useContext, useRef} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Pressable,
  StatusBar,
  Alert,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text} from '@rneui/themed';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/AntDesign';
import {StateContext} from '../../global/context';
import RNPrint from 'react-native-print';
import {useTranslation} from 'react-i18next';
import DatePicker from 'react-multi-date-picker';
import dayjs from 'dayjs';

const receipt = require('./SalesReportRecipt');

import TopScreen from '../../components/TopScreen/TopScreen';
import Loading from '../../components/lotties/Loading';
import EmptyBox from '../../components/lotties/EmptyBox';
import colors from '../../config/colors';
import routes from '../../navigation/routes';

import StatCard from '../../components/statCards/StatCard';
import StatCardFullWidth from '../../components/statCards/StatCardFullWidth';
import FloatingButton from '../../components/FloatingButton/FloatingButton';
import crashlytics from '@react-native-firebase/crashlytics';

import useFirebase from '../../utils/useFirebase';
import formatNumber from '../../utils/formatNumber';
import {DataContext} from '../../global/context/DataContext';
import {ExpiredModal, FreeLimitReached} from '../sales/LimitReached';
import {log} from 'react-native-reanimated';
import SalesListItem from '../sales/SalesListItem';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export default function SalesReports({navigation}) {
  const {user, userInfo} = useContext(StateContext);
  const {t, i18n} = useTranslation();
  const [refreshing, setRefreshing] = React.useState(false);

  const [data, setData]: Array<any> = useState([]);
  const [datas, setDatas]: Array<any> = useState([]);
  const {
    salesCount,
    setSalesCount,
    totalPriceValue,
    setTotalPriceValue,
    totalSumValue,
    setTotalSumValue,
    totalTaxValue,
    setTotalTaxValue,
  } = useContext(DataContext);
  const [stockCount, setStockCount]: any = useState();
  const [expandedDate, setExpandedDate] = useState(false);

  const [loading, setLoading] = useState(true);
  const [searchVisible, setSearchVisible] = useState(false);
  const [limitReachedVisible, setLimitReachedVisible] = useState(false);
  const [expired, setExpired] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [expandedList, setExpandedList] = useState(
    new Array(data.length).fill(false),
  );
  const [menuvisible, setMenuvisible] = useState(false);

  const [searchKey, setSearchKey] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterTaxVisible, setFilterTaxVisible] = useState(false);
  const [selectedDateIndex, setSelectedDateIndex] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const progress = useRef(new Animated.Value(0)).current;
  let totalSum = 0;
  const animate = val => {
    let to = !filterVisible || !filterTaxVisible ? 1 : 0;

    Animated.spring(progress, {
      toValue: to,
      useNativeDriver: true,
    }).start();
  };

  const dateConverter: any = d => {
    const dateMonth = new Date(d).getMonth();
    const thisMonth = new Date().getMonth();
    if (
      new Date().getDate() - new Date(d).getDate() == 0 &&
      dateMonth == thisMonth
    )
      return 'Today';
    if (
      new Date().getDate() - new Date(d).getDate() == 1 &&
      dateMonth == thisMonth
    )
      return 'Yesterday';
    // if (
    //   new Date(d).getDate() - new Date().getDate() < 7 &&
    //   dateMonth == thisMonth
    // )
    //   return 'This week';
    // if (
    //   new Date(d).getDate() - new Date().getDate() > 7 &&
    //   dateMonth == thisMonth
    // )
    //   return 'Last week';

    return new Date(d).toDateString();
  };

  const groupSalesByDate = data => {
    return Object.keys(data).reduce((groupedData, dateString) => {
      const date = new Date(dateString);
      const dayString = date.toISOString().slice(0, 10); // Get date in 'YYYY-MM-DD' format

      if (!groupedData[dayString]) {
        groupedData[dayString] = [];
      }

      groupedData[dayString].push(...data[dateString]);
      return groupedData;
    }, {});
  };

  const getSales = async () => {
    setLoading(true);
    firestore()
      .collection('sales')
      .where('owner', '==', userInfo[0]?.doc?.companyId)
      .onSnapshot(querySnapshot => {
        let result: any = [];
        if (querySnapshot)
          querySnapshot.docs.forEach(sn => {
            //console.log(querySnapshot.docs.length)
            const item = {
              id: sn.id,
              date: sn.data().date,
              customerName: sn.data().customerName,
              invoiceNumber: sn.data().invoiceNumber,
              items: sn.data().items,
              paymentMethod: sn.data().paymentMethod,
              saleProfit: sn.data().saleProfit,
              createdBy: sn.data().createdBy,
              taxType: sn.data().taxType,
              vat: sn.data().vat,
              tot: sn.data().tot,
              total: sn.data().totalPrice,
              sumPrice: sn.data().sumPrice,
              totalTax: sn.data().totalTax,

              shouldDiscard: sn.data().shouldDiscard,
            };
            result.push(item);
          });
        result.sort((a, b) => {
          const aDate = new Date(a.date);
          const bDate = new Date(b.date);
          if (isNaN(aDate.getTime()) || isNaN(bDate.getTime())) {
            return 0;
          }
          return bDate.getTime() - aDate.getTime();
        });
        console.log(userInfo[0]?.doc?.companyId);
        //console.log(result.length);
        setSalesCount(result.length);
        let grandTotal = 0;
        let totalSum = 0;
        let totalTax = 0;

        result.map(i => {
          //console.log(i.date);
          grandTotal = grandTotal + i.total;
          totalSum = totalSum + i.sumPrice;
          totalTax = totalTax + i.totalTax;
        });

        // console.log(result[0].date);
         console.log(totalTax);
        setTotalPriceValue(grandTotal);
        setTotalTaxValue(totalTax);
        setTotalSumValue(totalSum);

        if (result.length === 0) {
          return {startDate: null, endDate: null};
        }

        let startDateValue = result[0].date;
        let endDateValue = result[0].date;

        result.forEach(dates => {
          if (dates.date < startDateValue) {
            startDateValue = dates.date;
          }
          if (dates.date > endDateValue) {
            endDateValue = dates.date;
          }
        });
        console.log(startDateValue);
        console.log(endDateValue);
        setEndDate(endDateValue);
        setStartDate(startDateValue);

        // return { startDate, endDate };

        const grouped = result.reduce(function (r, a) {
          r[a.date] = r[a.date] || [];
          r[a.date].push(a);
          // console.log(a);
          return r;
        }, {});
        // const reversedGrouped = Object.keys(grouped).reverse().reduce(function (r, k) {
        //   r[k] = grouped[k]||[]
        //   return r;
        // }, {});

        setData(result);
        setLoading(false);
      });
  };

  const printTotal = async () => {
    const printData = {
      data,
      organization: userInfo[0]?.doc?.orgName,
      startDate: dayjs(startDate).format('MM/DD/YYYY hh:mm:ss A'),
      endDate: dayjs(endDate).format('MM/DD/YYYY hh:mm:ss A'),
      count: salesCount,
      sum: totalSumValue,
      tax: totalTaxValue,
      total: totalPriceValue,
    };
   
    await RNPrint.print({
      html: receipt(printData),
    });
  };

  const getStockCount = () => {
    return firestore()
      .collection('inventory')
      .where('owner', '==', userInfo[0]?.doc?.companyId)
      .onSnapshot(
        querySnapshot => {
          setStockCount(querySnapshot.size);
        },
        error => {
          console.error('Error fetching data: ', error);
        },
      );
  };
  const sendNotification = () => {
    const options = {
      sound: true,
      title: 'Low Stock Alert',
      body: 'Your stock has fallen below the required level.',
    };

    // messaging()
    //   .send(options)
    //   .then(response => {
    //     console.log('Notification sent successfully:', response);
    //   })
    //   .catch(err => {
    //     console.log('Notification failed:', err);
    //   });
  };

  useEffect(() => {
    if (mounted && userInfo) {
      getSales();
      getStockCount();
    }
    return () => {
      setMounted(false);
    };
  }, []);

  // Make the latest date of the sales to be expaned by default
  useEffect(() => {
    // Sort the data by date in descending order
    const sortedDates = Object.keys(data).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime(),
    );

    // Create a copy of the current expandedList state
    const newExpandedList = {...expandedList};

    // Set the latest date's key to true in the newExpandedList
    if (sortedDates.length > 0) {
      newExpandedList[sortedDates[0]] = true;
    }

    // Update the expandedList state
    setExpandedList(newExpandedList);
  }, [data]);

  return (
    <>
      {expired ? (
        <ExpiredModal setModalVisible={setExpired} navigation={navigation} />
      ) : null}

      {limitReachedVisible ? (
        <FreeLimitReached
          setModalVisible={setLimitReachedVisible}
          navigation={navigation}
        />
      ) : null}

      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={colors.primary}
        />

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getSales} />
          }>
          <TopScreen />

          <View style={styles.contentContainer}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={menuvisible}
              onRequestClose={() => {
                setMenuvisible(!menuvisible);
              }}>
              <View style={styles_modal.centeredView}>
                <View style={styles_modal.modalView}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        marginRight: 10,
                      }}
                      onPress={() => printTotal()}>
                      <Icon
                        name={'pdffile1'}
                        size={30}
                        color={colors.primary}
                      />
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: 15,
                          color: colors.black,
                        }}>
                        PDF
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={[
                      {
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 20,
                        borderWidth: 1,
                        borderRadius: 20,
                        borderColor: colors.red,
                      },
                    ]}
                    onPress={() => setMenuvisible(!menuvisible)}>
                    <Icon size={25} name="close" color={colors.red} />
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: 5,
                paddingVertical: 3,
                borderBottomWidth: 0.5,
                borderBottomColor: '#00000040',
                zIndex: 10,
              }}>
              {/* Filter button and filter Tag*/}
            </View>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <View style={styles.statContainer}>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                  <View style={styles.repContainer}>
                    <View style={styles.repcontainerContent}>
                      <TouchableOpacity
                        style={{
                          alignItems: 'center',
                          flexDirection: 'column',
                          marginRight: 10,
                        }}
                        onPress={() => setMenuvisible(!menuvisible)}>
                        <Text
                          style={{
                            marginLeft: 5,
                            fontSize: 15,
                            color: colors.white,
                          }}>
                          Aggeregate report
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {/* <View style={styles.repResultValue}>
                      <Text
                        style={{
                          fontWeight: '500',
                          fontSize: 15,
                          textAlign: 'center',
                          color: colors.green,
                        }}>
                        {formatNumber(salesCount)} {`${t('Items')}`}
                      </Text>
                    </View> */}
                  </View>
                </View>
              </View>
              <View style={styles.statContainer}>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                  <View style={styles.repContainer}>
                    <View style={styles.repcontainerContent}>
                      <TouchableOpacity
                        style={{
                          alignItems: 'center',
                          flexDirection: 'column',
                          marginRight: 10,
                        }}
                        onPress={() => setMenuvisible(!menuvisible)}>
                        <Text
                          style={{
                            marginLeft: 5,
                            fontSize: 15,
                            color: colors.white,
                          }}>
                          {'Single report'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={styles.statContainer}>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                  <View style={styles.repContainer}>
                    <View style={styles.repcontainerContent}>
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          //backgroundColor: colors.green,
                          borderRadius: 5,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}></View>
                      <Text style={styles.repTitle}>{'Receipt report '}</Text>
                    </View>
                    {/* <View style={styles.repResultValue}>
                      <Text
                        style={{
                          fontWeight: '500',
                          fontSize: 15,
                          textAlign: 'center',
                          color: colors.green,
                        }}>
                        {formatNumber(totalSumValue)} {`${t('Birr')}`}
                      </Text>
                    </View> */}
                  </View>
                </View>
              </View>
            </View>
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
    backgroundColor: colors.white,
  },
  repcontainerContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  repContainer: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 8,
    marginHorizontal: 80,
    flexGrow: 1,
    height: 50,
    width: 160,
  },
  repResultValue: {
    height: '100%',
    flex: 2,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingLeft: 5,
    minWidth: 80,
  },
  repTitle: {
    color: colors.white,
    marginLeft: 5,
    fontSize: 15,
    fontWeight: '500',
  },
  statContainer: {
    marginTop: 10,
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
    fontSize: 15,
    marginBottom: 20,
  },
  boardTopTitle: {fontSize: 20, fontWeight: '900'},
  boardSubTitle: {color: colors.grey, fontWeight: 'bold', fontSize: 12},
});
const styles_modal = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    width: '60%',
    alignSelf: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    // elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    marginTop: 20,
    // backgroundColor: colors.primary,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
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
    fontSize: 20,
    fontWeight: '900',
    color: colors.black,
  },
  boardSubTitle: {color: colors.grey, fontWeight: 'bold', fontSize: 12},
});
