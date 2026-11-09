
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import {
  insertStressRecord,
  generateSimulatedMeasurement,
  classifyStress,
  getAllStressRecords,
} from '../database/database';
import type { StressRecord } from '../types';
import StressCard from '../components/StressCard';
import StatusBadge from '../components/StatusBadge';

export default function MonitorScreen() {
  const db = useSQLiteContext();
  const [latest, setLatest] = useState<StressRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadLatest = useCallback(async () => {
    try {
      setLoading(true);
      const records = await getAllStressRecords(db);
      setLatest(records.length > 0 ? records[0]! : null);
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }
  }, [db]);

  useFocusEffect(useCallback(() => { loadLatest(); }, [loadLatest]));

  async function handleRegister() {
    try {
      setSaving(true);
      const { heart_rate, stress_score } = generateSimulatedMeasurement();
      await insertStressRecord(db, {
        recorded_at: new Date().toISOString(),
        heart_rate,
        stress_score,
        source: 'simulated',
      });
      await loadLatest();
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Falha ao registrar medição.');
    } finally {
      setSaving(false);
    }
  }

  const classification = latest ? classifyStress(latest.stress_score) : null;

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Apsicare</Text>
      <Text style={styles.subtitle}>Local Store · Monitoramento</Text>

      <StatusBadge />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : latest && classification ? (
        <StressCard
          heartRate={latest.heart_rate}
          stressScore={latest.stress_score}
          classification={classification}
          recordedAt={latest.recorded_at}
        />
      ) : (
        <View style={styles.emptyCard}>
          <Ionicons name="pulse-outline" size={48} color="#C7C7CC" />
          <Text style={styles.emptyText}>Nenhuma medição registrada</Text>
          <Text style={styles.emptySubtext}>Toque no botão abaixo para começar</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, saving && { opacity: 0.7 }]}
        onPress={handleRegister}
        disabled={saving}
        activeOpacity={0.8}
      >
        {saving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Registrar medição</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F7FA',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  appName: { fontSize: 32, fontWeight: '700', color: '#1C1C1E', letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: '#8E8E93', marginTop: 2, marginBottom: 14 },
  loader: { marginTop: 60 },
  emptyCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 40,
    alignItems: 'center', marginTop: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  emptyText: { fontSize: 17, fontWeight: '600', color: '#1C1C1E', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#8E8E93', marginTop: 4 },
  button: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#007AFF', borderRadius: 14, paddingVertical: 16,
    marginTop: 24, gap: 8,
  },
  buttonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' },
});