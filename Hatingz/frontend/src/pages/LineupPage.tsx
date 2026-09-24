import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import TacticalPitch from "../components/TacticalPitch";
import api from "../services/api";
import { getStoredUser } from "../services/auth";
import { FORMATION_OPTIONS } from "../config/formations";
import type { LineupFormation } from "../types/lineup";

const TEAMS = [
  { id: "team-palmeiras", slug: "palmeiras", name: "Palmeiras" },
  { id: "team-bahia", slug: "bahia", name: "Bahia" },
  { id: "team-corinthians", slug: "corinthians", name: "Corinthians" },
  { id: "team-sao-paulo", slug: "sao-paulo", name: "São Paulo" },
  { id: "team-vasco", slug: "vasco", name: "Vasco" },
];

type AvailablePlayer = {
  id: string;
  name: string;
  team_id: string;
  position: string;
  shirt_number: number;
};

export default function LineupPage() {
  const favoriteTeam = getStoredUser()?.favoriteTeam;
  const initialTeam = TEAMS.find((team) => team.slug === favoriteTeam?.slug) ?? TEAMS[1];
  const [selectedTeamId, setSelectedTeamId] = useState(initialTeam.id);
  const [players, setPlayers] = useState<AvailablePlayer[]>([]);
  const [selectedIds, setSelectedIds] = useState<(string | null)[]>(Array(11).fill(null));
  const [message, setMessage] = useState("");
  const [formation, setFormation] = useState<LineupFormation>("4-3-3");

  useEffect(() => {
    setSelectedIds(Array(11).fill(null));
    setMessage("");
    const selectedTeam = TEAMS.find((team) => team.id === selectedTeamId) ?? TEAMS[1];
    api.get<AvailablePlayer[]>(`/teams/${selectedTeam.slug}/players`)
      .then((response) => setPlayers(response.data))
      .catch(() => setPlayers([]));
  }, [selectedTeamId]);

  const availablePlayers = useMemo(
    () => players.filter((player) => String(player.team_id) === String(selectedTeamId)),
    [players, selectedTeamId],
  );

  const lineup = useMemo(
    () => selectedIds.map((id) => {
      const player = id ? availablePlayers.find((item) => item.id === id) : null;
      return player ? { id: player.id, name: player.name, position: player.position, shirtNumber: player.shirt_number } : null;
    }),
    [availablePlayers, selectedIds],
  );

  function addPlayer(playerId: string, slotIndex?: number) {
    setSelectedIds((current) => {
      if (current.includes(playerId)) return current;
      const target = slotIndex ?? current.findIndex((id) => id === null);
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      next[target] = playerId;
      return next;
    });
  }

  function removePlayer(playerId: string) {
    setSelectedIds((current) => current.map((id) => (id === playerId ? null : id)));
  }

  async function onSave(event: FormEvent) {
    event.preventDefault();
    try {
      const playerIds = selectedIds.filter((id): id is string => Boolean(id));
      if (playerIds.length !== 11 || new Set(playerIds).size !== 11) {
        setMessage("Selecione 11 jogadores diferentes");
        return;
      }
      await api.post("/lineups", {
        team_id: selectedTeamId,
        formation,
        player_ids: playerIds.map(String),
        isPublished: true,
      });
      setMessage("Lineup saved successfully");
    } catch (error) {
      if (axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Não foi possível salvar a escalação");
      }
    }
  }

  return (
    <main className="page-shell">
      <div className="page-heading"><div><span className="eyebrow">ESCALAÇÃO</span><h1>Prancheta tática</h1><p>Monte seu time e escolha o desenho da rodada.</p></div><span className="formation-badge">Formação {formation}</span></div>
      <form className="lineup-form" onSubmit={onSave}>
        <label>
          TIME
          <select value={selectedTeamId} onChange={(event) => setSelectedTeamId(event.target.value)}>
            {TEAMS.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
          </select>
        </label>
        <div className="formation-selector" role="group" aria-label="Escolha da formação">
          <span>FORMAÇÃO</span>
          <div>
            {FORMATION_OPTIONS.map((option) => (
              <button key={option} type="button" className={formation === option ? "is-active" : ""} onClick={() => setFormation(option)} aria-pressed={formation === option}>{option}</button>
            ))}
          </div>
        </div>
        <TacticalPitch
          lineup={lineup}
          availablePlayers={availablePlayers.map((player) => ({
            id: player.id,
            name: player.name,
            position: player.position,
            shirtNumber: player.shirt_number,
          }))}
          onRemove={removePlayer}
          onAdd={addPlayer}
          formation={formation}
        />
        <div className="save-bar">
          <span>{selectedIds.filter(Boolean).length}/11 jogadores selecionados</span>
          <button className="primary-button" type="submit" disabled={selectedIds.filter(Boolean).length !== 11 || new Set(selectedIds.filter(Boolean)).size !== 11}>Salvar escalação</button>
        </div>
      </form>
      {message ? <p role="status">{message}</p> : null}
    </main>
  );
}
