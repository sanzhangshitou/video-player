# AwesomePlayer

A modern local video player built with React Native. Browse and play videos stored on your device with a clean, minimalist interface.

## Features

- **Local Video Browser** — automatically scans your device for video files (.mp4, .mov, .mkv, .avi, .webm, .3gp, .m4v, .wmv)
- **Full-Screen Player** — immersive playback with edge-to-edge rendering
- **Custom Controls** — glassmorphism overlay with auto-hide, seek bar with drag support, and skip buttons
- **Dark Theme** — OLED-optimized pure black background for cinematic viewing
- **Smart Controls** — tap to reveal controls, auto-hide after 3 seconds
- **Pull to Refresh** — re-scan for new videos with a pull gesture
- **Android & iOS** — native stack navigation and platform-specific permissions

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native 0.86 (New Architecture + Hermes) |
| Language | TypeScript 5.8 |
| Navigation | React Navigation 7 (Native Stack) |
| Video | react-native-video 6 |
| File Access | react-native-fs |
| Safe Areas | react-native-safe-area-context |
| Linting | ESLint (`@react-native/eslint-config`) |
| Formatting | Prettier |
| Testing | Jest |

## Project Structure

```
src/
├── types/
│   ├── video.ts              # VideoItem data type
│   └── navigation.ts         # Navigation param types
├── theme/
│   └── colors.ts             # Dark theme color palette
├── utils/
│   ├── format.ts             # Duration, file size, date formatters
│   ├── permissions.ts        # Android storage permission handler
│   └── videoScanner.ts       # Local filesystem video scanner
├── hooks/
│   └── useLocalVideos.ts     # Scan + permission + lifecycle hook
├── components/
│   ├── EmptyState.tsx         # Loading / no-permission / no-videos states
│   ├── VideoCard.tsx          # Video list item with thumbnail & metadata
│   ├── SeekBar.tsx            # Draggable progress bar
│   └── PlayerControls.tsx     # Playback overlay (play/pause, seek, skip)
├── screens/
│   ├── HomeScreen.tsx         # Video list with FlatList
│   └── PlayerScreen.tsx       # Full-screen video player
└── navigation/
    └── AppNavigator.tsx       # Stack navigator configuration
```

## Getting Started

### Prerequisites

- Node.js >= 22.11.0
- React Native development environment ([Setup Guide](https://reactnative.dev/docs/set-up-your-environment))
- Android: Android Studio with SDK 36
- iOS: Xcode 16+

### Install

```sh
npm install
```

#### iOS only

```sh
bundle install           # first time only
cd ios && pod install && cd ..
```

### Run

Start the Metro dev server:

```sh
npm start
```

Then open a second terminal:

```sh
# Android
npm run android

# iOS
npm run ios
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Metro dev server |
| `npm run android` | Build & run on Android |
| `npm run ios` | Build & run on iOS |
| `npm test` | Run Jest tests |
| `npm run lint` | Run ESLint |
| `npm run format` | Auto-format code with Prettier |
| `npm run format:check` | Check formatting (CI) |

## Permissions

### Android

The app requests `READ_MEDIA_VIDEO` (Android 13+) or `READ_EXTERNAL_STORAGE` (Android 12 and below) on first launch. If denied, you can grant it later via system Settings.

### iOS

No special permission is required. The app accesses videos from its own documents directory.

## License

Private
