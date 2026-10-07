import 'firebase/auth';
import type { Persistence } from 'firebase/auth';
import type AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase exposes this API in its React Native runtime but omits it from
// the default public declarations. Metro selects the native implementation.
declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: Pick<typeof AsyncStorage, 'getItem' | 'setItem' | 'removeItem'>): Persistence;
}
