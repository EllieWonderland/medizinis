import React, { useEffect } from 'react';
import { StyleSheet, View, Pressable, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Leaf, AlertCircle } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ConfirmIntakeModal } from '@/components/confirm-intake-modal';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, BottomTabInset, MaxContentWidth } from '@/constants/theme';
import { useMedizini } from '@/hooks/use-medizini';
import { useMedications } from '@/hooks/use-medications';
import { useUserSettings } from '@/hooks/use-user-settings';
import { useAppStore } from '@/store';
import { getNextDoseInfo, STAGE_EMOJIS, STAGE_LABELS, isDoseTakenToday, type MediziniStage } from '@/lib/dose-logic';
import { rescheduleAllNotifications } from '@/lib/notifications';

export default function ZimmerScreen() {
  const theme = useTheme();
  const { medizini, progressPercent, isReadyToHatch, hatch } = useMedizini();
  const { medications } = useMedications();
  const { settings } = useUserSettings();
  const herbBalance = useAppStore((s) => s.herbBalance);
  const openOverlay = useAppStore((s) => s.openOverlay);

  // --- Egg animation values ---
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  // Heart particle for swipe-pet feedback
  const heartY = useSharedValue(0);
  const heartOpacity = useSharedValue(0);

  // Glow ring for "ready to hatch" state
  const glowOpacity = useSharedValue(0);
  const glowScale = useSharedValue(1);

  // --- Notification reschedule ---
  const notificationKey = medications
    .map((m) => `${m.id}:${m.name}:${m.reminder_times.join(',')}`)
    .join('|');
  useEffect(() => {
    if (medications.length === 0) return;
    rescheduleAllNotifications(medications).catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationKey]);

  // --- Idle breathing animation ---
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 1200, easing: Easing.ease }),
        withTiming(1, { duration: 1200, easing: Easing.ease })
      ),
      -1,
      true
    );
  }, []);

  // --- Ready-to-hatch glow pulse ---
  useEffect(() => {
    if (isReadyToHatch) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.65, { duration: 700 }),
          withTiming(0.15, { duration: 700 })
        ),
        -1,
        true
      );
      glowScale.value = withRepeat(
        withSequence(
          withTiming(1.12, { duration: 700 }),
          withTiming(1.0, { duration: 700 })
        ),
        -1,
        true
      );
    } else {
      glowOpacity.value = withTiming(0, { duration: 300 });
      glowScale.value = withTiming(1, { duration: 300 });
    }
  }, [isReadyToHatch]);

  // --- Animation helpers (must be plain JS functions for runOnJS) ---
  const triggerWobble = () => {
    rotation.value = withSequence(
      withTiming(-8, { duration: 100, easing: Easing.linear }),
      withTiming(8, { duration: 100, easing: Easing.linear }),
      withTiming(-5, { duration: 100, easing: Easing.linear }),
      withTiming(5, { duration: 100, easing: Easing.linear }),
      withTiming(0, { duration: 100, easing: Easing.linear })
    );
    scale.value = withSequence(
      withTiming(1.08, { duration: 150 }),
      withTiming(0.95, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );
  };

  const showHeart = () => {
    heartY.value = 0;
    heartOpacity.value = 1;
    heartY.value = withTiming(-70, { duration: 900 });
    heartOpacity.value = withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(0, { duration: 700 })
    );
  };

  const triggerHatchCelebration = () => {
    scale.value = withSequence(
      withTiming(0.1, { duration: 120 }),
      withTiming(1.35, { duration: 350, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 200 })
    );
  };

  // --- Gesture handlers (called via runOnJS from worklet) ---
  const handleSwipePet = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    triggerWobble();
    showHeart();
  };

  const handleTapEgg = () => {
    if (isReadyToHatch) {
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      triggerHatchCelebration();
      hatch().catch(console.error);
    } else {
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      triggerWobble();
    }
  };

  // --- Gesture definitions ---
  const panGesture = Gesture.Pan()
    .minDistance(20)
    .onEnd((e) => {
      // Primarily horizontal → streicheln; vertical swipes are likely scroll attempts.
      if (Math.abs(e.translationX) > Math.abs(e.translationY) && Math.abs(e.translationX) > 20) {
        runOnJS(handleSwipePet)();
      }
    });

  const tapGesture = Gesture.Tap().onEnd(() => {
    runOnJS(handleTapEgg)();
  });

  const eggGesture = Gesture.Exclusive(panGesture, tapGesture);

  // --- Animated styles ---
  const eggAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: heartY.value }],
    opacity: heartOpacity.value,
  }));

  // --- Derived display data ---
  const stage = (medizini?.current_stage ?? 'Egg') as MediziniStage;
  const stageEmoji = STAGE_EMOJIS[stage];
  const stageLabel = STAGE_LABELS[stage];
  const doseProgress = medizini?.current_doses_progress ?? 0;
  const doseTarget = medizini?.target_doses_for_next_stage ?? 7;

  const cutoffHour = settings?.day_cutoff_hour ?? 4;
  const dueMedsCount = medications.filter(
    (m) => !isDoseTakenToday(m.last_taken_at as Date | null, cutoffHour)
  ).length;
  const allTakenToday = medications.length > 0 && dueMedsCount === 0;

  const nextDose = getNextDoseInfo(medications);

  const owlMessage = isReadyToHatch
    ? 'Dein Medizini ist bereit zu schlüpfen! Tippe auf das Ei! ✨'
    : allTakenToday
    ? 'Super! Du hast heute alle Medikamente genommen. Dein Medizini ist stolz auf dich!'
    : dueMedsCount > 0
    ? `${dueMedsCount} Medikament${dueMedsCount > 1 ? 'e' : ''} noch offen. Vergiss deine Heilenergie nicht!`
    : 'Hallo Abenteurer! Dein Ei schläft friedlich. Wenn du heute deine Heilenergie sammelst, wächst es weiter!';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <ThemedText type="small" themeColor="textSecondary">Guten Morgen ✨</ThemedText>
              <ThemedText type="subtitle" style={styles.titleText}>Dein Zimmer</ThemedText>
            </View>
            <View style={[styles.currencyBadge, { backgroundColor: theme.backgroundElement }]}>
              <Leaf size={16} color={theme.accent} fill={theme.accent} />
              <ThemedText type="smallBold" style={{ color: theme.text, marginLeft: Spacing.one }}>
                {herbBalance} Kräuter
              </ThemedText>
            </View>
          </View>

          {/* Owl NPC Dialog Box */}
          <ThemedView
            type="backgroundElement"
            style={[
              styles.npcContainer,
              isReadyToHatch && { borderColor: theme.accent, borderWidth: 1.5 },
            ]}
          >
            <View style={styles.npcRow}>
              <View style={[styles.owlAvatar, { backgroundColor: isReadyToHatch ? theme.accent : theme.primary }]}>
                <ThemedText style={styles.owlAvatarText}>🦉</ThemedText>
              </View>
              <View style={styles.npcSpeechBubble}>
                <ThemedText type="smallBold" themeColor={isReadyToHatch ? 'accent' : 'primary'}>
                  Eule Hedwig
                </ThemedText>
                <ThemedText type="small" themeColor="text" style={styles.npcMessage}>
                  "{owlMessage}"
                </ThemedText>
              </View>
            </View>
          </ThemedView>

          {/* Room Visual Area */}
          <View style={[styles.roomContainer, { borderColor: theme.backgroundElement }]}>
            <View style={styles.roomSlots}>
              <View style={[styles.decoSlot, { backgroundColor: theme.backgroundElement }]}>
                <ThemedText style={styles.slotEmoji}>🛏️</ThemedText>
                <ThemedText type="code" style={{ fontSize: 9 }}>Moosbett</ThemedText>
              </View>
              <View style={styles.decoSlotSpacer} />
              <View style={[styles.decoSlot, { backgroundColor: theme.backgroundSelected }]}>
                <ThemedText style={styles.slotEmoji}>✨</ThemedText>
                <ThemedText type="code" style={{ fontSize: 9 }}>Frei</ThemedText>
              </View>
            </View>

            {/* Egg / Medizini with gesture support */}
            <GestureDetector gesture={eggGesture}>
              <View style={styles.eggInteractiveArea}>
                {/* Ready-to-hatch glow ring */}
                <Animated.View
                  style={[
                    styles.glowRing,
                    { backgroundColor: theme.accent + '40' },
                    glowAnimatedStyle,
                  ]}
                  pointerEvents="none"
                />

                {/* Flying heart particle */}
                <Animated.View style={[styles.heartParticle, heartAnimatedStyle]} pointerEvents="none">
                  <ThemedText style={styles.heartEmoji}>💚</ThemedText>
                </Animated.View>

                <Animated.View style={[styles.eggContainer, eggAnimatedStyle]}>
                  <View
                    style={[
                      styles.eggVisual,
                      {
                        backgroundColor: isReadyToHatch
                          ? theme.accent + '30'
                          : theme.primary + '30',
                        borderColor: isReadyToHatch ? theme.accent : theme.primary,
                      },
                    ]}
                  >
                    <View style={[styles.eggSpot, { top: '30%', left: '25%', backgroundColor: theme.primary }]} />
                    <View style={[styles.eggSpot, { top: '45%', right: '20%', backgroundColor: theme.secondary }]} />
                    <View style={[styles.eggSpot, { bottom: '25%', left: '45%', backgroundColor: theme.accent }]} />
                    <ThemedText style={styles.eggEmoji}>{stageEmoji}</ThemedText>
                  </View>
                </Animated.View>

                {isReadyToHatch && (
                  <View style={[styles.hatchHint, { backgroundColor: theme.accent }]}>
                    <ThemedText style={styles.hatchHintText}>Tippen zum Schlüpfen!</ThemedText>
                  </View>
                )}
              </View>
            </GestureDetector>

            {!isReadyToHatch && (
              <View style={styles.swipeHint}>
                <ThemedText type="code" style={{ fontSize: 10, color: theme.textSecondary }}>
                  ← Wischen zum Streicheln →
                </ThemedText>
              </View>
            )}
          </View>

          {/* Progress Card */}
          <ThemedView type="card" style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <ThemedText type="smallBold">
                Entwicklungsstufe: {stageLabel} {stageEmoji}
              </ThemedText>
              <ThemedText type="smallBold" themeColor="primary">
                {medizini?.species ?? 'Salbeikauz'}
              </ThemedText>
            </View>

            <View style={[styles.progressBarContainer, { backgroundColor: theme.backgroundElement }]}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: isReadyToHatch ? theme.accent : theme.primary,
                    width: `${progressPercent}%`,
                  },
                ]}
              />
            </View>

            <View style={styles.progressFooter}>
              <ThemedText type="small" themeColor="textSecondary">
                {isReadyToHatch
                  ? 'Bereit zum Schlüpfen! ✨'
                  : `${doseProgress} von ${doseTarget} Einnahmen geschafft`}
              </ThemedText>
              <ThemedText type="small" style={{ fontWeight: 'bold', color: isReadyToHatch ? theme.accent : theme.primary }}>
                {progressPercent}%
              </ThemedText>
            </View>
          </ThemedView>

          {/* Primary CTA */}
          <Pressable
            onPress={() => openOverlay('confirmIntake')}
            disabled={allTakenToday}
            style={({ pressed }) => [
              styles.ctaButton,
              {
                backgroundColor: allTakenToday ? theme.backgroundElement : theme.primary,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <Leaf
              size={20}
              color={allTakenToday ? theme.textSecondary : theme.white}
              style={{ marginRight: Spacing.two }}
            />
            <ThemedText
              type="default"
              style={[
                styles.ctaText,
                { color: allTakenToday ? theme.textSecondary : theme.white },
              ]}
            >
              {allTakenToday
                ? 'Bereits für heute eingenommen ✓'
                : `Heilkräuter ernten · ${dueMedsCount} offen`}
            </ThemedText>
          </Pressable>

          {nextDose && (
            <View style={styles.infoRow}>
              <AlertCircle size={16} color={theme.textSecondary} />
              <ThemedText type="small" themeColor="textSecondary" style={{ marginLeft: Spacing.one }}>
                Nächste Dosis: {nextDose.isTomorrow ? 'Morgen' : 'Heute'}, {nextDose.timeLabel} ({nextDose.name})
              </ThemedText>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <ConfirmIntakeModal />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    maxWidth: MaxContentWidth,
  },
  scrollContent: {
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.five,
    gap: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  titleText: {
    fontWeight: 'bold',
  },
  currencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  npcContainer: {
    padding: Spacing.three,
    borderRadius: Spacing.four,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  npcRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  owlAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  owlAvatarText: {
    fontSize: 24,
  },
  npcSpeechBubble: {
    flex: 1,
    gap: Spacing.half,
  },
  npcMessage: {
    fontStyle: 'italic',
    lineHeight: 18,
  },
  roomContainer: {
    height: 320,
    borderRadius: Spacing.four,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  roomSlots: {
    position: 'absolute',
    top: Spacing.three,
    left: Spacing.three,
    right: Spacing.three,
    flexDirection: 'row',
  },
  decoSlot: {
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.one,
    opacity: 0.8,
  },
  slotEmoji: {
    fontSize: 12,
  },
  decoSlotSpacer: {
    flex: 1,
  },
  eggInteractiveArea: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 220,
    height: 220,
  },
  glowRing: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
  },
  heartParticle: {
    position: 'absolute',
    top: 10,
    zIndex: 10,
  },
  heartEmoji: {
    fontSize: 28,
  },
  eggContainer: {
    width: 140,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eggVisual: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  eggSpot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    opacity: 0.25,
  },
  eggEmoji: {
    fontSize: 80,
    opacity: 0.9,
  },
  hatchHint: {
    position: 'absolute',
    bottom: 4,
    paddingVertical: 4,
    paddingHorizontal: Spacing.two,
    borderRadius: 12,
  },
  hatchHintText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  swipeHint: {
    position: 'absolute',
    bottom: Spacing.two,
  },
  progressCard: {
    padding: Spacing.three,
    borderRadius: Spacing.four,
    gap: Spacing.two,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressBarContainer: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: Spacing.one,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    marginTop: Spacing.one,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  ctaText: {
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
});
