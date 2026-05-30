import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme, View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { db } from '@/db';
import migrations from '../../drizzle/migrations';
import { setupNotificationHandler, requestNotificationPermissions } from '@/lib/notifications';

// Register the foreground notification handler before the component tree mounts.
setupNotificationHandler();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  if (error) {
    console.error('[DB] Migration failed:', error);
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Datenbankfehler</Text>
        <Text style={styles.errorBody}>
          Die Datenbank konnte nicht initialisiert werden. Bitte starte die App neu.
        </Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <AppTabs />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorBody: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
});
