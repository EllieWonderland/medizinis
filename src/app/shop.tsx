import React, { useState } from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Leaf, Lock, CheckCircle2, AlertCircle } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, BottomTabInset, MaxContentWidth } from '@/constants/theme';
import { useAppStore } from '@/store';

export default function ShopScreen() {
  const theme = useTheme();
  const herbBalance = useAppStore((s) => s.herbBalance);
  const [activeCategory, setActiveCategory] = useState<'Bett' | 'Boden' | 'Wand' | 'Deko'>('Bett');
  
  // Custom categories list
  const categories: ('Bett' | 'Boden' | 'Wand' | 'Deko')[] = ['Bett', 'Boden', 'Wand', 'Deko'];

  // Mock list of shop items
  const shopItems = [
    // Bett Category
    {
      id: 'b1',
      name: 'Moosbett',
      category: 'Bett',
      cost: 50,
      emoji: '🛏️',
      description: 'Ein weiches, natürliches Bett aus Waldmoos.',
      unlocked: true,
      purchased: true,
    },
    {
      id: 'b2',
      name: 'Lavendelkissen',
      category: 'Bett',
      cost: 80,
      emoji: '🛌',
      description: 'Sorgt für tiefen, ruhigen Schlaf und duftet herrlich.',
      unlocked: true,
      purchased: false,
    },
    // Boden Category
    {
      id: 'f1',
      name: 'Rindenboden',
      category: 'Boden',
      cost: 60,
      emoji: '🪵',
      description: 'Robuster und natürlicher Holzboden.',
      unlocked: true,
      purchased: false,
    },
    {
      id: 'f2',
      name: 'Kleeblattteppich',
      category: 'Boden',
      cost: 100,
      emoji: '🍀',
      description: 'Bringt Glück und ein sanftes Laufgefühl.',
      unlocked: false, // Locked until Baby stage
      requiredStage: 'Baby',
      purchased: false,
    },
    // Wand Category
    {
      id: 'w1',
      name: 'Blättertuch',
      category: 'Wand',
      cost: 45,
      emoji: '🍃',
      description: 'Ziert die Wände mit frischem Frühlingsgrün.',
      unlocked: true,
      purchased: false,
    },
    // Deko Category
    {
      id: 'd1',
      name: 'Salbeipflanze',
      category: 'Deko',
      cost: 30,
      emoji: '🌿',
      description: 'Verströmt beruhigende Dämpfe im ganzen Zimmer.',
      unlocked: true,
      purchased: false,
    },
    {
      id: 'd2',
      name: 'Kristalllampe',
      category: 'Deko',
      cost: 120,
      emoji: '🔮',
      description: 'Spendet warmes, magisches Licht für dunkle Nächte.',
      unlocked: false, // Locked until Child stage
      requiredStage: 'Kind',
      purchased: false,
    }
  ];

  // Filter items based on active category
  const filteredItems = shopItems.filter(item => item.category === activeCategory);

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
                  "Willkommen im Kräuter-Basar, Reisender! Tausche deine geernteten Heilkräuter gegen schöne Möbel ein, um das Zimmer deines Medizinis zu verschönern!"
                </ThemedText>
              </View>
            </View>
          </ThemedView>

          {/* Category Tabs */}
          <View style={styles.tabsContainer}>
            {categories.map(cat => {
              const isActive = activeCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setActiveCategory(cat)}
                  style={[
                    styles.tabButton,
                    { 
                      backgroundColor: isActive ? theme.primary : theme.backgroundElement,
                      borderColor: isActive ? theme.primary : 'transparent'
                    }
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

          {/* Shop Items List/Grid */}
          <View style={styles.gridContainer}>
            {filteredItems.map(item => {
              return (
                <ThemedView key={item.id} type="card" style={styles.itemCard}>
                  {/* Top Row: Icon and Status */}
                  <View style={styles.cardHeader}>
                    <View style={[styles.itemEmojiContainer, { backgroundColor: theme.backgroundElement }]}>
                      <ThemedText style={styles.itemEmoji}>{item.emoji}</ThemedText>
                    </View>
                    
                    {!item.unlocked ? (
                      <View style={[styles.statusBadge, { backgroundColor: theme.backgroundElement }]}>
                        <Lock size={12} color={theme.textSecondary} />
                        <ThemedText type="code" style={{ fontSize: 10, marginLeft: 4, color: theme.textSecondary }}>
                          Sperre: {item.requiredStage}
                        </ThemedText>
                      </View>
                    ) : item.purchased ? (
                      <View style={[styles.statusBadge, { backgroundColor: theme.primary + '15' }]}>
                        <CheckCircle2 size={12} color={theme.primary} />
                        <ThemedText type="code" style={{ fontSize: 10, marginLeft: 4, color: theme.primary, fontWeight: 'bold' }}>
                          Gekauft
                        </ThemedText>
                      </View>
                    ) : (
                      <View style={[styles.priceBadge, { backgroundColor: theme.accent + '15' }]}>
                        <Leaf size={12} color={theme.accent} fill={theme.accent} />
                        <ThemedText type="smallBold" style={{ color: theme.text, marginLeft: 4 }}>
                          {item.cost}
                        </ThemedText>
                      </View>
                    )}
                  </View>

                  {/* Info details */}
                  <View style={styles.cardBody}>
                    <ThemedText type="default" style={{ fontWeight: 'bold' }}>{item.name}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
                      {item.description}
                    </ThemedText>
                  </View>

                  {/* Buy / Action Button */}
                  <Pressable 
                    disabled={!item.unlocked || item.purchased}
                    style={({ pressed }) => [
                      styles.actionBtn, 
                      { 
                        backgroundColor: !item.unlocked 
                          ? theme.backgroundElement 
                          : item.purchased 
                          ? theme.backgroundSelected 
                          : theme.primary,
                        opacity: pressed ? 0.9 : 1
                      }
                    ]}
                  >
                    <ThemedText 
                      type="smallBold" 
                      style={{ 
                        color: !item.unlocked 
                          ? theme.textSecondary 
                          : item.purchased 
                          ? theme.text 
                          : theme.white 
                      }}
                    >
                      {!item.unlocked 
                        ? 'Gesperrt' 
                        : item.purchased 
                        ? 'Bereits platziert' 
                        : 'Kaufen & Platzieren'
                      }
                    </ThemedText>
                  </Pressable>
                </ThemedView>
              );
            })}
          </View>

          <View style={styles.infoRow}>
            <AlertCircle size={14} color={theme.textSecondary} />
            <ThemedText type="small" themeColor="textSecondary" style={{ marginLeft: Spacing.one }}>
              Neue Gegenstände werden freigeschaltet, sobald dein Medizini wächst.
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
  actionBtn: {
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
