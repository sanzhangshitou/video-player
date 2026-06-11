import { useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { VideoItem } from '../types/video';
import { RootStackParamList } from '../types/navigation';
import { useLocalVideos } from '../hooks/useLocalVideos';
import VideoCard from '../components/VideoCard';
import EmptyState from '../components/EmptyState';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { videos, loading, permissionGranted, refresh } = useLocalVideos();

  const handleVideoPress = useCallback(
    (video: VideoItem) => {
      navigation.navigate('Player', { video });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: VideoItem }) => (
      <VideoCard video={item} onPress={handleVideoPress} />
    ),
    [handleVideoPress],
  );

  const keyExtractor = useCallback((item: VideoItem) => item.id, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Videos</Text>
          {!loading && (
            <Text style={styles.headerSubtitle}>
              {videos.length} {videos.length === 1 ? 'video' : 'videos'}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={refresh}
          style={styles.refreshButton}
          activeOpacity={0.7}
        >
          <Text style={styles.refreshIcon}>⟳</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.listContent,
          videos.length === 0 && styles.listContentEmpty,
          { paddingBottom: insets.bottom + 16 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={refresh}
        ListEmptyComponent={
          <EmptyState
            permissionGranted={permissionGranted}
            loading={loading}
            onRefresh={refresh}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 14,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  refreshIcon: {
    fontSize: 20,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingTop: 8,
  },
  listContentEmpty: {
    flex: 1,
  },
});
