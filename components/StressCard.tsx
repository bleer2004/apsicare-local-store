// components/StressCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDateTime } from '../database/database';

interface Props {
  heartRate: number;
  stressScore: number;
  classification: { label: string; color: string };
  recordedAt: string;
}

export default function StressCard({
  heartRate,
  stressScore,
  classification,
  recordedAt,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.metric}>
          <View style={styles.iconRow}>
            <Ionicons name="heart" size={18} color="#FF3B30" />
            <Text style={styles.metricLabel}>BPM</Text>
          </View>
          <Text style={styles.metricValue}>{Math.round(heartRate)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metric}>
          <View style={styles.iconRow}>
            <Ionicons name="pulse" size={18} color={classification.color} />
            <Text style={styles.metricLabel}>Estresse</Text>
          </View>
          <Text style={[styles.metricValue, { color: classification.color }]}>
            {stressScore.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={[styles.badge, { backgroundColor: classification.color + '20' }]}>
        <Text style={[styles.badgeText, { color: classification.color }]}>
          {classification.label}
        </Text>
      </View>

      <Text style={styles.timestamp}>
        Última coleta: {formatDateTime(recordedAt)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metric: { flex: 1 },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  metricLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 16,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 12,
  },
});