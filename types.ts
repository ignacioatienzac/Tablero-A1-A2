export interface Question {
  t: string; // Text
  ok: boolean; // Is grammatically correct?
  ans?: string[]; // Correct answers if 'ok' is false
}

export interface Player {
  id: number;
  name: string;
  color: string;
  position: number; // 0-29
}

export enum GamePhase {
  ROLLING,
  MOVING,
  WAITING_FOR_INTERACTION, // Player must click the tile
  ANSWERING, // Modal is open
  TURN_END_ANIMATION,
  WIN
}

export interface DiceProps {
  value: number;
  rolling: boolean;
  onRoll: () => void;
  disabled: boolean;
}