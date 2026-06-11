import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Video, {
  OnLoadData,
  OnProgressData,
  VideoRef,
} from 'react-native-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { Colors } from '../theme/colors';
import PlayerControls from '../components/PlayerControls';

type Props = NativeStackScreenProps<RootStackParamList, 'Player'>;

export default function PlayerScreen({ route, navigation }: Props) {
  const { video } = route.params;
  const insets = useSafeAreaInsets();
  const videoRef = useRef<VideoRef>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [hasError, setHasError] = useState(false);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-hide controls after 3 seconds
  const resetControlsTimer = useCallback(() => {
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
    controlsTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
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

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  if (hasError) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorIcon}>⚠</Text>
        <Text style={styles.errorTitle}>Playback Error</Text>
        <Text style={styles.errorMessage}>
          Unable to play "{video.name}".{'\n'}The file may be corrupted or in an
          unsupported format.
        </Text>
        <Text style={styles.backLink} onPress={handleBack}>
          Go Back
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: `file://${video.path}` }}
        style={[
          styles.video,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
        paused={!isPlaying}
        resizeMode="contain"
        controls={false}
        onLoad={handleLoad}
        onProgress={handleProgress}
        onEnd={handleEnd}
        onError={handleError}
        progressUpdateInterval={250}
      />

      <PlayerControls
        title={video.name}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onPlayPause={handlePlayPause}
        onSeek={handleSeek}
        onBack={handleBack}
        visible={controlsVisible}
        onToggleVisible={toggleControls}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  video: {
    ...StyleSheet.absoluteFill,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  backLink: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.accent,
  },
});
