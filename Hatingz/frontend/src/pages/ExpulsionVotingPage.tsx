import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { listEligiblePlayers, voteToExpel } from "../services/expulsionVoteApi";
import type { ExpulsionVoteCandidate } from "../types/expulsionVote";

export default function ExpulsionVotingPage() {
  const { matchId } = useParams();
  const [players, setPlayers] = useState<ExpulsionVoteCandidate[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const targetMatchId = matchId ?? "match-corinthians-bahia";

  useEffect(() => {
    listEligiblePlayers(targetMatchId)
      .then((data) => setPlayers(data))
      .catch(() => setPlayers([]))
      .finally(() => setLoading(false));
  }, [targetMatchId]);

  async function vote(playerId: string) {
    try {
      const result = await voteToExpel(targetMatchId, playerId);
      setPlayers((current) => current.map((player) => player.id === playerId ? { ...player, voteCount: result.voteCount, hasVoted: true, state: "voted" } : player));
      setMessage("Voto registrado com sucesso.");
    } catch {
      setPlayers((current) => current.map((player) => player.id === playerId ? { ...player, hasVoted: true, state: "voted" } : player));
      setMessage("Você já votou neste jogador.");
    }
  }

  return (
    <main className="page-shell">
      <div className="page-heading"><div><span className="eyebrow">MATCH CENTER</span><h1>Votação por expulsão</h1><p>Escolha o jogador que mais comprometeu o desempenho no jogo.</p></div><span className="live-badge">● AO VIVO</span></div>
      {loading ? <p className="muted">Carregando jogadores elegíveis...</p> : null}
      {!loading && players.length === 0 ? <p className="empty-state">Sem jogadores elegíveis.</p> : null}
      <div className="candidate-grid">
      {players.map((player) => (
        <article className={`candidate-card ${player.hasVoted ? "is-voted" : ""}`} key={player.id}>
          <div className="candidate-avatar">{player.name.slice(0, 1)}</div>
          <div className="candidate-info"><strong>{player.name}</strong><span>{player.position} · {player.teamName}</span></div>
          <div className="candidate-votes"><strong>{player.voteCount ?? 0}</strong><span>votos</span></div>
          <button className="vote-button" type="button" disabled={player.hasVoted} onClick={() => vote(player.id)} aria-label={`Votar para expulsar ${player.name}`}>{player.hasVoted ? "Votado" : "Votar"}</button>
        </article>
      ))}
      </div>
      {message ? <p role="status">{message}</p> : null}
    </main>
  );
}
