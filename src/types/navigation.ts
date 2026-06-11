import type { VideoItem } from './video';

export type RootStackParamList = {
  Home: undefined;
  Player: { video: VideoItem };
};
