import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Video from 'react-native-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { Colors } from '../theme/colors';
import PlayerControls from '../components/PlayerControls';
import { useVideoPlayback } from '../hooks/useVideoPlayback';
import { encodeFilePath } from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'Player'>;

export default function PlayerScreen({ route, navigation }: Props) {
  const { video } = route.params;
  const insets = useSafeAreaInsets();

  const {
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
    progressUpdateInterval,
  } = useVideoPlayback();

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleRetry = useCallback(() => {
    retry();
  }, [retry]);

  if (hasError) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorIcon} accessibilityLabel="Error">
          ⚠
        </Text>
        <Text style={styles.errorTitle}>Playback Error</Text>
        <Text style={styles.errorMessage}>
          Unable to play "{video.name}".{'\n'}The file may be corrupted or in an
          unsupported format.
        </Text>
        <View style={styles.errorActions}>
          <Pressable onPress={handleRetry} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
          <Pressable onPress={handleBack}>
            <Text style={styles.backLink}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const videoUri = encodeFilePath(video.path);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: videoUri }}
        style={styles.video}
        paused={!isPlaying}
        resizeMode="contain"
        controls={false}
        onLoad={handleLoad}
        onProgress={handleProgress}
        onEnd={handleEnd}
        onError={handleError}
        progressUpdateInterval={progressUpdateInterval}
      />

      <View
        style={[
          styles.controlsContainer,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
        pointerEvents="box-none"
      >
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
  controlsContainer: {
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
  errorActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  retryButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  backLink: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.accent,
  },
});
