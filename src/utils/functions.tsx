import AsyncStorage from '@react-native-async-storage/async-storage';
import {JSHash, JSHmac, CONSTANTS} from 'react-native-hash';

export const hashPin = async (pin: string) => {
  try {
    const hash = await JSHash(pin, CONSTANTS.HashAlgorithms.sha256);
    storeHash(hash);
  } catch (error) {
    console.log(error);
  }
};

export const storeHash = async (hash: string) => {
  try {
    await AsyncStorage.setItem('hash', hash);
  } catch (error) {
    console.log(error);
  }
};

export const compareHash = async (pin: string) => {
  try {
    let prevHash = await AsyncStorage.getItem('hash');

    if (!prevHash) return null;
    const hash = await JSHash(pin, CONSTANTS.HashAlgorithms.sha256);

    if (prevHash !== hash) return false;
    return true;
  } catch (error) {
    console.log(error);
  }
};
