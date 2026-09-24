# Feature Specification: Plataforma Ratingz

**Feature Branch**: `001-ratingz-platform`

**Created**: 2026-09-22

**Status**: Draft

**Input**: User description: "Criar plataforma Ratingz com autenticação por time do coração,
filtro de partidas exclusivas do clube do torcedor, prancheta tática visual 4-3-3 com
remoção individual de jogadores, feed de escalações da comunidade e sistema de votação de
expulsão acumulativo por utilizador único"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entrar e acompanhar o time do coração (Priority: P1)

O torcedor cria uma conta informando seus dados e escolhe um dos clubes suportados como
seu time do coração. Depois de entrar, encontra uma área de partidas que mostra somente
confrontos dos quais seu clube participa.

**Why this priority**: A identidade do torcedor e o recorte correto de partidas são a base
da experiência e entregam valor mesmo sem os recursos comunitários.

**Independent Test**: Criar uma conta para o Corinthians, entrar e verificar que a área de
partidas contém apenas jogos em que o Corinthians é mandante ou visitante.

**Acceptance Scenarios**:

1. **Given** um torcedor não autenticado, **When** ele acessa a área de partidas,
   **Then** o sistema solicita autenticação antes de exibir qualquer partida.
2. **Given** um torcedor autenticado com o Palmeiras como time do coração, **When** ele
   abre a área de partidas, **Then** são exibidos somente jogos que envolvem o Palmeiras.
3. **Given** um torcedor preenchendo o cadastro, **When** ele informa dados inválidos ou
   deixa um campo obrigatório vazio, **Then** o sistema identifica o campo e impede o
   cadastro até a correção.

---

### User Story 2 - Montar e compartilhar uma escalação (Priority: P2)

O torcedor abre a prancheta do seu clube, visualiza um campo verde em formação 4-3-3,
seleciona jogadores reais por nome ou posição e remove individualmente qualquer jogador
da sua própria prancheta. Ele pode salvar a formação e consultar escalações compartilhadas
por outros torcedores em um feed da comunidade.

**Why this priority**: A prancheta cria a principal interação recorrente da comunidade,
sem permitir que uma edição pessoal altere o conteúdo de outros torcedores.

**Independent Test**: Selecionar jogadores para uma formação 4-3-3, remover um deles,
salvar a escalação e confirmar que a formação removida não aparece na prancheta pessoal,
enquanto uma escalação comunitária permanece inalterada.

**Acceptance Scenarios**:

1. **Given** um torcedor autenticado na prancheta, **When** ele seleciona um jogador
   disponível, **Then** o jogador aparece na posição correspondente do campo 4-3-3 com
   nome, posição e identificação visual do clube.
2. **Given** um jogador presente na prancheta pessoal, **When** o torcedor seleciona a
   ação de remover, **Then** o jogador desaparece somente da prancheta pessoal.
3. **Given** uma escalação pessoal válida, **When** o torcedor a salva, **Then** ela fica
   disponível no feed com clube, formação, autor e jogadores visíveis.
4. **Given** uma escalação publicada por outro torcedor, **When** o usuário abre o feed,
   **Then** ele consegue visualizar a formação sem poder alterar a escalação original.
5. **Given** uma escalação no feed, **When** o torcedor vota nela, **Then** o total público
   de votos aumenta uma vez e o resultado atualizado fica visível.

---

### User Story 3 - Votar pela expulsão de um jogador (Priority: P3)

Durante uma partida, o torcedor consulta os jogadores relacionados e registra um voto
para expulsar um jogador que considera estar jogando mal. A comunidade vê o total
acumulado de votos, e o mesmo torcedor não pode votar duas vezes no mesmo jogador dentro
da mesma partida.

**Why this priority**: A votação amplia o engajamento durante a partida, mas depende da
autenticação e dos dados de partidas e jogadores das prioridades anteriores.

**Independent Test**: Registrar um voto para expulsar um jogador em uma partida, confirmar
que o contador aumenta em um, repetir a ação com o mesmo usuário e verificar que o contador
permanece igual e uma mensagem explica que o voto já foi computado.

**Acceptance Scenarios**:

1. **Given** um torcedor autenticado em uma partida e um jogador elegível, **When** ele
   vota pela expulsão, **Then** o voto é registrado e o contador daquele jogador aumenta
   em um.
2. **Given** um torcedor que já votou pela expulsão do jogador em uma partida, **When** ele
   tenta votar novamente no mesmo jogador e partida, **Then** o sistema rejeita a segunda
   tentativa e não altera o contador.
3. **Given** votos de vários torcedores para o mesmo jogador e partida, **When** qualquer
   torcedor consulta a votação, **Then** o contador mostra o total acumulado da comunidade.

### Edge Cases

- Um e-mail já cadastrado não pode criar uma segunda conta; o sistema informa o conflito sem
  revelar dados de outra conta.
- Uma sessão expirada ou inválida não pode abrir partidas, salvar escalações ou votar.
- Se não houver partidas do time escolhido, a área de partidas mostra um estado vazio
  explicativo, sem exibir jogos de outros clubes.
- O seletor de jogadores não permite inserir o mesmo jogador duas vezes na mesma escalação.
- A prancheta mantém posições legíveis e sem sobreposição quando há menos de 11 jogadores.
- Uma escalação ou jogador removido da visualização pessoal não pode apagar ou modificar
  conteúdo publicado por outro torcedor.
