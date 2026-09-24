import { useEffect, useState } from "react";
import { listCommunityLineups, voteForLineup } from "../services/lineupApi";
import { getStoredUser } from "../services/auth";
import type { Lineup } from "../types/lineup";
import { getFormationSlots } from "../config/formations";

export default function CommunityLineupsPage() {
  const [lineups, setLineups] = useState<Lineup[]>([]);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState<string[]>([]);
  const favoriteTeam = getStoredUser()?.favoriteTeam;

  useEffect(() => {
    listCommunityLineups()
      .then((data) => setLineups(data))
      .catch(() => setLineups([]))
      .finally(() => setLoading(false));
  }, []);

  async function vote(id?: string) {
    if (!id || voted.includes(id)) return;
    const result = await voteForLineup(id);
    setVoted((current) => [...current, id]);
    setLineups((current) => current.map((lineup) => lineup.id === id ? { ...lineup, voteCount: result.voteCount } : lineup));
  }

  return (
    <main className="page-shell">
      <div className="page-heading"><div><span className="eyebrow">COMUNIDADE</span><h1>Feed da comunidade</h1><p>Escalações publicadas por torcedores de {favoriteTeam?.name ?? "seu time"}.</p></div></div>
      {loading ? <p className="muted">Carregando escalações...</p> : null}
      {!loading && lineups.length === 0 ? <p className="empty-state">Ainda não há escalações publicadas para {favoriteTeam?.name ?? "seu time"}.</p> : null}
      <div className="community-grid">
      {lineups.map((lineup) => (
        <article className="community-card" key={lineup.id ?? lineup.authorName}>
          <div className="card-meta"><strong>{lineup.authorName ?? "Torcedor"}</strong></div>
          <div className="mini-pitch" aria-label={`Escalação ${lineup.formation}`}>
            <span className="pitch-box pitch-box--top" aria-hidden="true" />
            <span className="pitch-box pitch-box--bottom" aria-hidden="true" />
            {(lineup.playerNames ?? lineup.playerIds ?? []).slice(0, 11).map((name, index) => (
              <span key={`${name}-${index}`} className={`mini-player mini-player--${getFormationSlots(lineup.formation)[index].lane}`} style={{ left: `${getFormationSlots(lineup.formation)[index].left}%`, top: `${getFormationSlots(lineup.formation)[index].top}%` }} title={String(name)}>
                <b>{index + 1}</b><small>{String(name).slice(0, 12)}</small>
              </span>
            ))}
          </div>
          <div className="card-meta"><span>Formação {lineup.formation}</span><button className="vote-button" type="button" disabled={!lineup.id || (lineup.id ? voted.includes(lineup.id) : false)} onClick={() => vote(lineup.id)}>{lineup.id && voted.includes(lineup.id) ? "Votado" : "♡ Vote"}</button></div>
          <strong className="vote-counter">{lineup.voteCount ?? 0} {lineup.voteCount === 1 ? "voto" : "votos"}</strong>
        </article>
      ))}
      </div>
    </main>
  );
}
