import React, { useEffect } from 'react';
import { StyleSheet, View, Pressable, ScrollView, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence, 
  withRepeat,
  Easing
} from 'react-native-reanimated';
import { Leaf, Gift, AlertCircle, Heart } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, BottomTabInset, MaxContentWidth } from '@/constants/theme';

export default function ZimmerScreen() {
  const theme = useTheme();
  
  // Animation values for the Egg
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  
  // Wobble animation when clicking on the Egg or on mount
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

  useEffect(() => {
    // Initial gentle pulsing of the egg
    scale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 1200, easing: Easing.ease }),
        withTiming(1, { duration: 1200, easing: Easing.ease })
      ),
      -1,
      true
    );
  }, []);

  const eggAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ]
    };
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Header Bar */}
          <View style={styles.header}>
            <View>
              <ThemedText type="small" themeColor="textSecondary">Guten Morgen ✨</ThemedText>
              <ThemedText type="subtitle" style={styles.titleText}>Dein Zimmer</ThemedText>
            </View>
            <View style={[styles.currencyBadge, { backgroundColor: theme.backgroundElement }]}>
              <Leaf size={16} color={theme.accent} fill={theme.accent} />
              <ThemedText type="smallBold" style={{ color: theme.text, marginLeft: Spacing.one }}>
                120 Kräuter
              </ThemedText>
            </View>
          </View>

          {/* Owl NPC Dialog Box */}
          <ThemedView type="backgroundElement" style={styles.npcContainer}>
            <View style={styles.npcRow}>
              <View style={[styles.owlAvatar, { backgroundColor: theme.primary }]}>
                <ThemedText style={styles.owlAvatarText}>🦉</ThemedText>
              </View>
              <View style={styles.npcSpeechBubble}>
                <ThemedText type="smallBold" themeColor="primary">Eule Hedwig</ThemedText>
                <ThemedText type="small" themeColor="text" style={styles.npcMessage}>
                  "Hallo Abenteurer! Dein Ei schläft friedlich. Wenn du heute deine Heilenergie sammelst, wächst es ein Stückchen weiter!"
                </ThemedText>
              </View>
            </View>
          </ThemedView>

          {/* MediziniRoom Visual Area */}
          <View style={[styles.roomContainer, { borderColor: theme.backgroundElement }]}>
            {/* Visual Slots Placeholder representing room deco */}
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

            {/* Centered egg */}
            <Pressable onPress={triggerWobble} style={styles.eggInteractiveArea}>
              <Animated.View style={[styles.eggContainer, eggAnimatedStyle]}>
                {/* Visual Egg with HSL Sage-Green styling gradients */}
                <View style={[styles.eggVisual, { backgroundColor: theme.primary + '30', borderColor: theme.primary }]}>
                  {/* Spots on egg */}
                  <View style={[styles.eggSpot, { top: '30%', left: '25%', backgroundColor: theme.primary }]} />
                  <View style={[styles.eggSpot, { top: '45%', right: '20%', backgroundColor: theme.secondary }]} />
                  <View style={[styles.eggSpot, { bottom: '25%', left: '45%', backgroundColor: theme.accent }]} />
                  <ThemedText style={styles.eggEmoji}>🥚</ThemedText>
                </View>
              </Animated.View>
            </Pressable>

            {/* Interaction floating buttons */}
            <View style={styles.roomInteractions}>
              <Pressable onPress={triggerWobble} style={[styles.interactionBtn, { backgroundColor: theme.card }]}>
                <Heart size={18} color={theme.danger} fill={theme.danger} />
                <ThemedText type="small" style={{ marginLeft: Spacing.one }}>Streicheln</ThemedText>
              </Pressable>
            </View>
          </View>

          {/* Progress / Goal Tracking Card */}
          <ThemedView type="card" style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <ThemedText type="smallBold">Entwicklungsstufe: Ei 🥚</ThemedText>
              <ThemedText type="smallBold" themeColor="primary">V1: Salbeikauz</ThemedText>
            </View>

            <View style={[styles.progressBarContainer, { backgroundColor: theme.backgroundElement }]}>
              <View style={[styles.progressBarFill, { backgroundColor: theme.primary, width: '42%' }]} />
            </View>

            <View style={styles.progressFooter}>
              <ThemedText type="small" themeColor="textSecondary">6 von 14 Einnahmen geschafft</ThemedText>
              <ThemedText type="small" themeColor="primary" style={{ fontWeight: 'bold' }}>42%</ThemedText>
            </View>
          </ThemedView>

          {/* Collect Medicine Energy Button (Primary CTA) */}
          <Pressable 
            onPress={triggerWobble}
            style={({ pressed }) => [
              styles.ctaButton, 
              { backgroundColor: theme.primary, opacity: pressed ? 0.9 : 1 }
            ]}
          >
            <Leaf size={20} color={theme.white} style={{ marginRight: Spacing.two }} />
            <ThemedText type="default" style={[styles.ctaText, { color: theme.white }]}>
              Heilkräuter ernten (Einnahme bestätigen)
            </ThemedText>
          </Pressable>

          <View style={styles.infoRow}>
            <AlertCircle size={16} color={theme.textSecondary} />
            <ThemedText type="small" themeColor="textSecondary" style={{ marginLeft: Spacing.one }}>
              Nächste Dosis fällig: Heute, 08:00 Uhr (L-Thyroxin)
            </ThemedText>
          </View>

        </ScrollView>
      </SafeAreaView>
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
    height: 300,
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
    width: 200,
    height: 200,
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
  roomInteractions: {
    position: 'absolute',
    bottom: Spacing.three,
    flexDirection: 'row',
    gap: Spacing.two,
  },
  interactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
