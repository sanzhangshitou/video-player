import {
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
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <View style={[styles.shimmerBar, styles.shimmerIcon]} />
        </View>
        <View style={styles.shimmerBar} />
        <View style={[styles.shimmerBar, styles.shimmerShort]} />
      </View>
    );
  }

  if (!permissionGranted) {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>🔐</Text>
        <Text style={styles.title}>Storage Permission Needed</Text>
        <Text style={styles.subtitle}>
          Grant access to browse and play videos stored on your device.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎬</Text>
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
  iconContainer: {
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
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
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
  shimmerIcon: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
});
