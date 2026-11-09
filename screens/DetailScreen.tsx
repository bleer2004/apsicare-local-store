
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { getStressRecordById, classifyStress, formatDateTime } from '../database/database';
import type { RootStackParamList, StressRecord } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function DetailScreen({ route }: Props) {
  const { recordId } = route.params;
  const db = useSQLiteContext();
  const [record, setRecord] = useState<StressRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getStressRecordById(db, recordId);
        if (!data) Alert.alert('Erro', 'Registro não encontrado.');
        setRecord(data);
      } catch (e) {
        console.error(e);
        Alert.alert('Erro', 'Não foi possível carregar o registro.');
      } finally {
        setLoading(false);
      }
    })();
  }, [db, recordId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!record) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Registro não encontrado</Text>
      </View>
    );
  }

  const c = classifyStress(record.stress_score);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Row label="ID" value={`#${record.id}`} />
        <Row label="Frequência cardíaca" value={`${Math.round(record.heart_rate)} BPM`} />
        <Row
          label="Stress score"
          value={`${record.stress_score.toFixed(2)} (${c.label})`}
          valueColor={c.color}
        />
        <Row label="Data e hora" value={formatDateTime(record.recorded_at)} />
        <Row label="Origem" value={record.source} />
      </View>
    </View>
  );
}

function Row({
  label, value, valueColor,
}: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, valueColor ? { color: valueColor } : null]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F7FA', padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F7FA' },
  error: { fontSize: 16, color: '#FF3B30' },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  row: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  label: { fontSize: 13, color: '#8E8E93', marginBottom: 4 },
  value: { fontSize: 17, fontWeight: '600', color: '#1C1C1E' },
});