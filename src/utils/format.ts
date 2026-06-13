import type { TFunction } from 'i18next';

export function formatDuration(seconds: number, t?: TFunction): string {
  if (!seconds || seconds <= 0 || !isFinite(seconds)) {
    return t?.('format.durationFallback') ?? '--:--';
  }

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (h > 0) {
    return `${h}:${pad(m)}:${pad(s)}`;
  }
  return `${m}:${pad(s)}`;
}

export function formatFileSize(bytes: number, t?: TFunction): string {
  if (bytes <= 0) {
    return t?.('format.sizeFallback') ?? '0 B';
  }

  const units = t?.('format.sizeUnits') ?? ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    (Array.isArray(units) ? units.length : 5) - 1,
  );

  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${Array.isArray(units) ? units[i] : '?'}`;
}

export function formatDate(date: Date, t?: TFunction): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 30) {
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  if (days > 0) {
    return t?.('format.dayAgo', { count: days }) ?? `${days} day${days > 1 ? 's' : ''} ago`;
  }
  if (hours > 0) {
    return t?.('format.hourAgo', { count: hours }) ?? `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (minutes > 0) {
    return t?.('format.minAgo', { count: minutes }) ?? `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  }
  return t?.('format.justNow') ?? 'Just now';
}

export function encodeFilePath(path: string): string {
  return `file://${encodeURI(path)}`;
}
