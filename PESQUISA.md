# PESQUISA.md — Apsicare Local Store

## 1. Contexto do Apsicare
O Apsicare é um sistema de apoio ao monitoramento de saúde mental baseado
em dados multimodais de dispositivos vestíveis. O indicador central é o
`stress_score` (0 a 1), derivado de sinais biométricos como frequência
cardíaca. O app acompanha esses dados e serve como base para uma camada
de IA interpretativa.

## 2. Problema investigado
Como garantir que dados biométricos sejam coletados, armazenados e
consultados em um aplicativo mobile **sem depender de conexão com a
internet**, preservando a integridade dos registros e permitindo consulta
posterior?

## 3. Pergunta de pesquisa
> "Como o expo-sqlite permite armazenar e recuperar dados de monitoramento
> de estresse do Apsicare mesmo quando o dispositivo está sem conexão com
> a internet?"

## 4. Alternativas tecnológicas consideradas

| Alternativa | Tipo | Prós | Contras |
|-------------|------|------|---------|
| **expo-sqlite** | SQLite nativo via Expo | Integrado ao Expo, sem build nativo extra, API assíncrona, suporte a transações | Sem sincronização remota nativa; requer escrever SQL manual |
| **AsyncStorage** | Chave-valor | Simples, amplamente suportado | Não relacional; sem queries; ruim para listas grandes e agregações |
| **WatermelonDB** | ORM reativo sobre SQLite | Sincronização embutida, reatividade | Dependência pesada, configuração complexa para uma PoC |
| **MMKV** | Chave-valor binário | Muito rápido | Não relacional; inadequado para histórico com consultas |

## 5. Comparação entre as três principais alternativas

| Critério | expo-sqlite | AsyncStorage | WatermelonDB |
|----------|-------------|--------------|--------------|
| Modelo de dados | Relacional (SQL) | Chave-valor | ORM reativo |
| Consultas complexas | ✅ SQL completo | ❌ | ✅ |
| Curva de aprendizado | Média | Baixa | Alta |
| Integração com Expo | ✅ Nativa | ✅ | ⚠️ Requer ajustes |
| Adequação a histórico de medições | ✅ | ⚠️ | ✅ |
| Peso para PoC | Baixo | Muito baixo | Alto |

**Justificativa da escolha:** o `expo-sqlite` oferece modelo relacional,
queries parametrizadas e integração nativa ao Expo, o que atende
exatamente ao objetivo da PoC sem o peso do WatermelonDB.

## 6. Fontes oficiais consultadas
- [PREENCHER: URLs oficiais consultadas, ex.: docs.expo.dev/versions/latest/sdk/sqlite/]
- [PREENCHER: documentação do SQLite]
- [PREENCHER: guia do React Navigation]
- [PREENCHER: documentação TypeScript/React Native]

> Não afirmar fontes que não foram realmente acessadas.

## 7. Funcionamento do Expo SQLite
- O `SQLiteProvider` abre o arquivo `apsicare.db` no diretório privado do app
  e executa `onInit` (migração) antes de renderizar as telas.
- As telas obtêm a instância via `useSQLiteContext()`.
- Operações usam `runAsync`, `getAllAsync`, `getFirstAsync` — assíncronas.
- `PRAGMA journal_mode = WAL` melhora concorrência de leitura/escrita.
- Como o arquivo vive no sistema de arquivos do dispositivo, a persistência
  **não depende de rede**; fechar o app não apaga os dados.
- Queries parametrizadas (`?`) evitam SQL injection e problemas de escape.

## 8. Resultados dos testes
[PREENCHER APÓS EXECUÇÃO — descrever, para cada um dos 6 critérios de
`CRITERIOS.md`, o que foi observado: dispositivo, versão do Expo Go, SDK,
resultado (passou/falhou), evidências (prints, logs).]

## 9. Limitações encontradas
[PREENCHER APÓS EXECUÇÃO — ex.: limitações do Expo Go, ausência de
sincronização, tamanho do banco, comportamento em background, etc.]

## 10. Onde a IA errou
[PREENCHER COM OBSERVAÇÕES REAIS — registrar erros, imprecisões ou
suposições do assistente durante o desenvolvimento, com evidência.
Não inventar.]