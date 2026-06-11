import { Platform, PermissionsAndroid } from 'react-native';
import { SUPPORTED_VIDEO_EXTENSIONS } from '../theme/constants';

export { SUPPORTED_VIDEO_EXTENSIONS };

export async function requestStoragePermission(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    return true;
  }

  try {
    const result = await PermissionsAndroid.request(
      'android.permission.READ_MEDIA_VIDEO',
      {
        title: 'Video Access',
        message:
          'This app needs access to your videos to display and play them.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );

    if (result === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    const legacyResult = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Storage Access',
        message: 'This app needs storage access to find video files.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );

    return legacyResult === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.warn('[Permissions] Failed to request storage permission:', error);
    return false;
  }
}
