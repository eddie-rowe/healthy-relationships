export type Mode = "check-in" | "appreciate" | "raise-concern" | "work-through-it" | "repair";

export type Role = "speaker" | "listener";

export type Rating = "yes" | "somewhat" | "no";

// Step types per mode
export type CheckInStep = "waiting" | "mode-select" | "share-a" | "validate-a" | "share-b" | "validate-b" | "rating" | "results";
export type AppreciateStep = "waiting" | "mode-select" | "appreciate-a" | "acknowledge-a" | "appreciate-b" | "acknowledge-b" | "results";
export type RaiseConcernStep = "waiting" | "mode-select" | "statement" | "paraphrase" | "confirm" | "rating" | "results";
export type WorkThroughItStep = "waiting" | "mode-select" | "speak-a" | "mirror-a" | "validate-a" | "empathize-a" | "speak-b" | "mirror-b" | "validate-b" | "empathize-b" | "rating" | "results";
export type RepairStep = "waiting" | "mode-select" | "feelings" | "realities-a" | "realities-b" | "triggers-a" | "triggers-b" | "responsibility-a" | "responsibility-b" | "plan" | "rating" | "results";

export type Step = CheckInStep | AppreciateStep | RaiseConcernStep | WorkThroughItStep | RepairStep;

export interface RoomState {
  mode: Mode | null;
  step: string;
  speakerId: string | null;
  listenerId: string | null;
  data: Record<string, unknown>;
  ratings: { speaker: Rating | null; listener: Rating | null };
}

// Server -> Client messages
export interface StateUpdateMessage {
  type: "state-update";
  state: RoomState;
  yourRole: Role;
}

export interface ErrorMessage {
  type: "error";
  message: string;
}

export type ServerMessage = StateUpdateMessage | ErrorMessage;

// Client -> Server messages
export interface JoinMessage {
  type: "join";
  role: Role;
}

export interface SetModeMessage {
  type: "set-mode";
  mode: Mode;
}

export interface SubmitStepMessage {
  type: "submit-step";
  payload: Record<string, unknown>;
}

export interface SubmitRatingMessage {
  type: "submit-rating";
  rating: Rating;
}

export interface StartSessionMessage {
  type: "start-session";
}

export interface ResetRoomMessage {
  type: "reset-room";
}

export type ClientMessage = JoinMessage | SetModeMessage | SubmitStepMessage | SubmitRatingMessage | StartSessionMessage | ResetRoomMessage;
