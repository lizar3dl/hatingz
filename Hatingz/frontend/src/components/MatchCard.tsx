import type { MatchCard } from "../types/api";
import { Link } from "react-router-dom";

export default function MatchCardView({ match, voteHref }: { match: MatchCard; voteHref?: string }) {
  return (
    <article className="match-card">
      <div className="match-card__teams">
        <div className="match-team match-team--home"><span>{match.homeTeam.name}</span><strong>{match.homeScore}</strong></div>
        <div className="match-status"><span className="status-chip">{match.status}</span><time dateTime={match.startsAt}>{new Date(match.startsAt).toLocaleString()}</time></div>
        <div className="match-team match-team--away"><strong>{match.awayScore}</strong><span>{match.awayTeam.name}</span></div>
      </div>
      {voteHref ? <Link className="match-vote" to={voteHref}>Votar na expulsão <span aria-hidden="true">→</span></Link> : null}
    </article>
  );
}