- Uma tentativa de voto duplicado não cria uma segunda contagem mesmo se a solicitação for
  repetida rapidamente.
- Uma partida sem jogadores elegíveis para votação mostra o motivo e não oferece uma ação
  inválida.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir que um visitante crie uma conta com nome, e-mail,
  senha e um time do coração entre Palmeiras, Bahia, Corinthians, São Paulo e Vasco da
  Gama.
- **FR-002**: O sistema MUST permitir que um usuário cadastrado entre e mantenha uma sessão
  autenticada para acessar recursos restritos.
- **FR-003**: O sistema MUST impedir o acesso de usuários não autenticados às partidas,
  escalações pessoais, feed de escalações e votação de expulsão.
- **FR-004**: O sistema MUST exibir na área de partidas somente confrontos em que o time do
  coração do usuário autenticado seja mandante ou visitante.
- **FR-005**: O sistema MUST exibir partidas com nomes reais dos clubes, escudos, placar,
  situação e data/horário, sem expor identificadores numéricos brutos na interface.
- **FR-006**: O sistema MUST manter os 11 jogadores titulares reais de cada um dos cinco
  clubes suportados, incluindo nome, número da camisa e posição.
- **FR-007**: O sistema MUST exibir uma prancheta visual verde em formação 4-3-3, com posições
  legíveis e sem sobreposição.
- **FR-008**: O sistema MUST permitir selecionar jogadores do elenco do clube por nome ou
  posição e adicioná-los à prancheta pessoal.
- **FR-009**: O sistema MUST permitir remover individualmente um jogador da prancheta
  pessoal sem alterar escalações salvas ou pertencentes a outros usuários.
- **FR-010**: O sistema MUST permitir salvar uma escalação pessoal com sua formação e lista
  de jogadores, associada ao autor e ao clube.
- **FR-011**: O sistema MUST disponibilizar um feed de escalações da comunidade contendo
  autor, clube, formação, jogadores e total de votos.
- **FR-012**: O sistema MUST permitir que um usuário vote em uma escalação comunitária e
  MUST atualizar o total de votos sem duplicar a ação do mesmo usuário na mesma escalação.
- **FR-013**: O sistema MUST permitir que um usuário autenticado consulte jogadores
  elegíveis para votação em uma partida e registre um voto de expulsão.
- **FR-014**: O sistema MUST aceitar no máximo um voto de expulsão por combinação de usuário,
  partida e jogador, rejeitando tentativas adicionais sem aumentar o contador.
- **FR-015**: O sistema MUST exibir o total acumulado de votos de expulsão por jogador e
  partida para usuários autorizados.
- **FR-016**: O sistema MUST comunicar estados de carregamento, sucesso, validação, sessão
  inválida, conflito de voto e ausência de dados com mensagens compreensíveis.
- **FR-017**: O sistema MUST validar autorização no servidor para cada ação restrita e não
  confiar em identificadores de usuário enviados pelo cliente.

### Key Entities *(include if feature involves data)*

- **User**: Torcedor autenticado, com nome, e-mail, senha protegida e time do coração.
- **Team**: Clube suportado, com nome e escudo, relacionado a seus jogadores e partidas.
- **Player**: Jogador real de um clube, com nome, número da camisa e posição.
- **Match**: Confronto entre dois clubes, com placar, situação e data/horário.
- **Lineup**: Escalação criada por um usuário para um clube, contendo formação, jogadores,
  autoria e total de votos da comunidade.
- **LineupVote**: Voto único de um usuário em uma escalação comunitária.
- **ExpulsionVote**: Voto de um usuário para um jogador em uma partida, único por usuário,
  partida e jogador.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em testes de aceitação, 100% das partidas exibidas para cada usuário envolvem
  o time do coração selecionado por esse usuário.
- **SC-002**: Pelo menos 95% dos usuários de teste concluem cadastro e primeiro acesso em
  até 2 minutos sem assistência.
- **SC-003**: Pelo menos 90% dos usuários de teste conseguem montar, remover um jogador e
  salvar uma escalação em até 3 minutos.
- **SC-004**: Em testes de concorrência previstos para a primeira versão, pelo menos 95% das
  consultas de partidas e feed retornam em menos de 200 ms.
- **SC-005**: Em 100% dos testes de duplicidade, uma segunda tentativa de voto de escalação
  ou expulsão do mesmo usuário não altera o contador.
- **SC-006**: Nenhum identificador numérico bruto aparece na interface em uma revisão de
  todas as telas cobertas pela funcionalidade.

## Assumptions

- A primeira versão atende os cinco clubes explicitamente definidos: Palmeiras, Bahia,
  Corinthians, São Paulo e Vasco da Gama.
- O cadastro usa e-mail e senha; recuperação de senha e login social estão fora do escopo
  desta versão.
- Os dados de partidas, escudos, jogadores e escalações são mantidos pela própria
  plataforma e podem ser atualizados por uma fonte administrativa fora deste escopo.
- Cada usuário pode manter uma escalação pessoal por contexto de clube e partida; o feed
  mostra escalações salvas que o autor escolheu publicar.
- Votos de escalação e de expulsão são persistentes e não podem ser retirados na primeira
  versão.
- A experiência deve funcionar em telas desktop e móveis, mantendo legibilidade e controles
  acessíveis.
