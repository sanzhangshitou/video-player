import {
  formatDuration,
  formatFileSize,
  formatDate,
  encodeFilePath,
} from '../src/utils/format';

describe('formatDuration', () => {
  it('returns --:-- for zero seconds', () => {
    expect(formatDuration(0)).toBe('--:--');
  });

  it('returns --:-- for negative seconds', () => {
    expect(formatDuration(-5)).toBe('--:--');
  });

  it('returns --:-- for NaN', () => {
    expect(formatDuration(NaN)).toBe('--:--');
  });

  it('returns --:-- for Infinity', () => {
    expect(formatDuration(Infinity)).toBe('--:--');
  });

  it('formats seconds as m:ss', () => {
    expect(formatDuration(65)).toBe('1:05');
  });

  it('formats minutes as mm:ss', () => {
    expect(formatDuration(125)).toBe('2:05');
  });

  it('formats hours as h:mm:ss', () => {
    expect(formatDuration(3661)).toBe('1:01:01');
  });

  it('formats zero minutes correctly', () => {
    expect(formatDuration(5)).toBe('0:05');
  });

  it('formats full duration without hours', () => {
    expect(formatDuration(3599)).toBe('59:59');
  });
});

describe('formatFileSize', () => {
  it('returns 0 B for zero', () => {
    expect(formatFileSize(0)).toBe('0 B');
  });

  it('returns 0 B for negative', () => {
    expect(formatFileSize(-100)).toBe('0 B');
  });

  it('formats bytes', () => {
    expect(formatFileSize(500)).toBe('500 B');
  });

  it('formats KB', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB');
  });

  it('formats MB', () => {
    expect(formatFileSize(1048576)).toBe('1.0 MB');
  });

  it('formats GB', () => {
    expect(formatFileSize(1073741824)).toBe('1.0 GB');
  });

  it('formats TB', () => {
    expect(formatFileSize(1099511627776)).toBe('1.0 TB');
  });

  it('handles large values without exceeding unit array', () => {
    expect(formatFileSize(2097152)).toBe('2.0 MB');
  });
});

describe('formatDate', () => {
  it('returns Just now for same time', () => {
    const now = new Date();
    expect(formatDate(now)).toBe('Just now');
  });

  it('returns minutes ago', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatDate(date)).toBe('5 mins ago');
  });

  it('returns 1 min ago for singular', () => {
    const date = new Date(Date.now() - 60 * 1000);
    expect(formatDate(date)).toBe('1 min ago');
  });

  it('returns hours ago', () => {
    const date = new Date(Date.now() - 3 * 3600 * 1000);
    expect(formatDate(date)).toBe('3 hours ago');
  });

  it('returns 1 hour ago for singular', () => {
    const date = new Date(Date.now() - 3600 * 1000);
    expect(formatDate(date)).toBe('1 hour ago');
  });

  it('returns days ago', () => {
    const date = new Date(Date.now() - 2 * 86400 * 1000);
    expect(formatDate(date)).toBe('2 days ago');
  });

  it('returns 1 day ago for singular', () => {
    const date = new Date(Date.now() - 86400 * 1000);
    expect(formatDate(date)).toBe('1 day ago');
  });

  it('returns formatted date for >30 days', () => {
    const date = new Date(Date.now() - 40 * 86400 * 1000);
    const result = formatDate(date);
    expect(result).toMatch(/^[A-Z][a-z]{2} \d{1,2}, \d{4}$/);
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
