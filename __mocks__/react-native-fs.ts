export default {
  ExternalStorageDirectoryPath: '/mock/storage',
  DocumentDirectoryPath: '/mock/documents',
  readDir: jest.fn().mockResolvedValue([]),
  stat: jest.fn().mockResolvedValue({}),
  exists: jest.fn().mockResolvedValue(false),
};
