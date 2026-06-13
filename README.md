# Noir

> 一款 OLED 暗色风格的本地视频播放器，基于 React Native 构建，支持 Android 与 iOS。

<p align="center">
  <img src="https://img.shields.io/badge/react--native-0.86-61DAFB?style=flat&logo=react" alt="React Native" />
  <img src="https://img.shields.io/badge/typescript-5.8-3178C6?style=flat&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat" alt="License" />
  <img src="https://img.shields.io/badge/platform-android%20%7C%20ios-lightgrey?style=flat" alt="Platform" />
</p>

自动扫描设备本地视频文件，以纯黑界面搭配毛玻璃控件呈现——所有 UI 在画面之上渐隐，让播放内容成为唯一焦点。

## 预览

<!-- TODO: 补充截图 -->

| 首页                     | 播放页                       |
| ------------------------ | ---------------------------- |
| _视频列表，含元数据展示_   | _全屏播放 + 覆盖式控制栏_     |

## 功能

### 视频浏览器

- 自动扫描常用目录（Movies / DCIM / Download / Pictures 等）
- 支持 8 种视频格式：`.mp4` `.mov` `.mkv` `.avi` `.webm` `.3gp` `.m4v` `.wmv`
- 显示文件名、文件大小、时长和最后修改日期
- 下拉刷新或点击刷新按钮均可触发重新扫描
- 从后台切回前台时自动重扫
- 扫描过程中展示带动画的骨架屏
- `FlatList` 配置了 `getItemLayout` 与窗口化参数，长列表流畅滚动

### 播放器

- 全屏沉浸式播放，画面撑满屏幕四边
- 自定义覆盖式控件，无原生播放栏
- 点击画面任意位置切换控件显隐，无操作 3 秒后自动隐藏
- 基于 `PanResponder` 的可拖拽进度条，实时显示当前时间/总时长
- ±10 秒快进快退按钮
- 播放/暂停时显示大型居中指示图标，1.2 秒后渐隐
- 播放出错页提供重试按钮，可尝试恢复播放

### 稳定性

- **ErrorBoundary** 捕获渲染时异常，展示错误信息并提供"重试"按钮，避免白屏
- 骨架屏使用 `useNativeDriver: true` 动画，不阻塞 JS 线程
- 刷新操作带防抖锁，防止前后台切换与下拉刷新并发执行

### 国际化

- 自动跟随系统语言，基于 `react-native-localize` 检测
- 支持 5 种语言：简体中文 / 繁體中文 / 日本語 / 한국어 / English
- 翻译覆盖 UI 文本、格式化输出、Android 权限弹窗等全部面向用户的字符串
- 语言检测失败时静默回退为 English

### 设计

- 全局 `#000000` OLED 纯黑背景——OLED 屏幕下功耗更低，画面沉浸感更强
- 毛玻璃控件：半透明叠加层 + 细边框
- `#0EA5E9` 天蓝色强调色
- 12px 圆角卡片、胶囊形按钮
- 控件使用 `Animated` 驱动渐隐渐显

## 技术栈

| 层级       | 库 / 工具                                 | 版本  |
| ---------- | ----------------------------------------- | ----- |
| 框架       | React Native（新架构 + Hermes）            | 0.86  |
| 语言       | TypeScript（`strict` + `noUncheckedIndexedAccess`） | 5.8   |
| 导航       | `@react-navigation/native-stack`           | 7     |
| 视频播放   | `react-native-video`                      | 6     |
| 文件系统   | `react-native-fs`                         | 2     |
| 安全区域   | `react-native-safe-area-context`           | 5     |
| 原生屏幕   | `react-native-screens`                    | 4     |
| 国际化     | `i18next` + `react-i18next` + `react-native-localize` | -     |
| 代码检查   | ESLint（`@react-native/eslint-config`）     | 8     |
| 格式化     | Prettier                                  | 2.8   |
| 测试       | Jest（`@react-native/jest-preset`）         | 29    |

## 项目结构

