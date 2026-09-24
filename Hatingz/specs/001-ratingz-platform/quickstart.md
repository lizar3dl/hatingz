# Quickstart: Validar a Plataforma Ratingz

## Pré-requisitos

- Node.js 24 ou superior
- Docker e Docker Compose
- Dependências instaladas nos projetos `backend/` e `frontend/`
- Um arquivo `backend/.env` baseado em `backend/.env.example`, sem credenciais
  compartilhadas no repositório

## Subir o ambiente

1. Inicie o MySQL:

   ```text
   docker compose up -d mysql
   ```

2. Inicialize o esquema e os dados dos cinco clubes e seus jogadores conforme o setup do
   backend.

3. Inicie o BFF e o frontend em terminais separados usando os scripts definidos pelos
   respectivos `package.json`.

## Cenários de validação

### Autenticação e partidas

1. Cadastre um usuário com time do coração Corinthians.
2. Faça login e abra a dashboard.
3. Confirme que todas as partidas exibidas envolvem Corinthians e que os cards mostram
   nomes, escudos, placares, situação e horário.
4. Tente abrir a dashboard sem token e confirme o redirecionamento para login.

### Prancheta e feed

1. Selecione jogadores reais e monte uma formação `4-3-3`.
2. Remova um jogador e confirme que apenas a prancheta pessoal mudou.
3. Salve e publique a escalação.
4. Abra o feed com outro usuário e confirme que a escalação aparece sem IDs numéricos.
5. Vote uma vez e repita o voto; confirme que o total aumenta apenas uma vez.

### Votação de expulsão

1. Abra uma partida do time do usuário.
2. Vote para expulsar um jogador elegível.
3. Confirme o incremento de um no total acumulado.
4. Repita a mesma solicitação com o mesmo usuário, partida e jogador; confirme resposta de
   conflito e contador inalterado.

## Testes automatizados

Execute a suíte backend configurada para Jest/Supertest, incluindo:

- registro, login e rejeição de credenciais inválidas;
- proteção de rotas sem JWT;
- filtragem de partidas pelo time persistido do usuário;
- validação de jogador e isolamento de alterações em escalações;
- unicidade de votos de escalação e votos de expulsão;
- contratos de erro e ausência de IDs numéricos nos payloads da interface.

Valide também o type-check do frontend e backend antes de considerar a implementação
concluída.

## Referências

- Modelo de dados: [data-model.md](./data-model.md)
- Contratos HTTP: [contracts/openapi.yaml](./contracts/openapi.yaml)
- Requisitos: [spec.md](./spec.md)
