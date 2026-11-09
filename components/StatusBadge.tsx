// components/StatusBadge.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Indica o modo de operação (offline local).
 * Nesta PoC o app NÃO usa rede — o selo é fixo.
 */
export default function StatusBadge() {
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={14} color="#007AFF" />
      <Text style={styles.text}>Modo offline · dados locais</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E5F1FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 6,
  },
  text: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
});