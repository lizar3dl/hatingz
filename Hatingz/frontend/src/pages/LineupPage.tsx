import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import TacticalPitch from "../components/TacticalPitch";
import api from "../services/api";
import { getStoredUser } from "../services/auth";
import { FORMATION_OPTIONS } from "../config/formations";
import type { LineupFormation } from "../types/lineup";

const TEAM_PLAYERS = [
  { id: "bahia-1", name: "Marcos Felipe", position: "GOL", shirtNumber: 1 },
  { id: "bahia-2", name: "Cicinho", position: "LD", shirtNumber: 2 },
  { id: "bahia-3", name: "Gabriel Xavier", position: "ZAG", shirtNumber: 5 },
  { id: "bahia-4", name: "Kanu", position: "ZAG", shirtNumber: 13 },
  { id: "bahia-5", name: "Ademir", position: "VOL", shirtNumber: 6 },
  { id: "bahia-6", name: "Everaldo", position: "VOL", shirtNumber: 11 },
  { id: "bahia-7", name: "Breno", position: "MEI", shirtNumber: 7 },
  { id: "bahia-8", name: "Thaciano", position: "ATA", shirtNumber: 17 },
  { id: "bahia-9", name: "Luciano Juba", position: "ATA", shirtNumber: 9 },
  { id: "bahia-10", name: "Cauly", position: "ATA", shirtNumber: 21 },
  { id: "bahia-11", name: "Rafael Ratão", position: "ATA", shirtNumber: 22 },
];

export default function LineupPage() {
  const favoriteTeam = getStoredUser()?.favoriteTeam;
  const [selectedIds, setSelectedIds] = useState<(string | null)[]>(["bahia-1", "bahia-2", "bahia-3", "bahia-4", "bahia-5", "bahia-6", "bahia-7", "bahia-8", "bahia-9", "bahia-10", "bahia-11"]);
  const [message, setMessage] = useState("");
  const [formation, setFormation] = useState<LineupFormation>("4-3-3");

  const lineup = useMemo(
    () => selectedIds.map((id) => (id ? TEAM_PLAYERS.find((player) => player.id === id) ?? null : null)),
    [selectedIds],
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
        teamSlug: favoriteTeam?.slug ?? "",
        formation,
        playerIds,
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
        <div className="formation-selector" role="group" aria-label="Escolha da formação">
          <span>FORMAÇÃO</span>
          <div>
            {FORMATION_OPTIONS.map((option) => (
              <button key={option} type="button" className={formation === option ? "is-active" : ""} onClick={() => setFormation(option)} aria-pressed={formation === option}>{option}</button>
            ))}
          </div>
        </div>
        <TacticalPitch lineup={lineup} availablePlayers={TEAM_PLAYERS} onRemove={removePlayer} onAdd={addPlayer} formation={formation} />
        <div className="save-bar">
          <span>{selectedIds.filter(Boolean).length}/11 jogadores selecionados</span>
          <button className="primary-button" type="submit" disabled={selectedIds.filter(Boolean).length !== 11 || new Set(selectedIds.filter(Boolean)).size !== 11}>Salvar escalação</button>
        </div>
      </form>
      {message ? <p role="status">{message}</p> : null}
    </main>
  );
}
