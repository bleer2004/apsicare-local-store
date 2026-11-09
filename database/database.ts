
import type { SQLiteDatabase } from 'expo-sqlite';
import type { StressRecord } from '../types';

export const DATABASE_NAME = 'apsicare.db';


export async function migrateDbIfNeeded(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS stress_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recorded_at TEXT NOT NULL,
      heart_rate REAL NOT NULL,
      stress_score REAL NOT NULL,
      source TEXT DEFAULT 'simulated'
    );
  `);
}


export async function insertStressRecord(
  db: SQLiteDatabase,
  record: Omit<StressRecord, 'id'>
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO stress_records (recorded_at, heart_rate, stress_score, source)
     VALUES (?, ?, ?, ?);`,
    [record.recorded_at, record.heart_rate, record.stress_score, record.source]
  );
  return result.lastInsertRowId;
}


export async function getAllStressRecords(
  db: SQLiteDatabase
): Promise<StressRecord[]> {
  return db.getAllAsync<StressRecord>(
    `SELECT id, recorded_at, heart_rate, stress_score, source
     FROM stress_records
     ORDER BY recorded_at DESC, id DESC;`
  );
}


export async function getStressRecordById(
  db: SQLiteDatabase,
  id: number
): Promise<StressRecord | null> {
  const row = await db.getFirstAsync<StressRecord>(
    `SELECT id, recorded_at, heart_rate, stress_score, source
     FROM stress_records
     WHERE id = ?;`,
    [id]
  );
  return row ?? null;
}

export function generateSimulatedMeasurement(): {
  heart_rate: number;
  stress_score: number;
} {
  const heart_rate = Math.round(55 + Math.random() * 55);
  const stress_score = parseFloat(Math.random().toFixed(2));
  return { heart_rate, stress_score };
}


export function classifyStress(score: number): {
  label: string;
  color: string;
} {
  if (score < 0.33) return { label: 'Baixo', color: '#34C759' };
  if (score < 0.66) return { label: 'Moderado', color: '#FF9500' };
  return { label: 'Alto', color: '#FF3B30' };
}


export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}