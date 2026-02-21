import type { Mode, Rating } from "./types";

export type AnalyticsEventName =
  | "session_started"
  | "session_completed"
  | "session_abandoned"
  | "step_completed"
  | "not_quite_loop";

export interface AnalyticsEvent {
  event: AnalyticsEventName;
  session_id: string;
  mode: Mode | null;
  step: string;
  duration_seconds?: number;
  rating_speaker?: Rating | null;
  rating_listener?: Rating | null;
  timestamp: string;
}
