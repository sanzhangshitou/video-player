# AGENTS.md — Noir

## Verification order

Always run in this order — later steps depend on earlier ones passing:

```sh
npm run lint          # ESLint
npm tsc --noEmit      # TypeScript type checker (not a package.json script)
npm test              # Jest (31 tests)
```

Or as a chain:
```sh
npm run lint && npx tsc --noEmit && npm test
```

## Project identity

- **Display name:** Noir (user-facing in `app.json` `displayName`, Android `strings.xml`, iOS `CFBundleDisplayName`, LaunchScreen)
- **JS module name:** `AwesomeProject` (in `app.json` `name` — used by `AppRegistry.registerComponent`, must match what native side expects)
- **npm package:** `noir-player`
- **Android package:** `com.awesomeproject` (Kotlin sources under `android/app/src/main/java/com/awesomeproject/`)
- **iOS target:** `AwesomeProject` (Podfile target, Xcode project name)

**Critical:** Do not change `app.json` `name` unless you also update iOS `AppDelegate.swift` `withModuleName` and confirm Android autolinking matches. The display name is safe to change independently.

## Entry points

| File | Role |
|------|------|
| `index.js` | AppRegistry entry — reads `app.json` `name` |
| `App.tsx` | Root component — ErrorBoundary → I18nextProvider → SafeAreaProvider → NavigationContainer |
| `src/navigation/AppNavigator.tsx` | Stack: Home → Player |

## Development workflow

Metro must run in a separate terminal from the build:

```sh
# Terminal 1
npm start

# Terminal 2
npm run android   # or npm run ios
```

After adding native dependencies, run `pod install` in the `ios/` directory.

## i18n architecture

The app auto-detects system language via `react-native-localize`. If detection fails, it falls back to `en`.

`src/i18n/index.ts` initializes the global i18next instance. `App.tsx` wraps the tree with `<I18nextProvider i18n={i18n}>`.

**Ref pattern for `t` in hooks:** The `useTranslation()` `t` function can change reference during initialization. In `useLocalVideos`, `t` is stored in a `tRef` (not put into `useCallback` dependencies) to prevent infinite re-renders. Always use this pattern when passing `t` into async callbacks inside hooks.

Translation keys are defined in `src/i18n/locales/en.json` and mirrored in `zh-Hans.json`, `zh-Hant.json`, `ja.json`, `ko.json`. Adding a new key requires updating all 5 files plus `src/i18n/types.ts`.

Format utilities (`formatDuration`, `formatFileSize`, `formatDate`) accept an optional `TFunction` parameter — pass `t` from `useTranslation()` to get localized output. Without it, they produce English fallback strings.

`requestStoragePermission(t)` — the Android permission dialog strings are also localized via `t`.

## Testing

Tests mock native modules via `__mocks__/` (auto-loaded by Jest). Three mocks exist: `react-native-fs`, `react-native-video`, `react-native-localize`.

`jest.config.js` includes an explicit `transformIgnorePatterns` whitelist — any new dependency using ES modules must be added there.

Run a single test file:
```sh
npx jest --testPathPattern="format"
```

## Code conventions

- **Prettier:** single quotes, trailing commas, no arrow parens (`arrowParens: 'avoid'`)
- **EditorConfig:** 2-space indent for JS/TS/JSON/MD, 4-space for `.kt`/`.kts`/`.gradle`/`.swift`, tabs for `.pbxproj`/`.xcscheme`
- **TypeScript:** `strict: true` + `noUncheckedIndexedAccess: true` — no `any` without reason, handle potential `undefined` from array/record access
- **All event handlers** in components use `useCallback` — this maintains stable props for `React.memo` (used on `VideoCard`)
- **No comments** in source code unless asked (project convention)
- **No icon library** — play/pause/chevron icons are built with `View` borders

## Architecture notes

- `SeekBar.tsx` uses a ref pattern for `getTimeFromX` and `onSeek` — these are captured in a `PanResponder` created once via `useRef`. Without the ref pattern, stale closures break seek after video loads.
- `ErrorBoundary.tsx` is a class component that renders a `ErrorBoundaryView` function component to access `useTranslation()`.
- `useVideoPlayback` hook encapsulates all video state/callbacks extracted from `PlayerScreen`.
- `useAppState` hook is a thin wrapper around `AppState.addEventListener('change', …)`.
- `VideoCard` is wrapped with `React.memo`.

## File dependencies to safe-transpile

These packages use ES module syntax and must appear in both `jest.config.js` `transformIgnorePatterns` and Metro's default config (which already handles RN packages):
`i18next`, `react-i18next`, `react-native-localize`

## Android native resources

App name translations are in separate `values-*` directories under `android/app/src/main/res/`:
`values/strings.xml` (en), `values-zh/` (zh-Hans), `values-zh-rTW/` (zh-Hant), `values-ja/`, `values-ko/`
