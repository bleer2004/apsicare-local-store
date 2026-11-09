
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { getAllStressRecords, classifyStress, formatDateTime } from '../database/database';
import type { StressRecord, RootStackParamList } from '../types';
import EmptyState from '../components/EmptyState';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HistoryScreen() {
  const db = useSQLiteContext();
  const navigation = useNavigation<Nav>();
  const [records, setRecords] = useState<StressRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setRecords(await getAllStressRecords(db));
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível carregar o histórico.');
    } finally {
      setLoading(false);
    }
  }, [db]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico</Text>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={records.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const c = classifyStress(item.stress_score);
          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Detail', { recordId: item.id })}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.row}>
                  <Ionicons name="heart" size={16} color="#FF3B30" />
                  <Text style={styles.hr}>{Math.round(item.heart_rate)} BPM</Text>
                  <View style={[styles.badge, { backgroundColor: c.color + '20' }]}>
                    <Text style={[styles.badgeText, { color: c.color }]}>{c.label}</Text>
                  </View>
                </View>
                <Text style={styles.date}>{formatDateTime(item.recorded_at)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F7FA', paddingHorizontal: 20, paddingTop: 60 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F7FA' },
  title: { fontSize: 28, fontWeight: '700', color: '#1C1C1E', marginBottom: 16 },
  list: { paddingBottom: 30 },
  emptyList: { flex: 1 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  hr: { fontSize: 17, fontWeight: '600', color: '#1C1C1E' },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, marginLeft: 4 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  date: { fontSize: 13, color: '#8E8E93' },
});