```
noir/
├── src/
│   ├── types/
│   │   ├── video.ts              # VideoItem 数据接口
│   │   └── navigation.ts         # 路由参数类型 RootStackParamList
│   ├── theme/
│   │   ├── colors.ts             # OLED 暗色主题色彩常量
│   │   └── constants.ts          # 应用常量（视频扩展名、扫描深度、定时器间隔等）
│   ├── i18n/
│   │   ├── index.ts              # i18next 初始化 + 系统语言检测
│   │   ├── resources.ts          # 各语言翻译资源导入汇总
│   │   ├── types.ts              # 翻译 Key 的 TypeScript 类型约束
│   │   └── locales/
│   │       ├── en.json           # English
│   │       ├── zh-Hans.json      # 简体中文
│   │       ├── zh-Hant.json      # 繁體中文
│   │       ├── ja.json           # 日本語
│   │       └── ko.json           # 한국어
│   ├── utils/
│   │   ├── format.ts             # 时长 / 文件大小 / 日期格式化 + URI 编码
│   │   ├── permissions.ts        # Android 存储权限请求封装
│   │   └── videoScanner.ts       # 基于 RNFS 的递归文件扫描
│   ├── hooks/
│   │   ├── useLocalVideos.ts     # 权限申请 → 扫描 → 刷新 完整生命周期
│   │   ├── useAppState.ts        # AppState 前台监听封装
│   │   └── useVideoPlayback.ts   # 视频播放状态管理与回调
│   ├── components/
│   │   ├── EmptyState.tsx        # 三种状态：加载骨架屏 / 无权限提示 / 无视频提示
│   │   ├── ErrorBoundary.tsx     # React Error Boundary（类组件 + 函数子组件配合 useTranslation）
│   │   ├── VideoCard.tsx         # 视频列表项卡片（React.memo 优化）
│   │   ├── SeekBar.tsx           # PanResponder 可拖拽进度条（ref 模式避免闭包过期）
│   │   └── PlayerControls.tsx    # 毛玻璃播放控件（顶部栏 + 居中播放按钮 + 底部控制栏）
│   ├── screens/
│   │   ├── HomeScreen.tsx        # 首页：头部标题 + FlatList + 下拉刷新
│   │   └── PlayerScreen.tsx      # 播放页：Video 组件 + PlayerControls + 错误状态 + 重试
│   └── navigation/
│       └── AppNavigator.tsx      # 原生堆栈导航配置（Home → Player）
├── __tests__/
│   ├── App.test.tsx              # App 渲染冒烟测试
│   └── format.test.ts            # 格式化工具函数单元测试（27 个用例）
├── __mocks__/
│   ├── react-native-fs.ts        # RNFS Mock
│   ├── react-native-video.ts     # Video Mock
│   └── react-native-localize.ts  # 语言检测 Mock
├── android/
│   ├── app/src/main/
│   │   ├── java/com/awesomeproject/  # MainActivity.kt, MainApplication.kt
│   │   └── res/
│   │       ├── values/strings.xml         # 英文 App 名称
│   │       ├── values-zh/strings.xml      # 简体中文 App 名称
│   │       ├── values-zh-rTW/strings.xml  # 繁体中文 App 名称
│   │       ├── values-ja/strings.xml      # 日文 App 名称
│   │       └── values-ko/strings.xml      # 韩文 App 名称
│   ├── build.gradle
│   └── settings.gradle
├── ios/
│   ├── AwesomeProject/
│   │   ├── AppDelegate.swift     # iOS 入口代理
│   │   ├── Info.plist            # 应用配置（含本地化显示名称）
│   │   └── LaunchScreen.storyboard  # 启动屏
│   ├── AwesomeProject.xcodeproj/ # Xcode 工程文件
│   └── Podfile                   # CocoaPods 依赖配置
├── App.tsx                       # 应用根组件：ErrorBoundary → I18nextProvider → SafeAreaProvider → NavigationContainer
├── index.js                      # 入口文件：AppRegistry.registerComponent
├── app.json                      # name + displayName
├── package.json
├── tsconfig.json                 # TypeScript 严格模式
├── jest.config.js                # Jest 配置（含 i18n 包 transform 白名单）
├── metro.config.js               # Metro 打包配置
├── babel.config.js
├── .eslintrc.js
├── .prettierrc.js
├── .editorconfig
├── .gitattributes                # Git 换行符 / 二进制文件 / diff 规则
├── .gitignore
└── README.md
```

## 架构

### 数据流

```
requestStoragePermission(t)
        │
        ▼
  scanForVideos() ─── RNFS.readDir()（递归，最大深度 3 层，去重）
        │
        ▼
  useLocalVideos() ─── useState / useRef / useEffect（首次加载）/ useAppState（前台恢复）
        │
        ├──► HomeScreen ──► FlatList ──► VideoCard（React.memo）逐项渲染
        │
        └──► PlayerScreen ◄── navigation.navigate('Player', { video })
                 │
                 ├──► useVideoPlayback() ──► videoRef + 状态 + 回调
                 ├──► <Video> 组件（react-native-video）
                 └──► <PlayerControls>
                          ├── SeekBar（PanResponder + getTimeFromXRef 模式）
                          ├── 居中播放/暂停指示（Animated 渐隐）
                          └── 控件自动隐藏定时器（3 秒）
```

### 导航结构

```
NativeStackNavigator
  ├── Home  （animation: slide_from_right）
  └── Player（animation: slide_from_bottom, orientation: all, statusBarHidden）
```

### 设计决策

