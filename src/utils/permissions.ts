import { Platform, PermissionsAndroid } from 'react-native';
import type { TFunction } from 'i18next';
import { SUPPORTED_VIDEO_EXTENSIONS } from '../theme/constants';

export { SUPPORTED_VIDEO_EXTENSIONS };

export async function requestStoragePermission(
  t?: TFunction,
): Promise<boolean> {
  if (Platform.OS === 'ios') {
    return true;
  }

  try {
    const result = await PermissionsAndroid.request(
      'android.permission.READ_MEDIA_VIDEO',
      {
        title: t?.('permissions.videoTitle') ?? 'Video Access',
        message:
          t?.('permissions.videoMessage') ??
          'This app needs access to your videos to display and play them.',
        buttonPositive: t?.('permissions.allow') ?? 'Allow',
        buttonNegative: t?.('permissions.deny') ?? 'Deny',
      },
    );

    if (result === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    const legacyResult = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: t?.('permissions.storageTitle') ?? 'Storage Access',
        message:
          t?.('permissions.storageMessage') ??
          'This app needs storage access to find video files.',
        buttonPositive: t?.('permissions.allow') ?? 'Allow',
        buttonNegative: t?.('permissions.deny') ?? 'Deny',
      },
    );

    return legacyResult === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.warn('[Permissions] Failed to request storage permission:', error);
    return false;
  }
}
