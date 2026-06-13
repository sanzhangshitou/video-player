import type { TFunction } from 'i18next';
import {
  formatDuration,
  formatFileSize,
  formatDate,
  encodeFilePath,
} from '../src/utils/format';

const mockT = jest.fn((key: string, options?: Record<string, unknown>) => {
  if (key === 'format.durationFallback') {
    return '--:--';
  }
  if (key === 'format.sizeFallback') {
    return '0 B';
  }
  if (key === 'format.sizeUnits') {
    return ['B', 'KB', 'MB', 'GB', 'TB'];
  }
  if (key === 'format.justNow') {
    return 'Just now';
  }
  if (key === 'format.minAgo') {
    return `${options?.count} min${(options?.count as number) > 1 ? 's' : ''} ago`;
  }
  if (key === 'format.hourAgo') {
    return `${options?.count} hour${(options?.count as number) > 1 ? 's' : ''} ago`;
  }
  if (key === 'format.dayAgo') {
    return `${options?.count} day${(options?.count as number) > 1 ? 's' : ''} ago`;
  }
  return '';
}) as unknown as TFunction;

describe('formatDuration', () => {
  it('returns fallback for zero seconds', () => {
    expect(formatDuration(0, mockT)).toBe('--:--');
  });

  it('returns fallback without t function', () => {
    expect(formatDuration(0)).toBe('--:--');
  });

  it('returns --:-- for negative seconds', () => {
    expect(formatDuration(-5, mockT)).toBe('--:--');
  });

  it('returns --:-- for NaN', () => {
    expect(formatDuration(NaN, mockT)).toBe('--:--');
  });

  it('returns --:-- for Infinity', () => {
    expect(formatDuration(Infinity, mockT)).toBe('--:--');
  });

  it('formats seconds as m:ss', () => {
    expect(formatDuration(65, mockT)).toBe('1:05');
  });

  it('formats minutes as mm:ss', () => {
    expect(formatDuration(125, mockT)).toBe('2:05');
  });

  it('formats hours as h:mm:ss', () => {
    expect(formatDuration(3661, mockT)).toBe('1:01:01');
  });

  it('formats zero minutes correctly', () => {
    expect(formatDuration(5, mockT)).toBe('0:05');
  });

  it('formats full duration without hours', () => {
    expect(formatDuration(3599, mockT)).toBe('59:59');
  });
});

describe('formatFileSize', () => {
  it('returns fallback for zero', () => {
    expect(formatFileSize(0, mockT)).toBe('0 B');
  });

  it('returns fallback without t function', () => {
    expect(formatFileSize(0)).toBe('0 B');
  });

  it('returns 0 B for negative', () => {
    expect(formatFileSize(-100, mockT)).toBe('0 B');
  });

  it('formats bytes', () => {
    expect(formatFileSize(500, mockT)).toBe('500 B');
  });

  it('formats KB', () => {
    expect(formatFileSize(1024, mockT)).toBe('1.0 KB');
  });

  it('formats MB', () => {
    expect(formatFileSize(1048576, mockT)).toBe('1.0 MB');
  });

  it('formats GB', () => {
    expect(formatFileSize(1073741824, mockT)).toBe('1.0 GB');
  });

  it('formats TB', () => {
    expect(formatFileSize(1099511627776, mockT)).toBe('1.0 TB');
  });

  it('handles large values without exceeding unit array', () => {
    expect(formatFileSize(2097152, mockT)).toBe('2.0 MB');
  });
});

describe('formatDate', () => {
  it('returns Just now for same time', () => {
    const now = new Date();
    expect(formatDate(now, mockT)).toBe('Just now');
  });

  it('returns fallback without t function', () => {
    const now = new Date();
    expect(formatDate(now)).toBe('Just now');
  });

  it('returns minutes ago', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatDate(date, mockT)).toBe('5 mins ago');
  });

  it('returns 1 min ago for singular', () => {
    const date = new Date(Date.now() - 60 * 1000);
    expect(formatDate(date, mockT)).toBe('1 min ago');
  });

  it('returns hours ago', () => {
    const date = new Date(Date.now() - 3 * 3600 * 1000);
    expect(formatDate(date, mockT)).toBe('3 hours ago');
  });

  it('returns 1 hour ago for singular', () => {
    const date = new Date(Date.now() - 3600 * 1000);
    expect(formatDate(date, mockT)).toBe('1 hour ago');
  });

  it('returns days ago', () => {
    const date = new Date(Date.now() - 2 * 86400 * 1000);
    expect(formatDate(date, mockT)).toBe('2 days ago');
  });

  it('returns 1 day ago for singular', () => {
    const date = new Date(Date.now() - 86400 * 1000);
    expect(formatDate(date, mockT)).toBe('1 day ago');
  });

  it('returns formatted date for >30 days', () => {
    const date = new Date(Date.now() - 40 * 86400 * 1000);
    const result = formatDate(date, mockT);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    expect(result).not.toBe('Just now');
    expect(result).not.toContain('ago');
  });
});

describe('encodeFilePath', () => {
  it('prepends file:// with encoded path', () => {
    expect(encodeFilePath('/storage/Movies/test.mp4')).toBe(
      'file:///storage/Movies/test.mp4',
    );
  });

  it('encodes special characters in path', () => {
    expect(encodeFilePath('/path/with spaces/video.mp4')).toBe(
      'file:///path/with%20spaces/video.mp4',
    );
  });
});
