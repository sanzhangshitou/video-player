import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        t('empty.settingsAlertTitle'),
        t('empty.settingsAlertMessage'),
      );
    }
  }, [t]);

  if (loading) {
    const shimmerOpacity = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    });

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.shimmerIconContainer, { opacity: shimmerOpacity }]}>
          <View style={styles.shimmerIcon} />
        </Animated.View>
        <Animated.View style={[styles.shimmerBar, { opacity: shimmerOpacity }]} />
        <Animated.View
          style={[styles.shimmerBar, styles.shimmerShort, { opacity: shimmerOpacity }]}
        />
      </View>
    );
  }

  if (!permissionGranted) {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji} accessibilityLabel={t('empty.permissionTitle')}>
          🔐
        </Text>
        <Text style={styles.title}>{t('empty.permissionTitle')}</Text>
        <Text style={styles.subtitle}>{t('empty.permissionSubtitle')}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleOpenSettings}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{t('empty.openSettings')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji} accessibilityLabel={t('empty.noVideosTitle')}>
        🎬
      </Text>
      <Text style={styles.title}>{t('empty.noVideosTitle')}</Text>
      <Text style={styles.subtitle}>{t('empty.noVideosSubtitle')}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={onRefresh}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>{t('empty.scanAgain')}</Text>
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
