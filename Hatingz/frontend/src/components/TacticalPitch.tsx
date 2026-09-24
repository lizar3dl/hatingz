import { useState } from "react";
import "../styles/tacticalPitch.css";
import { getFormationSlots } from "../config/formations";
import type { LineupFormation } from "../types/lineup";

export type TacticalPlayer = {
  id: string;
  name: string;
  position: string;
  shirtNumber: number;
};

export type TacticalPitchProps = {
  lineup: (TacticalPlayer | null)[];
  availablePlayers: TacticalPlayer[];
  onRemove: (playerId: string) => void;
  onAdd: (playerId: string, slotIndex?: number) => void;
  formation: LineupFormation;
};

export default function TacticalPitch({ lineup, availablePlayers, onRemove, onAdd, formation }: TacticalPitchProps) {
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const selectedIds = new Set(lineup.filter((player): player is TacticalPlayer => Boolean(player)).map((player) => player.id));
  const pitchSlots = getFormationSlots(formation);

  return (
    <section className="pitch-shell" aria-label={`${formation} tactical pitch`}>
      <div className="pitch-field" role="grid" aria-label="Pitch layout">
        <span className="pitch-box pitch-box--top" aria-hidden="true" />
        <span className="pitch-box pitch-box--bottom" aria-hidden="true" />
        {pitchSlots.map((slot, index) => {
          const player = lineup[index];
          return (
            <div key={slot.id} className={`pitch-slot pitch-slot--${slot.lane} ${player ? "is-filled" : ""}`} data-slot={slot.label} style={{ left: `${slot.left}%`, top: `${slot.top}%` }}>
              {player ? (
                <button type="button" className="player-pill" onClick={() => onRemove(player.id)} aria-label={`Remover ${player.name}`}>
                  <span className="player-number">{player.shirtNumber}</span>
                  <span className="player-name">{player.name}</span>
                </button>
              ) : (
                <button
                  type="button"
                  className={`pitch-empty ${activeSlot === index ? "is-active" : ""}`}
                  onClick={() => setActiveSlot(index)}
                  aria-label={`Selecionar jogador para ${slot.label}`}
                >
                  <strong>+</strong><span>{slot.label}</span><small>Selecione</small>
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="bench" aria-label="Available players">
        {availablePlayers.map((player) => {
          const selected = selectedIds.has(player.id);
          return (
            <button
              key={player.id}
              type="button"
              className="bench-button"
              disabled={selected}
              onClick={() => {
                const targetSlot = activeSlot ?? lineup.findIndex((slot) => !slot);
                if (targetSlot >= 0) {
                  onAdd(player.id, targetSlot);
                  setActiveSlot(null);
                }
              }}
              aria-label={selected ? `Selecionado ${player.name}` : `Adicionar ${player.name}`}
            >
              {player.name} ({player.position})
            </button>
          );
        })}
      </div>
    </section>
  );
}
