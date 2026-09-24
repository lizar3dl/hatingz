// Responsável: Enzo
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MatchCardView from '../components/MatchCard';
import api from '../services/api';
import type { MatchCard } from '../types/api';

export default function DashboardPage() {
  const [matches, setMatches] = useState<MatchCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<MatchCard[]>('/matches').then((response) => setMatches(response.data)).finally(() => setLoading(false));
  }, []);

  return (
    <main className="page-shell">
      <div className="page-heading"><div><span className="eyebrow">PAINEL</span><h1>Jogos em destaque</h1><p>Acompanhe as partidas do seu time e participe das decisões.</p></div><Link className="primary-button" to="/lineups">Montar escalação</Link></div>
      {loading ? <p className="muted">Carregando jogos...</p> : null}
      {!loading && matches.length === 0 ? <p className="empty-state">Nenhum jogo encontrado para seu time.</p> : null}
      {matches.map((match) => (
        <div key={match.id} className="match-row">
          <MatchCardView match={match} voteHref={`/matches/${match.id}/vote`} />
        </div>
      ))}
    </main>
  );
}
