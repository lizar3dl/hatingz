# Clarify - Ratingz Core System

## Resolução de Ambiguidades e Decisões Técnicas

1. **Stack Tecnológica do Backend**:
   - **Definição**: Node.js com Express e TypeScript.
   - **Ambiente de Dev**: Execução via `tsx` para suporte nativo a ESM/TypeScript sem necessidade de build intermediário.

2. **Comunicação com o Banco de Dados (MySQL)**:
   - **Definição**: Driver `mysql2` utilizando Connection Pool.
   - **Infraestrutura**: Instância isolada no Docker Compose na porta `3306`.

3. **Regra Matemática e Trava da Expulsão**:
   - **Definição**: Evento acumulativo por torcedor.
   - **Mecanismo**: Constraint `UNIQUE (user_id, match_id, player_id)` na tabela `expulsion_votes`. Cada torcedor autenticado registra exatamente 1 voto de intenção por jogador em determinada partida.

4. **Tratamento da Fonte de Dados de Futebol**:
   - **Definição**: Dataset nativo persistido no MySQL contendo os 11 titulares e posições reais dos 5 clubes (Palmeiras, Bahia, Corinthians, São Paulo e Vasco da Gama) e histórico de partidas recentes.

5. **Escalação Pessoal vs. Comunidade**:
   - **Definição**: A prancheta tática visual edita apenas o estado local/privado da escalação do usuário. Apenas ao clicar em "Salvar Escalação", ela é publicada no Feed da Comunidade para votação geral.