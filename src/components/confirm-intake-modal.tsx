import React, { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Leaf, Check, X, AlertTriangle } from 'lucide-react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { useMedications } from '@/hooks/use-medications';
import { useMedizini } from '@/hooks/use-medizini';
import { useUserSettings } from '@/hooks/use-user-settings';
import { useAppStore } from '@/store';
import { isDoseTakenToday, STAGE_EMOJIS, STAGE_LABELS, type MediziniStage } from '@/lib/dose-logic';

const HERBS_PER_MED = 3;

export function ConfirmIntakeModal() {
  const theme = useTheme();
  const { activeOverlay, closeOverlay } = useAppStore();
  const { medications, confirmIntake } = useMedications();
  const { confirmDoseProgress } = useMedizini();
  const { settings, earnHerbs } = useUserSettings();

  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [phase, setPhase] = useState<'select' | 'success'>('select');
  const [earnedHerbs, setEarnedHerbs] = useState(0);
  const [newStage, setNewStage] = useState<MediziniStage | null>(null);

  const successScale = useSharedValue(0.8);
  const successOpacity = useSharedValue(0);

  const cutoffHour = settings?.day_cutoff_hour ?? 4;

  const dueMeds = medications.filter(
    (m) => !isDoseTakenToday(m.last_taken_at as Date | null, cutoffHour)
  );
  const allTakenToday = dueMeds.length === 0 && medications.length > 0;

  // Reset state when modal opens
  useEffect(() => {
    if (activeOverlay === 'confirmIntake') {
      setCheckedIds(new Set());
      setPhase('select');
      setEarnedHerbs(0);
      setNewStage(null);
    }
  }, [activeOverlay]);

  const toggleMed = (id: number) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setCheckedIds(new Set(dueMeds.map((m) => m.id)));
  };

  const handleConfirm = useCallback(async () => {
    if (checkedIds.size === 0) return;

    // Decrement stock for each confirmed medication
    for (const id of checkedIds) {
      await confirmIntake(id);
    }

    // Advance medizini progress once per confirmed medication
    const { advanced, newStage: stage } = await confirmDoseProgress(checkedIds.size);
    if (advanced && stage) setNewStage(stage);

    // Award herbs
    const herbs = HERBS_PER_MED * checkedIds.size;
    await earnHerbs(herbs);
    setEarnedHerbs(herbs);

    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Animate success screen in
    successScale.value = withSpring(1, { damping: 12 });
    successOpacity.value = withTiming(1, { duration: 300 });
    setPhase('success');
  }, [checkedIds, confirmIntake, confirmDoseProgress, earnHerbs]);

  const successAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
    opacity: successOpacity.value,
  }));

  if (activeOverlay !== 'confirmIntake') return null;

  return (
    <Modal
      transparent
      animationType="slide"
      visible
      onRequestClose={closeOverlay}
    >
      <View style={styles.backdrop}>
        <ThemedView style={[styles.sheet, { borderColor: theme.backgroundElement }]}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="subtitle" style={styles.headerTitle}>
              {phase === 'success' ? '🌿 Heilkräuter geerntet!' : '💊 Einnahme bestätigen'}
            </ThemedText>
            <Pressable onPress={closeOverlay} style={styles.closeBtn} hitSlop={8}>
              <X size={20} color={theme.textSecondary} />
            </Pressable>
          </View>

          {phase === 'select' ? (
            <>
              {/* Owl NPC hint */}
              <View style={[styles.owlHint, { backgroundColor: theme.backgroundElement }]}>
                <ThemedText style={styles.owlEmoji}>🦉</ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.owlText}>
                  {allTakenToday
                    ? 'Alle Medikamente für heute erledigt. Gut gemacht!'
                    : 'Wähle aus, welche Medikamente du gerade genommen hast.'}
                </ThemedText>
              </View>

              {allTakenToday ? (
                <View style={styles.allDoneContainer}>
                  <ThemedText style={{ fontSize: 40 }}>✅</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.allDoneText}>
                    Bis morgen früh nach {cutoffHour}:00 Uhr!
                  </ThemedText>
                </View>
              ) : (
                <>
                  <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                    {dueMeds.map((med) => {
                      const checked = checkedIds.has(med.id);
                      return (
                        <Pressable
                          key={med.id}
                          onPress={() => toggleMed(med.id)}
                          style={({ pressed }) => [
                            styles.medRow,
                            {
                              backgroundColor: checked
                                ? theme.primary + '18'
                                : theme.backgroundElement,
                              borderColor: checked ? theme.primary : 'transparent',
                              opacity: pressed ? 0.85 : 1,
                            },
                          ]}
                        >
                          <View
                            style={[
                              styles.checkbox,
                              {
                                backgroundColor: checked ? theme.primary : theme.card,
                                borderColor: checked ? theme.primary : theme.textSecondary,
                              },
                            ]}
                          >
                            {checked && <Check size={14} color={theme.white} strokeWidth={3} />}
                          </View>
                          <View style={styles.medInfo}>
                            <ThemedText type="smallBold">{med.name}</ThemedText>
                            {med.reminder_times.length > 0 && (
                              <ThemedText type="small" themeColor="textSecondary">
                                {med.reminder_times.join(', ')} Uhr
                              </ThemedText>
                            )}
                          </View>
                          {med.isLowStock && (
                            <AlertTriangle size={16} color={theme.danger} />
                          )}
                          <View style={styles.herbReward}>
                            <Leaf size={12} color={theme.accent} fill={theme.accent} />
                            <ThemedText type="small" style={{ color: theme.accent, marginLeft: 2 }}>
                              +{HERBS_PER_MED}
                            </ThemedText>
                          </View>
                        </Pressable>
                      );
                    })}
                  </ScrollView>

                  {dueMeds.length > 1 && (
                    <Pressable onPress={selectAll} style={styles.selectAllBtn}>
                      <ThemedText type="small" themeColor="primary">
                        Alle auswählen
                      </ThemedText>
                    </Pressable>
                  )}

                  <Pressable
                    onPress={handleConfirm}
                    disabled={checkedIds.size === 0}
                    style={({ pressed }) => [
                      styles.confirmBtn,
                      {
                        backgroundColor:
                          checkedIds.size === 0 ? theme.backgroundElement : theme.primary,
                        opacity: pressed ? 0.9 : 1,
                      },
                    ]}
                  >
                    <Leaf size={18} color={checkedIds.size === 0 ? theme.textSecondary : theme.white} />
                    <ThemedText
                      type="default"
                      style={[
                        styles.confirmBtnText,
                        { color: checkedIds.size === 0 ? theme.textSecondary : theme.white },
                      ]}
                    >
                      {checkedIds.size === 0
                        ? 'Medikament auswählen'
                        : `${checkedIds.size} bestätigen · +${checkedIds.size * HERBS_PER_MED} 🌿`}
                    </ThemedText>
                  </Pressable>
                </>
              )}
            </>
          ) : (
            // Success screen
            <Animated.View style={[styles.successContainer, successAnimStyle]}>
              <ThemedText style={styles.successEmoji}>🌿</ThemedText>
              <ThemedText type="subtitle" style={styles.successTitle}>
                +{earnedHerbs} Heilkräuter
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.successSub}>
                Dein Medizini wächst!
              </ThemedText>

              {newStage && (
                <View style={[styles.stageUpBadge, { backgroundColor: theme.accent + '22', borderColor: theme.accent }]}>
                  <ThemedText style={{ fontSize: 28 }}>
                    {STAGE_EMOJIS[newStage]}
                  </ThemedText>
                  <ThemedText type="smallBold" style={{ color: theme.accent }}>
                    Neue Stufe: {STAGE_LABELS[newStage]}!
                  </ThemedText>
                </View>
              )}

              <Pressable
                onPress={closeOverlay}
                style={[styles.confirmBtn, { backgroundColor: theme.primary, marginTop: Spacing.four }]}
              >
                <ThemedText type="default" style={[styles.confirmBtnText, { color: theme.white }]}>
                  Schließen
                </ThemedText>
              </Pressable>
            </Animated.View>
          )}
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    padding: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: Spacing.one,
  },
  owlHint: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.two,
    borderRadius: Spacing.two,
    gap: Spacing.two,
  },
  owlEmoji: {
    fontSize: 20,
  },
  owlText: {
    flex: 1,
    lineHeight: 18,
  },
  allDoneContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.five,
    gap: Spacing.two,
  },
  allDoneText: {
    textAlign: 'center',
  },
  list: {
    maxHeight: 300,
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    marginBottom: Spacing.two,
    gap: Spacing.two,
    borderWidth: 1.5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medInfo: {
    flex: 1,
    gap: 2,
  },
  herbReward: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllBtn: {
    alignSelf: 'flex-end',
    paddingVertical: Spacing.one,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  confirmBtnText: {
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.four,
    gap: Spacing.two,
  },
  successEmoji: {
    fontSize: 56,
  },
  successTitle: {
    fontWeight: 'bold',
  },
  successSub: {
    textAlign: 'center',
  },
  stageUpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1.5,
    marginTop: Spacing.two,
  },
});
