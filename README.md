# AwesomePlayer

> A modern, minimalist local video player for Android and iOS built with React Native.

<p align="center">
  <img src="https://img.shields.io/badge/react--native-0.86-61DAFB?style=flat&logo=react" alt="React Native" />
  <img src="https://img.shields.io/badge/typescript-5.8-3178C6?style=flat&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat" alt="License" />
  <img src="https://img.shields.io/badge/platform-android%20%7C%20ios-lightgrey?style=flat" alt="Platform" />
</p>

Browse and play videos stored locally on your device. OLED-optimized dark interface with glassmorphism controls — everything fades away so the content takes center stage.

## Preview

<!-- TODO: add screenshots -->

| Home Screen                             | Player Screen                                |
| --------------------------------------- | -------------------------------------------- |
| _Video list with thumbnails & metadata_ | _Full-screen playback with overlay controls_ |

## Features

### Video Browser

- Automatically scans common directories for video files
- Supports `.mp4` `.mov` `.mkv` `.avi` `.webm` `.3gp` `.m4v` `.wmv`
- Displays file name, size, duration, and last-modified date
- Pull-to-refresh re-scans the device
- Skeleton loading state while scanning

### Player

- Full-screen immersive playback with edge-to-edge rendering
- Custom overlay controls — no native chrome
- Tap anywhere to toggle controls; auto-hide after 3 seconds of inactivity
- Draggable seek bar with live time display
- ±10 second skip buttons
- Large center play/pause indicator that fades after state change
- Playback error screen with retry guidance

### Design

- **OLED black** (`#000`) background throughout — saves battery on OLED screens
- **Glassmorphism** controls — semi-transparent overlays with subtle borders
- **Sky blue** accent (`#0EA5E9`) for primary actions
- **12px rounded** cards, **pill-shaped** buttons
- Smooth `Animated` fade transitions on controls
- Dark-first approach — built for the cinema experience

## Tech Stack

| Layer      | Technology                               | Version |
| ---------- | ---------------------------------------- | ------- |
| Framework  | React Native (New Architecture + Hermes) | 0.86    |
| Language   | TypeScript                               | 5.8     |
| Navigation | `@react-navigation/native-stack`         | 7       |
| Video      | `react-native-video`                     | 6       |
| Filesystem | `react-native-fs`                        | 2       |
| Safe Areas | `react-native-safe-area-context`         | 5       |
| Linting    | ESLint (`@react-native/eslint-config`)   | 8       |
| Formatting | Prettier                                 | 2.8     |
| Testing    | Jest (`@react-native/jest-preset`)       | 29      |

## Project Structure

```
AwesomeProject/
├── src/
│   ├── types/
│   │   ├── video.ts              # VideoItem interface
│   │   └── navigation.ts         # RootStackParamList
│   ├── theme/
│   │   └── colors.ts             # OLED dark color constants
│   ├── utils/
│   │   ├── format.ts             # Duration / file size / date formatters
│   │   ├── permissions.ts        # Android permission request helper
│   │   └── videoScanner.ts       # Recursive filesystem scan via RNFS
│   ├── hooks/
│   │   └── useLocalVideos.ts     # Permission → scan → refresh lifecycle
│   ├── components/
│   │   ├── EmptyState.tsx        # Loading shimmer / no-permission / no-videos
│   │   ├── VideoCard.tsx         # List item: thumbnail + name + size + date
│   │   ├── SeekBar.tsx           # PanResponder-based draggable progress bar
│   │   └── PlayerControls.tsx    # Glassmorphism overlay with all controls
│   ├── screens/
│   │   ├── HomeScreen.tsx        # FlatList with header and pull-to-refresh
│   │   └── PlayerScreen.tsx      # Video component + controls + error handling
│   └── navigation/
│       └── AppNavigator.tsx      # Native stack (Home → Player)
├── __tests__/
│   └── App.test.tsx
├── __mocks__/
│   ├── react-native-fs.ts
│   └── react-native-video.ts
├── android/                      # Android native project
├── ios/                          # iOS native project
├── App.tsx                       # Entry: SafeAreaProvider + NavigationContainer
├── index.js                      # App registry
├── package.json
├── tsconfig.json
├── .editorconfig
├── .eslintrc.js
├── .prettierrc.js
├── .prettierignore
├── .gitignore
└── README.md
```

