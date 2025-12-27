import { Platform, ToastAndroid, Alert } from 'react-native';

export default function showToast(message: string) {
  try {
    if (Platform.OS === 'android' && ToastAndroid && typeof ToastAndroid.show === 'function') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
      return;
    }
  } catch (e) {
    // fallback to Alert
  }
  Alert.alert('', message);
}
