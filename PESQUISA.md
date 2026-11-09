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
- [Expo SDK 58 — referência](https://docs.expo.dev/versions/v58.0.0/)
- [Expo SDK 58 — SQLite](https://docs.expo.dev/versions/v58.0.0/sdk/sqlite/)
- [Expo SDK 58 — configuração do app](https://docs.expo.dev/versions/v58.0.0/config/app/)
- [Expo SDK 58 — configuração Babel](https://docs.expo.dev/versions/v58.0.0/config/babel/)
- [Expo SDK 58 — SplashScreen](https://docs.expo.dev/versions/v58.0.0/sdk/splash-screen/)
- [Expo CLI — inicialização e desenvolvimento](https://docs.expo.dev/more/expo-cli/)
- [Expo — integração com MCP](https://docs.expo.dev/mcp/)

As páginas acima foram consultadas durante a implementação e a investigação
da incompatibilidade do Expo Go. A documentação oficial do Expo SQLite foi
utilizada para conferir a API e o comportamento de persistência. Não foram
incluídas referências à documentação do React Navigation ou TypeScript como
fontes consultadas nesta etapa.

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

Os resultados abaixo reproduzem o relato registrado em `CRITERIOS.md`; não
representam uma execução independente destes testes. O dispositivo informado
foi um iPhone 15 Pro Max, com iOS (versão não especificada), Expo SDK 58 e Expo
Go compatível com SDK 58 (número exato não informado). A data informada para os
testes foi 08/11/2026.

| Critério | Resultado informado | Observação |
|---|---|---|
| 1. Criação inicial do banco e da tabela | Não aprovado  A falha geral é atribuída a versões, e as capturas `image.png` registram incompatibilidade anterior entre Expo Go SDK 58 e projeto SDK 51. |
| 2. Inserção e exibição no histórico | Marcado como aprovado | A captura `image-2.png` é indicada como evidência do histórico. |
| 3. Persistência após reabrir | Marcado como aprovado | O resultado está marcado em `CRITERIOS.md`|
| 4. Consulta offline | Marcado como aprovado | O resultado está marcado em `CRITERIOS.md` |
| 5. Exibição dos detalhes | Marcado como aprovado pelo usuário, com ressalva | A captura `image-3.png` é descrita como contendo erro |
|

O documento de critérios informa cinco aprovações e uma reprovação por problema
de versões, mas também deixa o critério 1 sem marcação e relata problemas de
responsividade nas observações. Portanto, o critério reprovado e a classificação
final ainda precisam ser reconciliados com o resultado observado no dispositivo.
As capturas comprovam que houve problemas de conexão/incompatibilidade em uma
etapa anterior, não que os seis fluxos funcionais tenham sido todos executados
após a atualização para SDK 58.

Após essa atualização, foram executados verificações automatizadas de
compatibilidade do Expo, TypeScript, lint e exportação iOS pelo Metro. Esses
resultados validam a configuração e a compilação, mas não substituem os testes
manuais em dispositivo.

## 9. Limitações encontradas

- As medições são geradas por simulação; não há integração com sensores ou
  dispositivos vestíveis.
- Os dados permanecem no banco SQLite local e não há backend nem sincronização
  entre dispositivos.
- A classificação em baixo, moderado e alto é uma regra demonstrativa sobre
  valores simulados; não foi validada como escala clínica.
- A experiência de execução depende da compatibilidade entre a versão do Expo
  Go e o SDK do projeto. Foi registrada uma incompatibilidade quando o Expo Go
  era SDK 58 e o projeto ainda declarava SDK 51; o projeto foi posteriormente
  atualizado para SDK 58.
- As evidências relatadas apontam problema de responsividade na tela de
  detalhes. O comportamento visual precisa ser revisto e validado novamente no
  dispositivo após a atualização.
- A versão exata do iOS e do Expo Go não foi registrada. Também não há evidência
  suficiente para caracterizar o comportamento em segundo plano ou avaliar
  limites de volume e desempenho do banco.

O uso de SQLite local demonstra persistência sem conexão para as operações
locais, mas não equivale a uma garantia de criptografia ou de proteção contra
acesso ao dispositivo.

## 10. Onde a IA errou
Durante a investigação da mensagem “Could not connect to the server”, a
primeira resposta priorizou a hipótese de servidores Expo antigos e QR code
desatualizado, recomendando reiniciar o servidor ou usar túnel. A verificação
seguinte mostrou uma causa mais específica e comprovada na captura do
dispositivo: o Expo Go instalado era para SDK 58, enquanto o projeto ainda
declarava SDK 51. A orientação inicial foi prematura por não identificar essa
incompatibilidade antes de sugerir soluções de rede. O projeto foi então
atualizado para SDK 58 e validado com `expo install --check`, Expo Doctor,
TypeScript e exportação iOS pelo Metro.

## 11. Ferramentas e evidências de uso da IA

| Item | Estado | Evidência |
|---|---|---|
| MCP remoto do Expo configurado | [x] | `.vscode/mcp.json` aponta para `https://mcp.expo.dev/mcp`, conforme a documentação oficial. |
| MCP do Expo autenticado, conectado e comprovado na sessão do VS Code | [ ] | Pendente: não há evidência de autenticação OAuth concluída nem de ferramentas Expo MCP disponíveis na sessão. A configuração do arquivo, por si só, não comprova conexão. |
| Instruções do Copilot configuradas | [x] | Regras do projeto estão em `.github/copilot-instructions.md`. |
| Pelo menos um erro real da IA documentado | [x] | O diagnóstico inicial prematuro do erro de conexão está descrito na seção 10. |
| Fontes oficiais conferidas | [x] | Documentação oficial do Expo consultada e listada na seção 6. |

