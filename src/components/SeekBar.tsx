import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '../theme/colors';
import { formatDuration } from '../utils/format';

interface SeekBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const THUMB_SIZE = 12;

export default function SeekBar({
  currentTime,
  duration,
  onSeek,
}: SeekBarProps) {
  const trackWidth = useRef(0);
  const { t } = useTranslation();

  const progress = duration > 0 ? currentTime / duration : 0;

  const getTimeFromX = useCallback(
    (x: number) => {
      if (trackWidth.current <= 0) {
        return 0;
      }
      const fraction = Math.max(0, Math.min(1, x / trackWidth.current));
      return fraction * duration;
    },
    [duration],
  );

  const getTimeFromXRef = useRef(getTimeFromX);
  getTimeFromXRef.current = getTimeFromX;

  const onSeekRef = useRef(onSeek);
  onSeekRef.current = onSeek;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        const time = getTimeFromXRef.current(evt.nativeEvent.locationX);
        onSeekRef.current(time);
      },
      onPanResponderMove: evt => {
        const time = getTimeFromXRef.current(evt.nativeEvent.locationX);
        onSeekRef.current(time);
      },
    }),
  ).current;

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    trackWidth.current = e.nativeEvent.layout.width;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formatDuration(currentTime, t)}</Text>

      <View
        style={styles.track}
        onLayout={handleLayout}
        {...panResponder.panHandlers}
      >
        <View style={styles.trackBg} />
        <View
          style={[
            styles.progress,
            { width: `${Math.min(100, progress * 100)}%` },
          ]}
        />
        <View
          style={[
            styles.thumb,
            {
              left: `${Math.min(100, progress * 100)}%`,
            },
          ]}
        />
      </View>

      <Text style={styles.time}>{formatDuration(duration, t)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  time: {
    fontSize: 12,
    fontVariant: ['tabular-nums'],
    color: Colors.textSecondary,
    minWidth: 40,
    textAlign: 'center',
  },
  track: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  trackBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  progress: {
    position: 'absolute',
    left: 0,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.accent,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    marginLeft: -(THUMB_SIZE / 2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
});
