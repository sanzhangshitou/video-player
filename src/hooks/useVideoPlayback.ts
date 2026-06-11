import { useCallback, useEffect, useRef, useState } from 'react';
import { VideoRef, OnLoadData, OnProgressData } from 'react-native-video';
import {
  CONTROLS_AUTO_HIDE_MS,
  PROGRESS_UPDATE_INTERVAL,
} from '../theme/constants';

export function useVideoPlayback() {
  const videoRef = useRef<VideoRef>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [hasError, setHasError] = useState(false);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetControlsTimer = useCallback(() => {
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
    controlsTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, CONTROLS_AUTO_HIDE_MS);
  }, []);

  useEffect(() => {
    if (controlsVisible) {
      resetControlsTimer();
    }
    return () => {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    };
  }, [controlsVisible, resetControlsTimer]);

  const toggleControls = useCallback(() => {
    setControlsVisible(prev => !prev);
  }, []);

  const handleLoad = useCallback((data: OnLoadData) => {
    setDuration(data.duration);
    setHasError(false);
  }, []);

  const handleProgress = useCallback((data: OnProgressData) => {
    setCurrentTime(data.currentTime);
  }, []);

  const handleEnd = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsPlaying(false);
  }, []);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleSeek = useCallback(
    (time: number) => {
      setCurrentTime(time);
      videoRef.current?.seek(time);
      resetControlsTimer();
    },
    [resetControlsTimer],
  );

  const retry = useCallback(() => {
    setHasError(false);
    setIsPlaying(true);
  }, []);

  return {
    videoRef,
    isPlaying,
    currentTime,
    duration,
    controlsVisible,
    hasError,
    toggleControls,
    handleLoad,
    handleProgress,
    handleEnd,
    handleError,
    handlePlayPause,
    handleSeek,
    retry,
    progressUpdateInterval: PROGRESS_UPDATE_INTERVAL,
  };
}
