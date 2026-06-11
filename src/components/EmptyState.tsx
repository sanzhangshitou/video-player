import { useCallback, useEffect, useRef } from 'react';
import {
  Alert,
  Animated,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../theme/colors';

interface EmptyStateProps {
  permissionGranted: boolean;
  loading: boolean;
  onRefresh: () => void;
}

export default function EmptyState({
  permissionGranted,
  loading,
  onRefresh,
}: EmptyStateProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!loading) {
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [loading, shimmerAnim]);

  const handleOpenSettings = useCallback(async () => {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('app-settings:');
      } else {
        await Linking.openSettings();
      }
    } catch {
      Alert.alert(
        'Error',
        'Unable to open settings. Please grant storage permissions manually.',
      );
    }
  }, []);

  if (loading) {
    const shimmerOpacity = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    });

    return (
      <View style={styles.container}>
        <Animated.View
          style={[styles.shimmerIconContainer, { opacity: shimmerOpacity }]}
        >
          <View style={styles.shimmerIcon} />
        </Animated.View>
        <Animated.View
          style={[styles.shimmerBar, { opacity: shimmerOpacity }]}
        />
        <Animated.View
          style={[
            styles.shimmerBar,
            styles.shimmerShort,
            { opacity: shimmerOpacity },
          ]}
        />
      </View>
    );
  }

  if (!permissionGranted) {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji} accessibilityLabel="Permission required">
          🔐
        </Text>
        <Text style={styles.title}>Storage Permission Needed</Text>
        <Text style={styles.subtitle}>
          Grant access to browse and play videos stored on your device.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleOpenSettings}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji} accessibilityLabel="No videos found">
        🎬
      </Text>
      <Text style={styles.title}>No Videos Found</Text>
      <Text style={styles.subtitle}>
        No video files found on this device. Add some videos and try again.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={onRefresh}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Scan Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  button: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 24,
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  shimmerIconContainer: {
    marginBottom: 20,
  },
  shimmerIcon: {
    width: 80,
    height: 80,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
  },
  shimmerBar: {
    height: 14,
    width: 200,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 7,
    marginTop: 8,
  },
  shimmerShort: {
    width: 140,
  },
});
