import { Pressable, StyleSheet, Text, View } from 'react-native';
import { VideoItem } from '../types/video';
import { Colors } from '../theme/colors';
import { formatDuration, formatFileSize, formatDate } from '../utils/format';

interface VideoCardProps {
  video: VideoItem;
  onPress: (video: VideoItem) => void;
}

export default function VideoCard({ video, onPress }: VideoCardProps) {
  return (
    <Pressable
      onPress={() => onPress(video)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.thumbnail}>
        <View style={styles.playIcon}>
          <View style={styles.playTriangle} />
        </View>
        {video.duration > 0 && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>
              {formatDuration(video.duration)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {video.name}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>{formatFileSize(video.size)}</Text>
          <View style={styles.dot} />
          <Text style={styles.metaText}>{formatDate(video.mtime)}</Text>
        </View>
      </View>

      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 5,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
  },
  thumbnail: {
    width: 80,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  playIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accentMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playTriangle: {
    width: 0,
    height: 0,
    marginLeft: 3,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: Colors.accent,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  durationText: {
    color: Colors.textPrimary,
    fontSize: 10,
    fontWeight: '500',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textTertiary,
    marginHorizontal: 6,
  },
  chevron: {
    fontSize: 22,
    color: Colors.textTertiary,
    fontWeight: '300',
  },
});
