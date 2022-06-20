import React, {useState, useEffect} from 'react';
import {Text, View, ActivityIndicator, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '../../components/misc/Button';

import auth from '@react-native-firebase/auth';
import colors from '../../config/colors';

const LoginScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  const AnonymousLogin = async () => {
    try {
      setLoading(true);
      await auth().signInAnonymously();
      setLoading(false);
    } catch (e) {
      alert(e);
    }
  };

  return (
    <SafeAreaView
      style={{
        alignContent: 'center',
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'center',
      }}>
      {loading ? (
        <ActivityIndicator animating={true} />
      ) : user ? (
        <></>
      ) : (
        <>
          <View
            style={{
              marginHorizontal: 'auto',
              width: '100%',
              marginBottom: 50,
              maxHeight: 100,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}>
            <Image
              style={{resizeMode: 'center'}}
              source={require('../../assets/logo-blue.png')}
            />
          </View>
          <Text
            style={{
              fontSize: 25,
              color: colors.black,
              textAlign: 'center',
              paddingVertical: 30,
            }}>
            You are not Logged in.
          </Text>
          <View
            style={{
              height: 160,
              justifyContent: 'space-evenly',
            }}>
            <Button
              title={'Login with phone number'}
              btnStyle={'normal'}
              onPress={() => navigation.navigate('Register')}
            />
            <Button
              title={'Continue Anyway'}
              btnStyle={'outlined'}
              onPress={AnonymousLogin}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default LoginScreen;
