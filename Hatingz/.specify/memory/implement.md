# Implement - Ratingz Core System

## Diretrizes de Execução e Ordem de Implementação

A execução das tarefas do `tasks.md` deve seguir estritamente a sequência de dependências e os papéis atribuídos (João para Backend, Enzo para Frontend e Rick para QA).

### Ordem de Execução das Phases:

1. **Phase 1: Shared Infrastructure & Setup**
   - Instanciar o `docker-compose.yml` do MySQL (João).
   - Inicializar as estruturas base de pastas `/backend` e `/frontend` (João / Enzo).

2. **Phase 2: Foundational & Database Schema**
   - Rodar o script de inicialização do banco de dados MySQL contendo tabelas de usuários, times, elenco dos 11 titulares reais e partidas (João).
   - Configurar o middleware de autenticação JWT e rotas base no Express (João).
   - Configurar o cliente Axios e React Router DOM no React (Enzo).

3. **Phase 3: User Story 1 - Autenticação & Jogos do Time do Coração (P1 - MVP)**
   - Criar as páginas de Login e Cadastro no React com seleção do time do coração (Enzo).
   - Desenvolver o endpoint `GET /api/matches` com filtro obrigatório pelo time do usuário logado (João).
   - Renderizar os cards de partidas exclusivas no Dashboard (Enzo).

4. **Phase 4: User Story 2 - Prancheta Tática Visual & Feed de Escalações (P2)**
   - Construir o componente `TacticalPitch.tsx` (campo verde 4-3-3) com remoção individual de jogador da prancheta (Enzo).
   - Implementar os endpoints e tela do Feed de Escalações da Comunidade com sistema de curtidas (João / Enzo).

5. **Phase 5: User Story 3 - Votação Acumulativa de Expulsão & QA (P3)**
   - Criar a aba de Votação da partida com contador de intenções de expulsão (Enzo).
   - Implementar a trava de 1 voto único no backend via banco de dados (João).
   - Executar os testes unitários e de integração validando as regras do core business (Rick).

---
*Nota*: Ao gerar ou refatorar o código via `/speckit-implement`, insira comentários indicando a responsabilidade de cada arquivo (`// Responsável: João`, `// Responsável: Enzo`, `// Responsável: Rick`).