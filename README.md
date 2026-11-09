# Apsicare Local Store

PoC acadêmica (TCC Apsicare) — armazenamento local de medições de
estresse com **React Native + Expo + TypeScript + expo-sqlite**.

## Requisitos
- Node.js LTS
- Expo Go no dispositivo Android
- Mesma rede Wi-Fi entre PC e dispositivo

## Instalação
```bash
npx create-expo-app apsicare-local-store --template blank-typescript
cd apsicare-local-store
npx expo install expo-sqlite
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
npx expo install @expo/vector-icons