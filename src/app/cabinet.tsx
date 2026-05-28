import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Pill,
  Plus,
  Calendar,
  FileText,
  ChevronRight,
  AlertTriangle,
  X,
  Camera,
} from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, BottomTabInset, MaxContentWidth } from '@/constants/theme';
import { useMedications } from '@/hooks/use-medications';

type AddForm = {
  name: string;
  reminderTime: string;
  packageSize: string;
  currentStock: string;
  imageUri: string | null;
};

const EMPTY_FORM: AddForm = {
  name: '',
  reminderTime: '',
  packageSize: '',
  currentStock: '',
  imageUri: null,
};

export default function MedizinschrankScreen() {
  const theme = useTheme();
  const { medications, lowStockCount, addMedication, deleteMedication, pickLeafletPhoto } =
    useMedications();

  const [showAddModal, setShowAddModal] = useState(false);
  const [leafletMedId, setLeafletMedId] = useState<number | null>(null);
  const [form, setForm] = useState<AddForm>(EMPTY_FORM);

  const leafletMed = leafletMedId !== null
    ? medications.find((m) => m.id === leafletMedId)
    : null;

  const handlePickPhoto = async () => {
    const uri = await pickLeafletPhoto();
    if (uri) setForm((f) => ({ ...f, imageUri: uri }));
  };

  const handleSave = async () => {
    const name = form.name.trim();
    const packageSize = parseInt(form.packageSize, 10);
    const currentStock = parseInt(form.currentStock, 10);

    if (!name || isNaN(packageSize) || isNaN(currentStock)) {
      Alert.alert('Fehler', 'Bitte alle Pflichtfelder ausfüllen.');
      return;
    }

    const reminderTimes = form.reminderTime.trim()
      ? form.reminderTime.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    await addMedication({
      name,
      reminder_times: reminderTimes,
      package_size: packageSize,
      current_stock: currentStock,
      image_uri: form.imageUri ?? null,
    });

    setForm(EMPTY_FORM);
    setShowAddModal(false);
  };

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
              <ThemedText type="small" themeColor="textSecondary">Übersicht</ThemedText>
              <ThemedText type="subtitle" style={styles.titleText}>Medizinschrank</ThemedText>
            </View>
            <Pressable
              onPress={() => setShowAddModal(true)}
              style={({ pressed }) => [
                styles.addBadge,
                { backgroundColor: theme.primary, opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <Plus size={16} color={theme.white} />
              <ThemedText type="smallBold" style={{ color: theme.white, marginLeft: Spacing.one }}>
                Neu
              </ThemedText>
            </Pressable>
          </View>

          {/* Stats Banner */}
          <ThemedView type="backgroundElement" style={styles.statsBanner}>
            <View style={styles.statItem}>
              <ThemedText type="subtitle" style={{ color: theme.primary, fontWeight: 'bold' }}>
                {medications.length}
              </ThemedText>
              <ThemedText type="code">Aktiv</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <ThemedText
                type="subtitle"
                style={{ color: lowStockCount > 0 ? theme.danger : theme.text, fontWeight: 'bold' }}
              >
                {lowStockCount}
              </ThemedText>
              <ThemedText type="code">Refill nötig</ThemedText>
            </View>
          </ThemedView>

          {/* Medication List */}
          <View style={styles.sectionContainer}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
              MEINE MEDIKAMENTE
            </ThemedText>

            {medications.length === 0 && (
              <ThemedView type="card" style={styles.emptyCard}>
                <Pill size={32} color={theme.textSecondary} />
                <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center' }}>
                  Noch keine Medikamente. Tippe auf "Neu", um dein erstes hinzuzufügen.
                </ThemedText>
              </ThemedView>
            )}

            {medications.map((med) => (
              <ThemedView key={med.id} type="card" style={styles.medCard}>
                <View style={styles.medHeader}>
                  <View style={[styles.pillIconBg, { backgroundColor: theme.primary + '15' }]}>
                    <Pill size={20} color={theme.primary} />
                  </View>
                  <View style={styles.medDetails}>
                    <ThemedText type="default" style={{ fontWeight: 'bold' }}>{med.name}</ThemedText>
                    {med.reminder_times.length > 0 && (
                      <View style={styles.timesContainer}>
                        <Calendar size={12} color={theme.textSecondary} />
                        <ThemedText type="small" themeColor="textSecondary" style={{ marginLeft: 4 }}>
                          {med.reminder_times.join(', ')}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                  <Pressable onPress={() => deleteMedication(med.id)} hitSlop={8}>
                    <X size={16} color={theme.textSecondary} />
                  </Pressable>
                </View>

                <View style={[styles.cardDivider, { backgroundColor: theme.backgroundElement }]} />

                <View style={styles.medFooter}>
                  <View style={styles.stockRow}>
                    <ThemedText type="small" themeColor="textSecondary">Vorrat:</ThemedText>
                    <ThemedText
                      type="smallBold"
                      style={{ color: med.isLowStock ? theme.danger : theme.text }}
                    >
                      {med.current_stock} von {med.package_size}
                    </ThemedText>
                    {med.isLowStock && (
                      <View style={[styles.warningBadge, { backgroundColor: theme.danger + '15' }]}>
                        <AlertTriangle size={10} color={theme.danger} />
                        <ThemedText type="code" style={{ color: theme.danger, fontSize: 10, marginLeft: 2 }}>
                          Fast leer!
                        </ThemedText>
                      </View>
                    )}
                  </View>

                  {med.image_uri && (
                    <Pressable
                      onPress={() => setLeafletMedId(med.id)}
                      style={({ pressed }) => [
                        styles.leafletBtn,
                        { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.8 : 1 },
                      ]}
                    >
                      <FileText size={12} color={theme.text} />
                      <ThemedText type="code" style={{ marginLeft: 4 }}>Beipackzettel</ThemedText>
                    </Pressable>
                  )}
                </View>
              </ThemedView>
            ))}
          </View>

          {/* Leaflet Photo Viewer */}
          {leafletMed && leafletMed.image_uri && (
            <ThemedView type="card" style={[styles.leafletModal, { borderColor: theme.primary }]}>
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FileText size={18} color={theme.primary} />
                  <ThemedText type="default" style={{ fontWeight: 'bold', marginLeft: 8 }}>
                    Beipackzettel: {leafletMed.name}
                  </ThemedText>
                </View>
                <Pressable onPress={() => setLeafletMedId(null)} style={styles.closeBtn}>
                  <X size={18} color={theme.text} />
                </Pressable>
              </View>
              <Image
                source={{ uri: leafletMed.image_uri }}
                style={styles.leafletImage}
                resizeMode="contain"
              />
            </ThemedView>
          )}

          {/* Add Medication Modal */}
          {showAddModal && (
            <ThemedView type="card" style={[styles.addModal, { borderColor: theme.primary }]}>
              <View style={styles.modalHeader}>
                <ThemedText type="default" style={{ fontWeight: 'bold' }}>Neues Medikament</ThemedText>
                <Pressable onPress={() => { setShowAddModal(false); setForm(EMPTY_FORM); }} style={styles.closeBtn}>
                  <X size={18} color={theme.text} />
                </Pressable>
              </View>

              <View style={styles.formGroup}>
                <ThemedText type="smallBold" themeColor="textSecondary">Name *</ThemedText>
                <TextInput
                  placeholder="z.B. Ibuprofen 400mg"
                  placeholderTextColor={theme.textSecondary}
                  value={form.name}
                  onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
                  style={[styles.input, { borderColor: theme.backgroundElement, color: theme.text }]}
                />
              </View>

              <View style={styles.formGroup}>
                <ThemedText type="smallBold" themeColor="textSecondary">
                  Erinnerungszeiten (kommagetrennt)
                </ThemedText>
                <TextInput
                  placeholder="z.B. 08:00, 20:00"
                  placeholderTextColor={theme.textSecondary}
                  value={form.reminderTime}
                  onChangeText={(v) => setForm((f) => ({ ...f, reminderTime: v }))}
                  style={[styles.input, { borderColor: theme.backgroundElement, color: theme.text }]}
                />
              </View>

              <View style={{ flexDirection: 'row', gap: Spacing.two }}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <ThemedText type="smallBold" themeColor="textSecondary">Packungsgröße *</ThemedText>
                  <TextInput
                    placeholder="z.B. 50"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="numeric"
                    value={form.packageSize}
                    onChangeText={(v) => setForm((f) => ({ ...f, packageSize: v }))}
                    style={[styles.input, { borderColor: theme.backgroundElement, color: theme.text }]}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <ThemedText type="smallBold" themeColor="textSecondary">Aktueller Vorrat *</ThemedText>
                  <TextInput
                    placeholder="z.B. 50"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="numeric"
                    value={form.currentStock}
                    onChangeText={(v) => setForm((f) => ({ ...f, currentStock: v }))}
                    style={[styles.input, { borderColor: theme.backgroundElement, color: theme.text }]}
                  />
                </View>
              </View>

              {/* Leaflet photo picker */}
              <Pressable
                onPress={handlePickPhoto}
                style={({ pressed }) => [
                  styles.photoPicker,
                  {
                    borderColor: form.imageUri ? theme.primary : theme.backgroundElement,
                    backgroundColor: theme.backgroundElement,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Camera size={16} color={form.imageUri ? theme.primary : theme.textSecondary} />
                <ThemedText
                  type="small"
                  style={{ marginLeft: Spacing.two, color: form.imageUri ? theme.primary : theme.textSecondary }}
                >
                  {form.imageUri ? 'Foto ausgewählt ✓' : 'Beipackzettel-Foto hinzufügen'}
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={handleSave}
                style={({ pressed }) => [
                  styles.submitBtn,
                  { backgroundColor: theme.primary, opacity: pressed ? 0.9 : 1 },
                ]}
              >
                <ThemedText type="default" style={{ color: theme.white, fontWeight: 'bold' }}>
                  Speichern
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
  container: { flex: 1, justifyContent: 'center', flexDirection: 'row' },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, maxWidth: MaxContentWidth },
  scrollContent: {
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.five,
    gap: Spacing.four,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.one },
  titleText: { fontWeight: 'bold' },
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
  statsBanner: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: Spacing.three, borderRadius: Spacing.four },
  statItem: { alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: 'rgba(0,0,0,0.08)' },
  sectionContainer: { gap: Spacing.two },
  sectionTitle: { letterSpacing: 1, fontSize: 12 },
  emptyCard: {
    padding: Spacing.five,
    borderRadius: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
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
  medHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  pillIconBg: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  medDetails: { flex: 1, gap: Spacing.half },
  timesContainer: { flexDirection: 'row', alignItems: 'center' },
  cardDivider: { height: 1, marginVertical: Spacing.one },
  medFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stockRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  leafletBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },
  leafletModal: { padding: Spacing.three, borderRadius: Spacing.four, borderWidth: 1.5, gap: Spacing.two },
  leafletImage: { width: '100%', height: 300, borderRadius: Spacing.two },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.one },
  closeBtn: { padding: 4 },
  addModal: { padding: Spacing.three, borderRadius: Spacing.four, borderWidth: 1.5, gap: Spacing.two },
  formGroup: { gap: Spacing.one, marginBottom: Spacing.two },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    fontSize: 14,
  },
  photoPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.two,
  },
  submitBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    marginTop: Spacing.one,
  },
});
