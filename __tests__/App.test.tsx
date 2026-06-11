/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

// Mock native modules before importing App
jest.mock('react-native-video', () => 'Video');
jest.mock('react-native-fs', () => ({
  ExternalStorageDirectoryPath: '/mock/storage',
  DocumentDirectoryPath: '/mock/documents',
  readDir: jest.fn().mockResolvedValue([]),
}));

import App from '../App';

test('renders correctly', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<App />);
  });

  expect(tree!).toBeDefined();
});
