import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Pressable, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Leaf, Lock, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, BottomTabInset, MaxContentWidth } from '@/constants/theme';
import { useAppStore } from '@/store';
import { useUserSettings } from '@/hooks/use-user-settings';
import { useRoomState, type SlotKey } from '@/hooks/use-room-state';
import { useMedizini } from '@/hooks/use-medizini';
import { type MediziniStage } from '@/lib/dose-logic';

type ShopItem = {
  id: string;
  name: string;
  slot: SlotKey;
  cost: number;
  emoji: string;
  description: string;
  requiredStage?: MediziniStage;
};

const SHOP_ITEMS: ShopItem[] = [
  // Bett
  { id: 'b1', name: 'Moosbett', slot: 'Bett', cost: 0, emoji: '🛏️', description: 'Ein weiches, natürliches Bett aus Waldmoos.' },
  { id: 'b2', name: 'Lavendelkissen', slot: 'Bett', cost: 80, emoji: '🛌', description: 'Sorgt für tiefen, ruhigen Schlaf und duftet herrlich.' },
  // Boden
  { id: 'f1', name: 'Rindenboden', slot: 'Boden', cost: 60, emoji: '🪵', description: 'Robuster und natürlicher Holzboden.' },
  { id: 'f2', name: 'Kleeblattteppich', slot: 'Boden', cost: 100, emoji: '🍀', description: 'Bringt Glück und ein sanftes Laufgefühl.', requiredStage: 'Baby' },
  // Wand
  { id: 'w1', name: 'Blättertuch', slot: 'Wand', cost: 45, emoji: '🍃', description: 'Ziert die Wände mit frischem Frühlingsgrün.' },
  { id: 'w2', name: 'Mondstein-Tapete', slot: 'Wand', cost: 110, emoji: '🌙', description: 'Leuchtet sanft in der Nacht und beruhigt den Geist.', requiredStage: 'Child' },
  // Deko
  { id: 'd1', name: 'Salbeipflanze', slot: 'Deko', cost: 30, emoji: '🌿', description: 'Verströmt beruhigende Dämpfe im ganzen Zimmer.' },
  { id: 'd2', name: 'Kristalllampe', slot: 'Deko', cost: 120, emoji: '🔮', description: 'Spendet warmes, magisches Licht für dunkle Nächte.', requiredStage: 'Child' },
];

const STAGE_ORDER: MediziniStage[] = ['Egg', 'Baby', 'Child', 'Teen', 'Adult'];

function isStageUnlocked(required: MediziniStage | undefined, current: MediziniStage): boolean {
  if (!required) return true;
  return STAGE_ORDER.indexOf(current) >= STAGE_ORDER.indexOf(required);
}

