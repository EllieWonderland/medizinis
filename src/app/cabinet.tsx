import React, { useState } from 'react';
import { StyleSheet, View, Pressable, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pill, Plus, Calendar, FileText, ChevronRight, AlertTriangle, Eye, X } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, BottomTabInset, MaxContentWidth } from '@/constants/theme';

export default function MedizinschrankScreen() {
  const theme = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLeaflet, setShowLeaflet] = useState(false);

  // Mock list of active medications
  const medications = [
    {
      id: 1,
      name: 'L-Thyroxin 50µg',
      reminder_times: ['08:00 Uhr'],
      package_size: 50,
      current_stock: 25,
      has_leaflet: true,
    },
    {
      id: 2,
      name: 'Methylphenidat 18mg',
      reminder_times: ['08:30 Uhr', '13:30 Uhr'],
      package_size: 30,
      current_stock: 5, // Alert level!
      has_leaflet: false,
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
              <ThemedText type="small" themeColor="textSecondary">Übersicht</ThemedText>
              <ThemedText type="subtitle" style={styles.titleText}>Medizinschrank</ThemedText>
            </View>
            
            {/* Add medication action */}
            <Pressable 
              onPress={() => setShowAddModal(true)}
              style={({ pressed }) => [
                styles.addBadge, 
                { backgroundColor: theme.primary, opacity: pressed ? 0.9 : 1 }
              ]}
            >
              <Plus size={16} color={theme.white} />
              <ThemedText type="smallBold" style={{ color: theme.white, marginLeft: Spacing.one }}>
                Neu
              </ThemedText>
            </Pressable>
          </View>

          {/* Quick Statistics Banner */}
          <ThemedView type="backgroundElement" style={styles.statsBanner}>
            <View style={styles.statItem}>
              <ThemedText type="subtitle" style={{ color: theme.primary, fontWeight: 'bold' }}>2</ThemedText>
              <ThemedText type="code">Aktiv</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <ThemedText type="subtitle" style={{ color: theme.danger, fontWeight: 'bold' }}>1</ThemedText>
              <ThemedText type="code">Refill nötig</ThemedText>
            </View>
          </ThemedView>

          {/* Medication List */}
          <View style={styles.sectionContainer}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
              MEINE MEDIKAMENTE
            </ThemedText>

            {medications.map(med => {
              const isLowStock = med.current_stock <= 5;
              return (
                <ThemedView key={med.id} type="card" style={styles.medCard}>
                  <View style={styles.medHeader}>
                    <View style={[styles.pillIconBg, { backgroundColor: theme.primary + '15' }]}>
                      <Pill size={20} color={theme.primary} />
                    </View>
                    <View style={styles.medDetails}>
                      <ThemedText type="default" style={{ fontWeight: 'bold' }}>{med.name}</ThemedText>
                      <View style={styles.timesContainer}>
                        <Calendar size={12} color={theme.textSecondary} />
                        <ThemedText type="small" themeColor="textSecondary" style={{ marginLeft: 4 }}>
                          {med.reminder_times.join(', ')}
                        </ThemedText>
                      </View>
                    </View>
                    <ChevronRight size={18} color={theme.textSecondary} />
                  </View>

                  <View style={[styles.cardDivider, { backgroundColor: theme.backgroundElement }]} />

                  {/* Stock tracking & Action rows */}
                  <View style={styles.medFooter}>
                    <View style={styles.stockRow}>
                      <ThemedText type="small" themeColor="textSecondary">Vorrat:</ThemedText>
                      <ThemedText type="smallBold" style={{ color: isLowStock ? theme.danger : theme.text }}>
                        {med.current_stock} von {med.package_size} Pille(n)
                      </ThemedText>
                      {isLowStock && (
                        <View style={[styles.warningBadge, { backgroundColor: theme.danger + '15' }]}>
                          <AlertTriangle size={10} color={theme.danger} />
                          <ThemedText type="code" style={{ color: theme.danger, fontSize: 10, marginLeft: 2 }}>
                            Fast leer!
                          </ThemedText>
                        </View>
                      )}
                    </View>

                    {med.has_leaflet && (
                      <Pressable 
                        onPress={() => setShowLeaflet(true)}
                        style={({ pressed }) => [
                          styles.leafletBtn, 
                          { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.8 : 1 }
                        ]}
                      >
                        <FileText size={12} color={theme.text} />
                        <ThemedText type="code" style={{ marginLeft: 4 }}>Beipackzettel</ThemedText>
                      </Pressable>
                    )}
                  </View>
                </ThemedView>
              );
            })}
          </View>

          {/* Mock Leaflet Preview Modal/Block */}
          {showLeaflet && (
            <ThemedView type="card" style={[styles.leafletModal, { borderColor: theme.primary }]}>
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FileText size={18} color={theme.primary} />
                  <ThemedText type="default" style={{ fontWeight: 'bold', marginLeft: 8 }}>
                    Beipackzettel: L-Thyroxin
                  </ThemedText>
                </View>
                <Pressable onPress={() => setShowLeaflet(false)} style={styles.closeBtn}>
                  <X size={18} color={theme.text} />
                </Pressable>
              </View>
              
              <ScrollView style={styles.leafletTextScroll} showsVerticalScrollIndicator={true}>
                <ThemedText type="smallBold" themeColor="primary" style={{ marginBottom: 4 }}>
                  1. Was ist L-Thyroxin und wofür wird es angewendet?
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={{ marginBottom: 12 }}>
                  L-Thyroxin Henning ist ein Arzneimittel, das das Schilddrüsenhormon Levothyroxin enthält. Es dient dem Ersatz fehlenden Hormons bei Schilddrüsenunterfunktion...
                </ThemedText>

                <ThemedText type="smallBold" themeColor="primary" style={{ marginBottom: 4 }}>
                  2. Was sollten Sie vor der Einnahme beachten?
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={{ marginBottom: 12 }}>
                  L-Thyroxin darf nicht eingenommen werden bei Überempfindlichkeit, unbehandelter Überfunktion der Schilddrüse oder akutem Herzinfarkt...
                </ThemedText>
                
                <ThemedText type="smallBold" themeColor="primary" style={{ marginBottom: 4 }}>
                  3. Wie ist L-Thyroxin einzunehmen?
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Nehmen Sie die Tablette morgens mindestens 30 Minuten vor dem Frühstück unzerkaut mit ausreichend Flüssigkeit (z. B. einem halben Glas Wasser) ein...
                </ThemedText>
              </ScrollView>
            </ThemedView>
          )}

          {/* Mock Add Medication Dialog */}
          {showAddModal && (
            <ThemedView type="card" style={[styles.addModal, { borderColor: theme.primary }]}>
              <View style={styles.modalHeader}>
                <ThemedText type="default" style={{ fontWeight: 'bold' }}>Neues Medikament</ThemedText>
                <Pressable onPress={() => setShowAddModal(false)} style={styles.closeBtn}>
                  <X size={18} color={theme.text} />
                </Pressable>
              </View>

              <View style={styles.formGroup}>
                <ThemedText type="smallBold" themeColor="textSecondary">Name des Medikaments</ThemedText>
                <TextInput 
                  placeholder="z.B. Ibuprofen" 
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { borderColor: theme.backgroundElement, color: theme.text }]} 
                />
              </View>

              <View style={styles.formGroup}>
                <ThemedText type="smallBold" themeColor="textSecondary">Erinnerungszeit</ThemedText>
                <TextInput 
                  placeholder="z.B. 08:00" 
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { borderColor: theme.backgroundElement, color: theme.text }]} 
                />
              </View>

              <View style={{ flexDirection: 'row', gap: Spacing.two }}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <ThemedText type="smallBold" themeColor="textSecondary">Packungsgröße</ThemedText>
                  <TextInput 
                    placeholder="z.B. 50" 
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="numeric"
                    style={[styles.input, { borderColor: theme.backgroundElement, color: theme.text }]} 
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <ThemedText type="smallBold" themeColor="textSecondary">Aktueller Vorrat</ThemedText>
                  <TextInput 
                    placeholder="z.B. 50" 
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="numeric"
                    style={[styles.input, { borderColor: theme.backgroundElement, color: theme.text }]} 
                  />
                </View>
              </View>

              <Pressable 
                onPress={() => setShowAddModal(false)}
                style={({ pressed }) => [
                  styles.submitBtn, 
                  { backgroundColor: theme.primary, opacity: pressed ? 0.9 : 1 }
                ]}
              >
                <ThemedText type="default" style={{ color: theme.white, fontWeight: 'bold' }}>
                  Speichern & Ei erhalten 🥚
                </ThemedText>
              </Pressable>
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
  addBadge: {
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
  statsBanner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.four,
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  sectionContainer: {
    gap: Spacing.two,
  },
  sectionTitle: {
    letterSpacing: 1,
    fontSize: 12,
  },
  medCard: {
    padding: Spacing.three,
    borderRadius: Spacing.four,
    gap: Spacing.two,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  medHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  pillIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medDetails: {
    flex: 1,
    gap: Spacing.half,
  },
  timesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDivider: {
    height: 1,
    marginVertical: Spacing.one,
  },
  medFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  leafletBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  leafletModal: {
    padding: Spacing.three,
    borderRadius: Spacing.four,
    borderWidth: 1.5,
    gap: Spacing.two,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  closeBtn: {
    padding: 4,
  },
  leafletTextScroll: {
    height: 180,
    paddingRight: Spacing.two,
  },
  addModal: {
    padding: Spacing.three,
    borderRadius: Spacing.four,
    borderWidth: 1.5,
    gap: Spacing.two,
  },
  formGroup: {
    gap: Spacing.one,
    marginBottom: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    fontSize: 14,
  },
  submitBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    marginTop: Spacing.one,
  },
});
