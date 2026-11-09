# Apsicare Local Store

## Resumo

O **Apsicare Local Store** é uma prova de conceito acadêmica desenvolvida no
contexto do TCC Apsicare. O projeto demonstra a implementação de persistência
local de registros relacionados ao estresse em um aplicativo móvel, utilizando
SQLite por meio da biblioteca `expo-sqlite`.

A aplicação permite gerar medições simuladas, armazená-las no dispositivo e
consultá-las em telas de monitoramento, histórico e detalhamento. O escopo é
demonstrativo: não há integração com dispositivos vestíveis, processamento de
sinais fisiológicos reais ou finalidade diagnóstica.

## Contextualização

O sistema Apsicare tem como contexto o acompanhamento de indicadores
relacionados ao estresse por meio de dados que, em uma aplicação completa,
poderiam ser obtidos de dispositivos vestíveis. Esta prova de conceito delimita
a investigação ao armazenamento e à recuperação dos registros no próprio
dispositivo móvel.

A persistência local permite que as operações de registro e consulta
demonstradas não dependam de um serviço remoto. Essa decisão também delimita a
solução: os dados não são sincronizados entre dispositivos nem enviados a um
backend.

## Objetivos

### Objetivo geral

Demonstrar uma arquitetura móvel capaz de persistir, recuperar e apresentar
localmente registros simulados de frequência cardíaca e de pontuação de
estresse.

### Objetivos específicos

- Implementar a inicialização do banco de dados SQLite no aplicativo.
- Criar operações para inserir, listar e consultar registros pelo identificador.
- Utilizar consultas parametrizadas para valores fornecidos às operações SQL.
- Apresentar os dados em telas de monitoramento, histórico e detalhes.
- Manter a camada de persistência separada das telas da aplicação.

## Escopo e delimitações

O aplicativo gera valores sintéticos para a frequência cardíaca e para a
pontuação de estresse. Cada registro contém identificador, data e hora, valor
de frequência cardíaca, pontuação e origem do dado. A origem é identificada
como `simulated`.

A classificação apresentada é uma regra ilustrativa sobre a pontuação
simulada: valores abaixo de `0,33` são classificados como baixos, valores de
`0,33` a menos de `0,66` como moderados, e valores a partir de `0,66` como
altos. Essa regra não representa uma escala clínica validada e não deve ser
interpretada como avaliação de saúde.

Estão fora do escopo atual:

- integração com sensores, relógios inteligentes ou outros dispositivos;
- utilização de dados fisiológicos reais ou dados de pacientes;
- autenticação, backend e sincronização remota;
- validação clínica da pontuação ou da classificação de estresse;
- publicação do aplicativo em lojas.

## Arquitetura da aplicação

A aplicação está organizada em camadas funcionais:

- **Apresentação:** telas em `screens/` e componentes reutilizáveis em
  `components/`.
- **Navegação:** navegação por abas entre monitoramento e histórico, com uma
  pilha para a tela de detalhes, implementada com React Navigation.
- **Persistência:** operações de banco de dados centralizadas em
  `database/database.ts`.
- **Tipagem:** interfaces dos registros e tipos das rotas em `types/index.ts`.

O componente raiz inicializa o banco usando `SQLiteProvider` e executa
`migrateDbIfNeeded` antes de disponibilizar o contexto às telas. O banco é
nomeado `apsicare.db`, e a tabela `stress_records` é criada caso ainda não
exista. A tabela armazena a data em formato textual, os valores numéricos de
frequência cardíaca e estresse e a origem da medição.

As operações de inserção e consulta por identificador utilizam parâmetros SQL,
separando os valores dos comandos. A listagem ordena os registros pela data,
do mais recente para o mais antigo, usando o identificador como critério
secundário.

## Tecnologias

| Tecnologia | Utilização |
|---|---|
| React Native | Construção da interface móvel multiplataforma |
| Expo SDK 58 | Execução e integração do ambiente Expo |
| TypeScript | Tipagem estática da aplicação |
| Expo SQLite | Persistência local em SQLite |
| React Navigation | Navegação por abas e pilha |

As versões instaladas das dependências são registradas em `package.json` e
`package-lock.json`.

## Estrutura do repositório

```text
App.tsx                  Composição da aplicação, navegação e provedor SQLite
app.json                 Configuração do projeto Expo
components/              Componentes reutilizáveis da interface
database/database.ts     Inicialização e operações de persistência
screens/                 Telas de monitoramento, histórico e detalhes
types/index.ts           Tipos dos registros e das rotas
```

## Requisitos

- Node.js compatível com as dependências do projeto;
- npm;
- Expo Go atualizado para SDK 58 ou um ambiente de desenvolvimento compatível;
- para conexão local com um dispositivo físico, computador e dispositivo na
  mesma rede Wi-Fi.

## Instalação e execução

Na raiz do repositório:

```bash
npm install
npx expo start
```

Escaneie o QR code exibido pelo Expo Go. Se a rede local não permitir a conexão,
é possível iniciar o servidor em modo de túnel:

```bash
npx expo start --tunnel
```

Para limpar o cache do Metro durante a inicialização:

```bash
npx expo start --clear
```

## Verificação

Os seguintes comandos permitem verificar os tipos, executar o lint e conferir a
compatibilidade das dependências com o SDK instalado:

```bash
npx tsc --noEmit
npm run lint
npx expo install --check
npx expo-doctor
```

## Considerações sobre privacidade e uso

Os registros desta prova de conceito são mantidos localmente no dispositivo e
não são sincronizados com servidores. Isso descreve o fluxo implementado, mas
não constitui uma garantia de criptografia ou de proteção contra acesso ao
dispositivo. A aplicação utiliza dados simulados e não deve ser empregada para
tomada de decisão clínica.

## Autores

O aplicativo foi desenvolvido pela aluna Ana Carolina Joaquim Januário, do terceiro ano de Ciências da Computação do Instituto Mauá de Tecnologia.