| 决策                        | 理由                                                             |
| --------------------------- | ---------------------------------------------------------------- |
| **不使用图标库**             | 播放/暂停/箭头均用 View 边框和 Unicode 实现，零原生链接风险      |
| **自定义 SeekBar**          | PanResponder 完全掌控手势行为，避免适配第三方滑块样式             |
| **无状态管理库**             | 仅 2 个页面，数据流清晰—— `useState` + `useCallback` 已足够        |
| **不生成视频缩略图**         | 保持初始构建轻量；占位图标 + 播放按钮即刻可用                    |
| **RNFS 代替 CameraRoll**    | 可扫描任意目录（下载文件夹、SD 卡），不局限于系统媒体库          |
| **ErrorBoundary**           | 捕获渲染时崩溃，展示"重试"按钮而非白屏                            |
| **提取自定义 Hook**          | `useAppState` / `useVideoPlayback` 降低 Screen 复杂度，提升可测试性 |
| **TypeScript strict 模式**   | `strict: true` + `noUncheckedIndexedAccess` 编译时拦截潜在空值     |
| **所有函数 useCallback 包裹** | 稳定 props 引用，配合 React.memo 减少无效重渲染                     |
| **SeekBar ref 模式**         | `getTimeFromX` / `onSeek` 存入 ref，PanResponder 中始终读取最新值  |

## 快速开始

### 环境要求

| 工具           | 最低版本          |
| -------------- | ----------------- |
| Node.js        | 22.11             |
| Android Studio | Ladybug（SDK 36） |
| Xcode          | 16+（仅 macOS）   |
| Ruby           | 2.6.10+（仅 iOS） |

> 如果尚未配置 React Native 开发环境，请先参考 [官方环境搭建指南](https://reactnative.dev/docs/set-up-your-environment)。

### 安装

```sh
git clone <仓库地址> noir
cd noir
npm install
```

#### iOS（仅 macOS）

```sh
bundle install
cd ios && pod install && cd ..
```

> 如果 `pod install` 失败，可尝试 `pod install --repo-update`。

### 运行

```sh
# 终端 1：启动 Metro
npm start

# 终端 2：编译运行
npm run android    # Android 模拟器 / 真机
npm run ios        # iOS 模拟器（macOS）
```

### 测试

```sh
npm test              # Jest（31 个测试用例，全部通过）
npm run lint          # ESLint 代码检查
npm run format:check  # Prettier 格式检查
npm run format        # Prettier 自动格式化
```

## 权限说明

### Android

应用首次启动时请求权限：

| 权限                     | API 级别          | 用途         |
| ------------------------ | ----------------- | ------------ |
| `READ_MEDIA_VIDEO`       | 33+（Android 13） | 访问视频文件 |
| `READ_EXTERNAL_STORAGE`  | ≤ 32              | 旧版本兼容   |

权限弹窗中的标题、说明文字、按钮文本均跟随系统语言自动翻译。

如被拒绝，可在应用内点击"打开设置"按钮，或手动前往 **设置 → 应用 → Noir → 权限** 进行授权。

### iOS

无需运行时权限。应用扫描自身 Documents 目录。如需加载其他来源的视频，可使用 **文件** App 或 **iTunes 文件共享**。

## 视频格式兼容性

| 格式     | 扩展名  | Android | iOS |
| -------- | ------- | ------- | --- |
| MPEG-4   | `.mp4`  | ✅      | ✅  |
| QuickTime| `.mov`  | ✅      | ✅  |
| Matroska | `.mkv`  | ✅      | ⚠️  |
| AVI      | `.avi`  | ✅      | ⚠️  |
| WebM     | `.webm` | ✅      | ❌  |
| 3GPP     | `.3gp`  | ✅      | ✅  |
| M4V      | `.m4v`  | ✅      | ✅  |
| WMV      | `.wmv`  | ✅      | ❌  |

> iOS 的硬件加速解码仅覆盖 MP4 / MOV / M4V。其他格式可能失败或回退到软件解码。Android 端（ExoPlayer）原生支持以上全部格式。

## 路线图

- [ ] 视频缩略图（通过 `react-native-video` 跳帧截图）
- [ ] 后台音频播放
- [ ] 画中画（PiP）
- [ ] 播放列表 / 队列管理
- [ ] 倍速播放（0.5x / 1x / 1.5x / 2x）
- [ ] 手势调节音量与亮度
- [ ] 视频列表排序与格式筛选
- [ ] 应用内删除视频
- [ ] 扫描结果缓存（AsyncStorage），减少重复扫描

## 参与贡献

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/my-feature`
3. 遵循已有代码风格进行开发
4. 提交前执行 `npm run format:check && npm run lint && npm test`
5. 提交并推送，然后发起 Pull Request

## 许可证

[MIT](LICENSE) © 2026 Noir
