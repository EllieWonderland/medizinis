import * as Notifications from 'expo-notifications';

export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });
  return status === 'granted';
}

// Schedules a daily notification for each reminder time of a medication.
// Returns the list of notification identifiers for later cancellation.
export async function scheduleNotificationsForMedication(
  medId: number,
  name: string,
  reminderTimes: string[]
): Promise<string[]> {
  const identifiers: string[] = [];
  for (const time of reminderTimes) {
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    if (isNaN(hour) || isNaN(minute)) continue;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🦉 Eule Hedwig erinnert dich!',
        body: `Zeit für ${name}. Vergiss nicht, deine Heilkräuter zu ernten!`,
        data: { medicationId: medId },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
    identifiers.push(id);
  }
  return identifiers;
}

export async function cancelAllScheduledNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Reschedules all notifications from scratch based on the current medication list.
type MedForNotification = { id: number; name: string; reminder_times: string[] };
export async function rescheduleAllNotifications(
  medications: MedForNotification[]
): Promise<void> {
  await cancelAllScheduledNotifications();
  for (const med of medications) {
    await scheduleNotificationsForMedication(med.id, med.name, med.reminder_times);
  }
}
