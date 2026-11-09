
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <Ionicons name="time-outline" size={48} color="#C7C7CC" />
      <Text style={styles.title}>Nenhum registro ainda</Text>
      <Text style={styles.subtitle}>
        Registre uma medição na aba Monitoramento
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 4,
  },
});