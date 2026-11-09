# Critérios de Aceitação — Apsicare Local Store

Verificação manual. Marque `[x]` somente após testar no dispositivo.

| # | Critério | Como testar | Status |
|---|----------|-------------|--------|
| 1 | Banco e tabela criados automaticamente na primeira execução | Instalar o app limpo, abrir, verificar que a tela Monitor carrega sem erro e que o histórico está vazio (sem crash). | [ ] |
| 2 | "Registrar medição" salva e aparece no histórico | Tocar em "Registrar medição" → ir à aba Histórico → novo registro no topo com BPM e classificação. | [ ] |
| 3 | Registros persistem após fechar e reabrir o app | Registrar 2 medições → fechar completamente o app → reabrir → Histórico deve mostrar as 2. | [ ] |
| 4 | Histórico funciona offline | Ativar modo avião → abrir o app → Histórico deve listar os registros normalmente. | [ ] |
| 5 | Detalhes exibem todos os dados corretamente | Tocar em um item do histórico → conferir ID, BPM, stress score, data/hora, origem. | [ ] |
| 6 | Erros são tratados com mensagens adequadas | Testar (a) navegar para `Detail` com ID inexistente, (b) simular falha de escrita (ex.: comentar temporariamente a tabela) — app deve mostrar `Alert` de erro, sem travar. | [ ] |

## Observações
[PREENCHER após execução: descreva particularidades do dispositivo, versão do Expo Go, SDK, resultados inesperados.]