## Architecture

### Data Flow

```
requestStoragePermission()
        │
        ▼
  scanForVideos() ─── RNFS.readDir() (recursive, max depth 3)
        │
        ▼
  useLocalVideos() ─── useState / useCallback / AppState listener
        │
        ├──► HomeScreen ──► FlatList ──► VideoCard (per item)
        │
        └──► PlayerScreen ◄── navigation.navigate('Player', { video })
                 │
                 ├──► <Video> (react-native-video)
                 └──► <PlayerControls>
                          ├── SeekBar (PanResponder)
                          └── Auto-hide timer (3s)
```

### Navigation

```
NativeStackNavigator
  ├── Home   (slide_from_right)
  └── Player (slide_from_bottom, full-screen, orientation: all)
```

### Design Decisions

| Decision                              | Rationale                                                                              |
| ------------------------------------- | -------------------------------------------------------------------------------------- |
| **No icon library**                   | Play/pause/chevron built with View borders and Unicode — zero native linking risk      |
| **Custom SeekBar**                    | PanResponder gives full control over gesture behavior; avoids styling a generic slider |
| **No state management lib**           | Only 2 screens with clear data flow — `useState` + `useCallback` suffices              |
| **No thumbnail generation**           | Keeps initial build lean; placeholder gradient + play icon works instantly             |
| **`react-native-fs` over CameraRoll** | Scans arbitrary directories (Downloads, SD cards), not just the media library          |

## Getting Started

### Prerequisites

| Tool           | Minimum Version    |
| -------------- | ------------------ |
| Node.js        | 22.11              |
| Android Studio | Ladybug (SDK 36)   |
| Xcode          | 16+ (macOS only)   |
| Ruby           | 2.6.10+ (iOS only) |

> Follow the [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment) guide if you haven't already.

### Install

```sh
git clone <repo-url> AwesomePlayer
cd AwesomePlayer
npm install
```

#### iOS (macOS only)

```sh
bundle install          # first clone only
cd ios && pod install && cd ..
```

### Run

```sh
# Terminal 1: Metro bundler
npm start

# Terminal 2: build & run
npm run android          # Android emulator / device
npm run ios              # iOS simulator (macOS)
```

### Test

```sh
npm test                # Jest unit tests
npm run lint            # ESLint
npm run format:check    # Prettier check
npm run format          # Prettier auto-fix
```

## Permissions

### Android

The app requests permission on first launch:

| Permission              | API Level        | Purpose            |
| ----------------------- | ---------------- | ------------------ |
| `READ_MEDIA_VIDEO`      | 33+ (Android 13) | Access video files |
| `READ_EXTERNAL_STORAGE` | ≤ 32             | Legacy fallback    |

If denied, use the in-app "Open Settings" button or grant manually via **Settings → Apps → AwesomePlayer → Permissions**.

### iOS

No runtime permission is required. The app scans its own documents directory. To load videos from other sources, use **Files** app or **iTunes File Sharing**.

## Video Format Support

| Format    | Extension | Android | iOS |
| --------- | --------- | ------- | --- |
| MPEG-4    | `.mp4`    | ✅      | ✅  |
| QuickTime | `.mov`    | ✅      | ✅  |
| Matroska  | `.mkv`    | ✅      | ⚠️  |
| AVI       | `.avi`    | ✅      | ⚠️  |
| WebM      | `.webm`   | ✅      | ❌  |
| 3GPP      | `.3gp`    | ✅      | ✅  |
| M4V       | `.m4v`    | ✅      | ✅  |
| WMV       | `.wmv`    | ✅      | ❌  |

> iOS hardware-accelerated playback is limited to MP4/MOV/M4V. Other formats may fail or require software decoding. Android (via ExoPlayer) handles all listed formats natively.

## Roadmap

- [ ] Video thumbnails (via `react-native-video` seek-to-frame)
- [ ] Background audio playback
- [ ] Picture-in-Picture
- [ ] Playlist / queue support
- [ ] Playback speed controls
- [ ] Gesture-based volume and brightness
- [ ] Sort & filter in video list
- [ ] Video deletion from within the app

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes, following the existing code style
4. Run `npm run format:check && npm run lint && npm test` before committing
5. Commit and push, then open a pull request

## License

[MIT](LICENSE) © 2026 AwesomePlayer
