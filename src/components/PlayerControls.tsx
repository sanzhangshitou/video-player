import { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import SeekBar from './SeekBar';

interface PlayerControlsProps {
  title: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onBack: () => void;
  visible: boolean;
  onToggleVisible: () => void;
}

export default function PlayerControls({
  title,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onSeek,
  onBack,
  visible,
  onToggleVisible,
}: PlayerControlsProps) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(1)).current;
  const centerOpacity = useRef(new Animated.Value(0)).current;
  const centerVisibleRef = useRef(false);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity]);

  function showCenterButton() {
    if (!centerVisibleRef.current) {
      centerVisibleRef.current = true;
      Animated.timing(centerOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        centerVisibleRef.current = false;
        Animated.timing(centerOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 1200);
    }
  }

  function handlePlayPause() {
    showCenterButton();
    onPlayPause();
  }

  return (
    <TouchableWithoutFeedback onPress={onToggleVisible}>
      <View style={styles.container}>
        {/* Top gradient bar */}
        <Animated.View
          style={[styles.topBar, { opacity, paddingTop: insets.top + 8 }]}
        >
          <Pressable onPress={onBack} style={styles.backButton} hitSlop={12}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.backButton} />
        </Animated.View>

        {/* Center play/pause button */}
        <Animated.View
          style={[styles.centerButton, { opacity: centerOpacity }]}
          pointerEvents="none"
        >
          <View style={styles.largeButton}>
            {isPlaying ? (
              <View style={styles.pauseBars}>
                <View style={styles.pauseBar} />
                <View style={styles.pauseBar} />
              </View>
            ) : (
              <View style={styles.playTriangleLarge} />
            )}
          </View>
        </Animated.View>

        {/* Bottom controls */}
        <Animated.View
          style={[
            styles.bottomBar,
            { opacity, paddingBottom: insets.bottom + 8 },
          ]}
        >
          <SeekBar
            currentTime={currentTime}
            duration={duration}
            onSeek={onSeek}
          />
          <View style={styles.controlRow}>
            <Pressable
              onPress={() => onSeek(Math.max(0, currentTime - 10))}
              style={styles.skipButton}
              hitSlop={12}
            >
              <Text style={styles.skipText}>-10s</Text>
            </Pressable>
            <Pressable onPress={handlePlayPause} style={styles.playButton}>
              {isPlaying ? (
                <View style={styles.pauseIcon}>
                  <View style={styles.pauseBarSmall} />
                  <View style={styles.pauseBarSmall} />
                </View>
              ) : (
                <View style={styles.playIconSmall}>
                  <View style={styles.playTriangleSmall} />
                </View>
              )}
            </Pressable>
            <Pressable
              onPress={() => onSeek(Math.min(duration, currentTime + 10))}
              style={styles.skipButton}
              hitSlop={12}
            >
              <Text style={styles.skipText}>+10s</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
  },
  topBar: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 32,
    color: Colors.textPrimary,
    fontWeight: '300',
    lineHeight: 36,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  centerButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -32,
    marginTop: -32,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.controlBackground,
    borderWidth: 1,
    borderColor: Colors.controlBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playTriangleLarge: {
    width: 0,
    height: 0,
    marginLeft: 4,
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderLeftWidth: 20,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: Colors.textPrimary,
  },
  pauseBars: {
    flexDirection: 'row',
    gap: 6,
  },
  pauseBar: {
    width: 6,
    height: 22,
    borderRadius: 2,
    backgroundColor: Colors.textPrimary,
  },
  bottomBar: {
    paddingHorizontal: 12,
    paddingTop: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderTopWidth: 1,
    borderTopColor: Colors.controlBorder,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 32,
  },
  pauseIcon: {
    flexDirection: 'row',
    gap: 4,
  },
  pauseBarSmall: {
    width: 4,
    height: 16,
    borderRadius: 1.5,
    backgroundColor: '#FFFFFF',
  },
  playIconSmall: {
    marginLeft: 3,
  },
  playTriangleSmall: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#FFFFFF',
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: Colors.controlBackground,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
});
