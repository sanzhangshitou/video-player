import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import { VideoItem } from '../types/video';
import { SUPPORTED_EXTENSIONS } from './permissions';

const SCAN_DIRECTORIES: Record<string, string[]> = {
  android: [
    `${RNFS.ExternalStorageDirectoryPath}/Movies`,
    `${RNFS.ExternalStorageDirectoryPath}/DCIM`,
    `${RNFS.ExternalStorageDirectoryPath}/Download`,
    `${RNFS.ExternalStorageDirectoryPath}/Pictures`,
    `${RNFS.ExternalStorageDirectoryPath}/Android/media`,
  ],
  ios: [RNFS.DocumentDirectoryPath],
};

async function scanDirectory(
  dirPath: string,
  depth: number = 0,
): Promise<VideoItem[]> {
  if (depth > 3) {
    return [];
  }

  try {
    const items = await RNFS.readDir(dirPath);
    const results: VideoItem[] = [];

    for (const item of items) {
      if (item.isDirectory()) {
        const subResults = await scanDirectory(item.path, depth + 1);
        results.push(...subResults);
      } else if (item.isFile()) {
        const dotIndex = item.name.lastIndexOf('.');
        if (dotIndex === -1) {
          continue;
        }
        const ext = item.name.substring(dotIndex).toLowerCase();
        if (SUPPORTED_EXTENSIONS.includes(ext)) {
          results.push({
            id: item.path,
            name: item.name,
            path: item.path,
            size: Number(item.size),
            duration: 0,
            mtime: item.mtime ? new Date(item.mtime) : new Date(),
            extension: ext,
          });
        }
      }
    }

    return results;
  } catch {
    return [];
  }
}

export async function scanForVideos(): Promise<VideoItem[]> {
  const dirs =
    Platform.OS === 'android' ? SCAN_DIRECTORIES.android : SCAN_DIRECTORIES.ios;

  const allResults: VideoItem[] = [];

  for (const dir of dirs) {
    const dirResults = await scanDirectory(dir);
    allResults.push(...dirResults);
  }

  const seen = new Set<string>();
  return allResults.filter(v => {
    if (seen.has(v.path)) {
      return false;
    }
    seen.add(v.path);
    return true;
  });
}