export default function ShopScreen() {
  const theme = useTheme();
  const herbBalance = useAppStore((s) => s.herbBalance);
  const { spendHerbs } = useUserSettings();
  const { getSlotItem, placeItem } = useRoomState();
  const { medizini } = useMedizini();
  const currentStage = (medizini?.current_stage ?? 'Egg') as MediziniStage;

  const [activeCategory, setActiveCategory] = useState<SlotKey>('Bett');
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  const categories: SlotKey[] = ['Bett', 'Boden', 'Wand', 'Deko'];
  const filteredItems = SHOP_ITEMS.filter((item) => item.slot === activeCategory);

  const handleBuy = useCallback(async (item: ShopItem) => {
    if (buyingId) return;
    setBuyingId(item.id);
    setErrorId(null);

    const success = await spendHerbs(item.cost);
    if (!success) {
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErrorId(item.id);
      setTimeout(() => setErrorId(null), 2000);
      setBuyingId(null);
      return;
    }

    await placeItem(item.slot, item.id);
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setBuyingId(null);
  }, [buyingId, spendHerbs, placeItem]);

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
              <ThemedText type="small" themeColor="textSecondary">Apotheke & Allerlei</ThemedText>
              <ThemedText type="subtitle" style={styles.titleText}>Kräuter-Basar</ThemedText>
            </View>
            <View style={[styles.currencyBadge, { backgroundColor: theme.backgroundElement }]}>
              <Leaf size={16} color={theme.accent} fill={theme.accent} />
              <ThemedText type="smallBold" style={{ color: theme.text, marginLeft: Spacing.one }}>
                {herbBalance} Kräuter
              </ThemedText>
            </View>
          </View>

          {/* NPC Eule Greeting */}
          <ThemedView type="backgroundElement" style={styles.npcContainer}>
            <View style={styles.npcRow}>
              <View style={[styles.owlAvatar, { backgroundColor: theme.secondary }]}>
                <ThemedText style={styles.owlAvatarText}>🦉</ThemedText>
              </View>
              <View style={styles.npcSpeechBubble}>
                <ThemedText type="smallBold" themeColor="secondary">Verkäuferin Hedwig</ThemedText>
                <ThemedText type="small" themeColor="text" style={styles.npcMessage}>
                  "Willkommen im Kräuter-Basar! Tausche deine Heilkräuter gegen schöne Möbel ein."
                </ThemedText>
              </View>
            </View>
          </ThemedView>

          {/* Category Tabs */}
          <View style={styles.tabsContainer}>
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setActiveCategory(cat)}
                  style={[
                    styles.tabButton,
                    {
                      backgroundColor: isActive ? theme.primary : theme.backgroundElement,
                      borderColor: isActive ? theme.primary : 'transparent',
                    },
                  ]}
                >
                  <ThemedText
                    type="smallBold"
                    style={{ color: isActive ? theme.white : theme.textSecondary }}
                  >
                    {cat}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          {/* Shop Items */}
          <View style={styles.gridContainer}>
            {filteredItems.map((item) => {
              const placedItemId = getSlotItem(item.slot);
              const isPlaced = placedItemId === item.id;
              const isFree = item.cost === 0;
              const unlocked = isStageUnlocked(item.requiredStage, currentStage);
              const canAfford = herbBalance >= item.cost;
              const isLoading = buyingId === item.id;
              const showError = errorId === item.id;

              return (
                <ThemedView key={item.id} type="card" style={styles.itemCard}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.itemEmojiContainer, { backgroundColor: theme.backgroundElement }]}>
                      <ThemedText style={styles.itemEmoji}>{item.emoji}</ThemedText>
                    </View>

                    {!unlocked ? (
                      <View style={[styles.statusBadge, { backgroundColor: theme.backgroundElement }]}>
                        <Lock size={12} color={theme.textSecondary} />
                        <ThemedText type="code" style={{ fontSize: 10, marginLeft: 4, color: theme.textSecondary }}>
                          Ab Stufe: {item.requiredStage}
                        </ThemedText>
                      </View>
                    ) : isPlaced ? (
                      <View style={[styles.statusBadge, { backgroundColor: theme.primary + '15' }]}>
                        <CheckCircle2 size={12} color={theme.primary} />
                        <ThemedText type="code" style={{ fontSize: 10, marginLeft: 4, color: theme.primary, fontWeight: 'bold' }}>
                          Platziert
                        </ThemedText>
                      </View>
                    ) : (
                      <View style={[styles.priceBadge, { backgroundColor: isFree ? theme.primary + '15' : theme.accent + '15' }]}>
                        {isFree ? (
                          <ThemedText type="code" style={{ fontSize: 10, color: theme.primary, fontWeight: 'bold' }}>Gratis</ThemedText>
                        ) : (
                          <>
                            <Leaf size={12} color={theme.accent} fill={theme.accent} />
                            <ThemedText type="smallBold" style={{ color: canAfford ? theme.text : theme.danger, marginLeft: 4 }}>
                              {item.cost}
                            </ThemedText>
                          </>
                        )}
                      </View>
                    )}
                  </View>

                  <View style={styles.cardBody}>
                    <ThemedText type="default" style={{ fontWeight: 'bold' }}>{item.name}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
                      {item.description}
                    </ThemedText>
                  </View>

                  {showError && (
                    <View style={[styles.errorRow, { backgroundColor: theme.danger + '15' }]}>
                      <AlertCircle size={12} color={theme.danger} />
                      <ThemedText type="code" style={{ fontSize: 11, color: theme.danger, marginLeft: 4 }}>
                        Nicht genug Kräuter!
      </ThemedText>
                    </View>
                  )}

                  <Pressable
                    disabled={!unlocked || isPlaced || isLoading}
                    onPress={() => handleBuy(item)}
                    style={({ pressed }) => [
                      styles.actionBtn,
                      {
                        backgroundColor: !unlocked
                          ? theme.backgroundElement
                          : isPlaced
                          ? theme.backgroundSelected
                          : isLoading
                          ? theme.backgroundElement
                          : theme.primary,
                        opacity: pressed ? 0.9 : 1,
                      },
                    ]}
                  >
                    {!isPlaced && unlocked && !isLoading && (
                      <ShoppingBag size={14} color={theme.white} style={{ marginRight: 6 }} />
                    )}
                    <ThemedText
                      type="smallBold"
                      style={{
                        color: !unlocked
                          ? theme.textSecondary
                          : isPlaced
                          ? theme.text
                          : isLoading
                          ? theme.textSecondary
                          : theme.white,
                      }}
                    >
                      {!unlocked
                        ? 'Gesperrt'
                        : isPlaced
                        ? 'Bereits platziert'
                        : isLoading
                        ? 'Wird gekauft…'
                        : isFree
                        ? 'Gratis platzieren'
                        : 'Kaufen & Platzieren'}
                    </ThemedText>
                  </Pressable>
                </ThemedView>
              );
            })}
          </View>

          <View style={styles.infoRow}>
            <AlertCircle size={14} color={theme.textSecondary} />
            <ThemedText type="small" themeColor="textSecondary" style={{ marginLeft: Spacing.one }}>
              Neue Gegenstände schalten sich frei, wenn dein Medizini wächst.
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
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: 1,
  },
  gridContainer: {
    gap: Spacing.three,
  },
  itemCard: {
    padding: Spacing.three,
    borderRadius: Spacing.four,
    gap: Spacing.three,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemEmojiContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemEmoji: {
    fontSize: 24,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  priceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  cardBody: {
    gap: Spacing.half,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.two,
    borderRadius: Spacing.two,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
});
