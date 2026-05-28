import React, { useState } from 'react';
import { StyleSheet, View, Pressable, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Award, Info, Lock, X, Check } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, BottomTabInset, MaxContentWidth } from '@/constants/theme';

export default function MediziniBuchScreen() {
  const theme = useTheme();
  const [selectedPet, setSelectedPet] = useState<any | null>(null);

  // Mock list of all Wesen in the book
  const medizinis = [
    {
      id: 'm1',
      name: 'Salbeikauz',
      scientificName: 'Strix Salvia',
      emoji: '🦉',
      discovered: true,
      description: 'Ein flauschiges Wesen, das in der Nähe von Salbeifeldern lebt. Es verströmt beruhigende Aura und liebt es, gestreichelt zu werden. Es erinnert dich treu an deine Aufgaben.',
      stage: 'Ei / Baby',
      retired: false,
      lore: 'Der Salbeikauz nistet am liebsten in warmen Nischen von Medizinschränken. Seine weichen Federn glänzen grünlich im Mondlicht. Er schlüpft aus salbeifarbenen Eiern und wächst heran, um ein verlässlicher Partner zu werden.',
      stats: {
        'Element': 'Natur / Ruhe 🌿',
        'Lieblingsessen': 'Kamillenblüten 🌼',
        'Fundort': 'Anfangs-Ei 🥚'
      }
    },
    {
      id: 'm2',
      name: 'Baldrianbär',
      scientificName: 'Ursus Valeriana',
      emoji: '🐻',
      discovered: false, // Silhouette
      description: 'Ein verschlafener Bär, dessen Fell nach Baldrian duftet. Seine Anwesenheit vertreibt jede nächtliche Unruhe.',
      stage: 'Unbekannt',
      retired: false,
      lore: 'Es heißt, der Baldrianbär schläft 23 Stunden am Tag. Wer sein Vertrauen gewinnt, darf sich an sein weiches, schlafförderndes Fell kuscheln.',
      stats: {}
    },
    {
      id: 'm3',
      name: 'Lavendelluchs',
      scientificName: 'Lynx Lavandula',
      emoji: '🐱',
      discovered: false, // Silhouette
      description: 'Ein graziles Wesen, das mit eleganten Sprüngen durch lilafarbene Felder zieht. Seine Aura schenkt Gelassenheit.',
      stage: 'Unbekannt',
      retired: false,
      lore: 'Der Lavendelluchs taucht nur in Momenten tiefster Entspannung auf. Seine Schnurrhaare vibrieren im Takt beruhigender Gedanken.',
      stats: {}
    },
    {
      id: 'm4',
      name: 'Kamillenkröte',
      scientificName: 'Bufo Chamomilla',
      emoji: '🐸',
      discovered: false, // Silhouette
      description: 'Eine weise Kröte, die auf großen Kamillenblättern thront und heilende Tinkturen brauen kann.',
      stage: 'Unbekannt',
      retired: false,
      lore: 'Die Kamillenkröte spricht in Rätseln, aber ihre Kamillentee-Aufgüsse kurieren jeden Kummer und besänftigen den Magen.',
      stats: {}
    }
  ];

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
              <ThemedText type="small" themeColor="textSecondary">Sammlung</ThemedText>
              <ThemedText type="subtitle" style={styles.titleText}>Medizini-Buch</ThemedText>
            </View>
            <View style={[styles.statsBadge, { backgroundColor: theme.backgroundElement }]}>
              <Award size={16} color={theme.primary} />
              <ThemedText type="smallBold" style={{ color: theme.text, marginLeft: Spacing.one }}>
                1 / 4 Entdeckt
              </ThemedText>
            </View>
          </View>

          {/* Book Intro Quote */}
          <ThemedView type="backgroundElement" style={styles.introContainer}>
            <View style={styles.introRow}>
              <BookOpen size={24} color={theme.primary} />
              <ThemedText type="small" themeColor="textSecondary" style={styles.introText}>
                Das alte Archiv der Heilwesen. Jedes ausgewachsene Medizini, das in den Ruhestand zieht, hinterlässt hier seine Geschichte und sein eingerichtetes Zimmer.
              </ThemedText>
            </View>
          </ThemedView>

          {/* Wesen Grid */}
          <View style={styles.grid}>
            {medizinis.map(pet => {
              return (
                <Pressable
                  key={pet.id}
                  onPress={() => pet.discovered && setSelectedPet(pet)}
                  style={({ pressed }) => [
                    styles.gridItem,
                    { 
                      backgroundColor: theme.card,
                      borderColor: pet.discovered ? theme.primary : theme.backgroundElement,
                      opacity: pressed && pet.discovered ? 0.9 : 1
                    }
                  ]}
                >
                  <View style={[
                    styles.emojiContainer, 
                    { backgroundColor: pet.discovered ? theme.primary + '10' : theme.backgroundElement }
                  ]}>
                    <ThemedText style={[
                      styles.petEmoji, 
                      { opacity: pet.discovered ? 1 : 0.15 }
                    ]}>
                      {pet.emoji}
                    </ThemedText>
                    {!pet.discovered && (
                      <View style={styles.lockOverlay}>
                        <Lock size={16} color={theme.textSecondary} />
                      </View>
                    )}
                  </View>

                  <ThemedText 
                    type="smallBold" 
                    style={{ 
                      textAlign: 'center', 
                      marginTop: Spacing.one,
                      color: pet.discovered ? theme.text : theme.textSecondary 
                    }}
                  >
                    {pet.discovered ? pet.name : '???'}
                  </ThemedText>
                  
                  <ThemedText type="code" style={{ fontSize: 10, color: theme.textSecondary }}>
                    {pet.discovered ? pet.scientificName : 'Undentdeckt'}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          {/* Detailed Wesen Modal Block */}
          {selectedPet && (
            <ThemedView type="card" style={[styles.detailCard, { borderColor: theme.primary }]}>
              {/* Header */}
              <View style={styles.detailHeader}>
                <View style={styles.detailTitleRow}>
                  <View style={[styles.titleEmojiBg, { backgroundColor: theme.primary + '15' }]}>
                    <ThemedText style={{ fontSize: 24 }}>{selectedPet.emoji}</ThemedText>
                  </View>
                  <View>
                    <ThemedText type="default" style={{ fontWeight: 'bold' }}>{selectedPet.name}</ThemedText>
                    <ThemedText type="code" style={{ fontSize: 11, color: theme.primary }}>
                      {selectedPet.scientificName}
                    </ThemedText>
                  </View>
                </View>
                <Pressable onPress={() => setSelectedPet(null)} style={styles.closeBtn}>
                  <X size={18} color={theme.text} />
                </Pressable>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.backgroundElement }]} />

              {/* Body scroll */}
              <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={true}>
                <ThemedText type="small" style={{ lineHeight: 20, marginBottom: Spacing.two }}>
                  {selectedPet.description}
                </ThemedText>

                <ThemedText type="smallBold" themeColor="primary" style={styles.subTitle}>
                  Legende & Herkunft
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={{ lineHeight: 18, marginBottom: Spacing.two }}>
                  {selectedPet.lore}
                </ThemedText>

                <ThemedText type="smallBold" themeColor="primary" style={styles.subTitle}>
                  Attribute
                </ThemedText>
                
                <View style={styles.statsContainer}>
                  {Object.entries(selectedPet.stats).map(([key, val]) => (
                    <View key={key} style={styles.statRow}>
                      <ThemedText type="code" style={{ color: theme.textSecondary }}>{key}:</ThemedText>
                      <ThemedText type="smallBold" style={{ fontSize: 12 }}>{val as string}</ThemedText>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </ThemedView>
          )}

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
  statsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 20,
  },
  introContainer: {
    padding: Spacing.three,
    borderRadius: Spacing.four,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  introRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  introText: {
    flex: 1,
    lineHeight: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '47%',
    borderRadius: Spacing.four,
    borderWidth: 1.5,
    padding: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.half,
  },
  emojiContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  petEmoji: {
    fontSize: 38,
  },
  lockOverlay: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    right: 0,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  detailCard: {
    padding: Spacing.three,
    borderRadius: Spacing.four,
    borderWidth: 1.5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  titleEmojiBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    padding: 4,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.two,
  },
  detailScroll: {
    height: 250,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: Spacing.one,
  },
  statsContainer: {
    gap: Spacing.one,
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: Spacing.two,
    borderRadius: Spacing.two,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
