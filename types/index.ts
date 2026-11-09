
export interface StressRecord {
  id: number;
  recorded_at: string;
  heart_rate: number;
  stress_score: number;
  source: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  Detail: { recordId: number };
};

export type MainTabsParamList = {
  Monitor: undefined;
  History: undefined;
};