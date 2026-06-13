import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { VideoItem } from '../types/video';
import { requestStoragePermission } from '../utils/permissions';
import { scanForVideos } from '../utils/videoScanner';
import { useAppState } from './useAppState';

export function useLocalVideos() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const refreshGuard = useRef(false);
  const { t } = useTranslation();
  const tRef = useRef<TFunction>(t);
  tRef.current = t;

  const refresh = useCallback(async () => {
    if (refreshGuard.current) {
      return;
    }
    refreshGuard.current = true;
    setLoading(true);
    try {
      const granted = await requestStoragePermission(tRef.current);
      setPermissionGranted(granted);
      if (granted) {
        const found = await scanForVideos();
        setVideos(found);
      } else {
        setVideos([]);
      }
    } finally {
      setLoading(false);
      refreshGuard.current = false;
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useAppState(refresh);

  return { videos, loading, permissionGranted, refresh };
}
