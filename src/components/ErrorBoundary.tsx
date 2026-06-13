import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundaryView
          message={this.state.error?.message}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

function ErrorBoundaryView({
  message,
  onReset,
}: {
  message?: string;
  onReset: () => void;
}) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.icon} accessibilityLabel={t('errorBoundary.title')}>
        ⚠
      </Text>
      <Text style={styles.title}>{t('errorBoundary.title')}</Text>
      <Text style={styles.message}>
        {message ?? t('errorBoundary.fallbackMessage')}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={onReset}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>{t('errorBoundary.tryAgain')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  button: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 24,
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
});
