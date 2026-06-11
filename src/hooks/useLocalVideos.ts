import { useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import { VideoItem } from '../types/video';
import { requestStoragePermission } from '../utils/permissions';
import { scanForVideos } from '../utils/videoScanner';

export function useLocalVideos() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const granted = await requestStoragePermission();
    setPermissionGranted(granted);
    if (granted) {
      const found = await scanForVideos();
      setVideos(found);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        refresh();
      }
    });
    return () => subscription.remove();
  }, [refresh]);

  return { videos, loading, permissionGranted, refresh };
}
