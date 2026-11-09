# AGENTS.md — Apsicare Local Store

## Contexto do TCC
O **Apsicare** é um sistema de apoio ao monitoramento de saúde mental que
utiliza dados multimodais de dispositivos vestíveis para acompanhar
indicadores relacionados ao estresse (`stress_score` entre 0 e 1).

## Objetivo da PoC
Demonstrar, por meio de um aplicativo React Native + Expo + TypeScript,
como o **expo-sqlite** permite armazenar, consultar e recuperar dados
biométricos localmente, mesmo sem conexão com a internet.

## Tecnologia investigada
- `expo-sqlite` (SQLite nativo via Expo)
- `SQLiteProvider` + `useSQLiteContext`
- Queries parametrizadas
- Persistência local em `apsicare.db`

## Convenções de desenvolvimento
- **Linguagem:** TypeScript estrito (`strict: true`).
- **Estilo:** componentes funcionais + Hooks.
- **Acesso ao banco:** apenas via `database/database.ts` (nunca SQL solto nas telas).
- **Queries:** sempre parametrizadas (`?`), nunca por concatenação.
- **Nomenclatura:** camelCase para variáveis/funções; PascalCase para componentes e tipos.
- **Erros:** capturados com `try/catch` + `Alert.alert` com mensagem ao usuário.
- **UI:** fundo claro (`#F2F7FA`), cards brancos arredondados, azul `#007AFF` como cor de ação.
- **Dependências:** instalar via `npx expo install` para garantir compatibilidade com o SDK.

## Escopo
- Banco `apsicare.db` com tabela `stress_records`.
- Criação automática da tabela na inicialização.
- Inserção, listagem e consulta por ID.
- Telas: Monitoramento, Histórico, Detalhes.
- Interface responsiva para Android.
- Dados simulados (sem smartwatch real).

## Fora de escopo
- Autenticação de usuários.
- Backend / sincronização real com servidor.
- Integração real com smartwatch.
- Dados reais de pacientes.
- Publicação nas lojas.
- IA embarcada no app.