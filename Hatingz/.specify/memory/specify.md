# Feature Specification: Ratingz - Plataforma do Torcedor

**Feature Branch**: `001-ratingz-core`
**Created**: 2026-09-22
**Status**: Draft

## User Scenarios & Testing

### User Story 1 - Autenticação & Partidas do Time do Coração (Priority: P1) 🎯 MVP

O torcedor realiza cadastro/login informando seu e-mail, senha e "Time do Coração" (Palmeiras, Bahia, Corinthians, São Paulo ou Vasco da Gama). Ao entrar na plataforma, a tela de Partidas em Destaque exibe EXCLUSIVAMENTE jogos em que o seu time esteja participando.

**Why this priority**: É a base do ecossistema do aplicativo e garante a personificação imediata do torcedor.

**Independent Test**: Registar um utilizador como "Corinthians", realizar login e verificar se apenas partidas do Corinthians são carregadas na dashboard.

**Acceptance Scenarios**:
1. **Given** um torcedor não autenticado, **When** ele tentar acessar a página de partidas, **Then** ele deve ser redirecionado para a tela de Login.
2. **Given** um torcedor logado com o time "Palmeiras", **When** ele visualizar a dashboard de partidas, **Then** apenas confrontos envolvendo o Palmeiras devem aparecer.

---

### User Story 2 - Prancheta Tática Visual & Feed de Escalações (Priority: P2)

O torcedor abre a aba de Escalação e vê um campo de futebol verde interativo no formato 4-3-3. Ele seleciona jogadores do elenco real de 11 titulares do seu time por Nome/Posição e pode remover qualquer jogador da sua própria prancheta. Ele pode salvar a escalação e visualizar/votar em formações salvas por outros torcedores na aba "Feed de Escalações".

**Why this priority**: Entrega engajamento tático para a torcida criar e debater formações sem poluir a experiência individual.

**Independent Test**: Selecionar "Raphael Veiga", posicioná-lo no campo, clicar no botão de remover ('X') e checar se o jogador sai da prancheta pessoal sem afetar as escalações salvas de outros utilizadores.

**Acceptance Scenarios**:
1. **Given** a tela de escalação aberta, **When** o torcedor escolher um jogador do dropdown, **Then** o card do jogador deve ser renderizado no alinhamento correto do campo verde.
2. **Given** o Feed de Escalações da Comunidade, **When** o torcedor clicar em "Votar na Escalação", **Then** o contador de votos daquela formação deve incrementar em 1.

---

### User Story 3 - Votação Acumulativa de Expulsão (Priority: P3)

Na aba de Votação da partida, o torcedor visualiza a lista do elenco e pode clicar em "Votar para Expulsar" em um jogador que esteja jogando mal. O sistema grava o voto e atualiza o contador público de intenções de expulsão da comunidade.

**Why this priority**: Garante a interação crítica/humorística da torcida sem interferir na montagem da escalação.

**Independent Test**: Votar na expulsão do jogador X, validar se o contador subiu para 1 e garantir que uma segunda tentativa de voto na mesma partida é bloqueada pelo backend.

**Acceptance Scenarios**:
1. **Given** a aba de votação de uma partida, **When** o utilizador clicar em "Expulsar", **Then** o voto deve ser registrado e o contador incrementado.
2. **Given** um utilizador que já votou para expulsar o Jogador Y na Partida Z, **When** ele tentar votar novamente, **Then** o sistema deve exibir uma mensagem indicando que o voto já foi computado.

---

## Requirements

### Functional Requirements

- **FR-001**: O sistema DEVE permitir autenticação de utilizadores com token JWT persistindo o time do coração no MySQL.
- **FR-002**: O sistema DEVE filtrar todas as consultas de partidas no BFF pelo time do coração do utilizador logado.
- **FR-003**: O sistema DEVE manter uma massa de dados dos 11 titulares reais dos 5 clubes cadastrados (Palmeiras, Bahia, Corinthians, São Paulo e Vasco da Gama).
- **FR-004**: O campo tático DEVE ser exibido visualmente no estilo relvado verde, permitindo incluir e remover jogadores individualmente na sessão do utilizador.
- **FR-005**: O sistema DEVE disponibilizar o Feed de Escalações da Comunidade para votação de formações propostas por outros torcedores.
- **FR-006**: O sistema DEVE restringir a votação de expulsão para no máximo 1 voto por `user_id`, `match_id` e `player_id`.

### Key Entities

- **User**: ID, Nome, E-mail, Senha, TimeCoracao.
- **Team**: ID, Nome, EscudoUrl.
- **Player**: ID, TeamID, Nome, NumeroCamisa, Posicao.
- **Match**: ID, HomeTeamID, AwayTeamID, PlacarHome, PlacarAway, Status, DataHora.
- **Lineup**: ID, UserID, MatchID, Formacao, JogadoresJSON.
- **ExpulsionVote**: ID, UserID, MatchID, PlayerID, DataHora.

## Success Criteria

- **SC-001**: 100% das partidas exibidas na dashboard pertencem ao time do coração do utilizador logado.
- **SC-002**: O tempo de resposta dos endpoints do BFF é inferior a 200ms.
- **SC-003**: Nenhum ID numérico bruto é exposto nas interfaces do frontend.