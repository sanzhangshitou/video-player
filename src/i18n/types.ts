export interface TranslationKeys {
  home: {
    title: string;
    videoCount_one?: string;
    videoCount_other: string;
  };
  player: {
    playbackError: string;
    errorMessage: string;
    retry: string;
    goBack: string;
    skipBack: string;
    skipForward: string;
  };
  empty: {
    permissionTitle: string;
    permissionSubtitle: string;
    openSettings: string;
    noVideosTitle: string;
    noVideosSubtitle: string;
    scanAgain: string;
    settingsAlertTitle: string;
    settingsAlertMessage: string;
  };
  errorBoundary: {
    title: string;
    fallbackMessage: string;
    tryAgain: string;
  };
  format: {
    durationFallback: string;
    sizeFallback: string;
    sizeUnits: string[];
    justNow: string;
    minAgo_one?: string;
    minAgo_other?: string;
    hourAgo_one?: string;
    hourAgo_other?: string;
    dayAgo_one?: string;
    dayAgo_other?: string;
  };
  permissions: {
    videoTitle: string;
    videoMessage: string;
    storageTitle: string;
    storageMessage: string;
    allow: string;
    deny: string;
  };
}
