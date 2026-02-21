import type * as Party from "partykit/server";
import type { ClientMessage, Role, Rating, Mode } from "../lib/types";

interface RoomState {
  mode: Mode | null;
  step: string;
  speakerId: string | null;
  listenerId: string | null;
  data: Record<string, unknown>;
  ratings: { speaker: Rating | null; listener: Rating | null };
}

const MODE_STEPS: Record<string, string[]> = {
  "check-in": ["waiting", "mode-select", "share-a", "validate-a", "share-b", "validate-b", "rating", "results"],
  "appreciate": ["waiting", "mode-select", "appreciate-a", "acknowledge-a", "appreciate-b", "acknowledge-b", "results"],
  "raise-concern": ["waiting", "mode-select", "statement", "paraphrase", "confirm", "rating", "results"],
  "work-through-it": ["waiting", "mode-select", "speak-a", "mirror-a", "validate-a", "empathize-a", "speak-b", "mirror-b", "validate-b", "empathize-b", "rating", "results"],
  "repair": ["waiting", "mode-select", "feelings", "realities-a", "realities-b", "triggers-a", "triggers-b", "responsibility-a", "responsibility-b", "plan", "rating", "results"],
};

function initialState(): RoomState {
  return {
    mode: null,
    step: "waiting",
    speakerId: null,
    listenerId: null,
    data: {},
    ratings: { speaker: null, listener: null },
  };
}

export default class Server implements Party.Server {
  state: RoomState;

  constructor(readonly room: Party.Room) {
    this.state = initialState();
  }

  getConnectionCount(): number {
    let count = 0;
    for (const _ of this.room.getConnections()) {
      count++;
    }
    return count;
  }

  broadcastState() {
    for (const conn of this.room.getConnections()) {
      const role = conn.id === this.state.speakerId ? "speaker" : "listener";
      conn.send(JSON.stringify({
        type: "state-update",
        state: this.state,
        yourRole: role,
      }));
    }
  }

  advanceStep() {
    if (!this.state.mode) return;
    const steps = MODE_STEPS[this.state.mode];
    if (!steps) return;
    const currentIndex = steps.indexOf(this.state.step);
    if (currentIndex >= 0 && currentIndex < steps.length - 1) {
      this.state.step = steps[currentIndex + 1];
    }
  }

  goToStep(step: string) {
    this.state.step = step;
  }

  onConnect(connection: Party.Connection, ctx: Party.ConnectionContext) {
    const url = new URL(ctx.request.url);
    const role = url.searchParams.get("role") as Role | null;

    if (!this.state.speakerId && role === "speaker") {
      this.state.speakerId = connection.id;
    } else if (!this.state.listenerId && role === "listener") {
      this.state.listenerId = connection.id;
      // Both players connected - advance from waiting
      if (this.state.speakerId && this.state.step === "waiting") {
        this.state.step = "mode-select";
      }
    } else if (!this.state.speakerId && !role) {
      // No role specified, assign speaker
      this.state.speakerId = connection.id;
    } else if (!this.state.listenerId && !role) {
      this.state.listenerId = connection.id;
      if (this.state.speakerId && this.state.step === "waiting") {
        this.state.step = "mode-select";
      }
    } else {
      // Room is full
      connection.send(JSON.stringify({ type: "error", message: "Room is full" }));
      connection.close();
      return;
    }

    this.broadcastState();
  }

  onClose(connection: Party.Connection) {
    // Mark the disconnected player
    if (connection.id === this.state.speakerId) {
      this.state.speakerId = null;
    } else if (connection.id === this.state.listenerId) {
      this.state.listenerId = null;
    }

    // If both gone, reset
    if (!this.state.speakerId && !this.state.listenerId) {
      this.state = initialState();
      return;
    }

    this.broadcastState();
  }

  onMessage(message: string, sender: Party.Connection) {
    let data: ClientMessage;
    try {
      data = JSON.parse(message);
    } catch {
      return;
    }

    switch (data.type) {
      case "join":
        this.handleJoin(data.role, sender);
        break;
      case "set-mode":
        this.handleSetMode(data.mode);
        break;
      case "submit-step":
        this.handleSubmitStep(data.payload, sender);
        break;
      case "submit-rating":
        this.handleSubmitRating(data.rating, sender);
        break;
    }
  }

  handleJoin(role: Role, sender: Party.Connection) {
    // Reconnection: if the sender's role slot is empty, reassign
    if (role === "speaker" && !this.state.speakerId) {
      this.state.speakerId = sender.id;
    } else if (role === "listener" && !this.state.listenerId) {
      this.state.listenerId = sender.id;
    }

    if (this.state.speakerId && this.state.listenerId && this.state.step === "waiting") {
      this.state.step = "mode-select";
    }

    this.broadcastState();
  }

  handleSetMode(mode: Mode) {
    if (this.state.step !== "mode-select") return;
    this.state.mode = mode;
    const steps = MODE_STEPS[mode];
    // Go to the first "real" step (after mode-select)
    this.state.step = steps[2]; // skip "waiting" and "mode-select"
    this.broadcastState();
  }

  handleSubmitStep(payload: Record<string, unknown>, sender: Party.Connection) {
    const senderRole = sender.id === this.state.speakerId ? "speaker" : "listener";
    const mode = this.state.mode;
    if (!mode) return;

    switch (mode) {
      case "check-in":
        this.handleCheckInStep(payload, senderRole);
        break;
      case "appreciate":
        this.handleAppreciateStep(payload, senderRole);
        break;
      case "raise-concern":
        this.handleRaiseConcernStep(payload, senderRole);
        break;
      case "work-through-it":
        this.handleWorkThroughItStep(payload, senderRole);
        break;
      case "repair":
        this.handleRepairStep(payload, senderRole);
        break;
    }

    this.broadcastState();
  }

  // ─── Check In ─────────────────────────────────────────
  handleCheckInStep(payload: Record<string, unknown>, senderRole: string) {
    const step = this.state.step;

    if (step === "share-a" && senderRole === "speaker") {
      this.state.data.shareA = payload.text;
      this.advanceStep();
    } else if (step === "validate-a" && senderRole === "listener") {
      this.state.data.validateA = payload.text;
      this.advanceStep();
    } else if (step === "share-b" && senderRole === "listener") {
      this.state.data.shareB = payload.text;
      this.advanceStep();
    } else if (step === "validate-b" && senderRole === "speaker") {
      this.state.data.validateB = payload.text;
      this.advanceStep();
    }
  }

  // ─── Appreciate ───────────────────────────────────────
  handleAppreciateStep(payload: Record<string, unknown>, senderRole: string) {
    const step = this.state.step;

    if (step === "appreciate-a" && senderRole === "speaker") {
      this.state.data.appreciateA = payload;
      this.advanceStep();
    } else if (step === "acknowledge-a" && senderRole === "listener") {
      this.state.data.acknowledgeA = true;
      this.advanceStep();
    } else if (step === "appreciate-b" && senderRole === "listener") {
      this.state.data.appreciateB = payload;
      this.advanceStep();
    } else if (step === "acknowledge-b" && senderRole === "speaker") {
      this.state.data.acknowledgeB = true;
      this.advanceStep();
    }
  }

  // ─── Raise a Concern ──────────────────────────────────
  handleRaiseConcernStep(payload: Record<string, unknown>, senderRole: string) {
    const step = this.state.step;

    if (step === "statement" && senderRole === "speaker") {
      this.state.data.emotion = payload.emotion;
      this.state.data.situation = payload.situation;
      this.state.data.need = payload.need;
      this.advanceStep();
    } else if (step === "paraphrase" && senderRole === "listener") {
      this.state.data.paraphrase = payload.text;
      this.advanceStep();
    } else if (step === "confirm" && senderRole === "speaker") {
      if (payload.accurate) {
        this.state.data.confirmResult = "accurate";
        this.advanceStep();
      } else {
        this.state.data.confirmResult = "not-quite";
        // Loop back to statement
        this.goToStep("statement");
      }
    }
  }

  // ─── Work Through It ──────────────────────────────────
  handleWorkThroughItStep(payload: Record<string, unknown>, senderRole: string) {
    const step = this.state.step;

    if (step === "speak-a" && senderRole === "speaker") {
      this.state.data.speakA = payload.text;
      this.advanceStep();
    } else if (step === "mirror-a" && senderRole === "listener") {
      if (payload.type === "mirror") {
        this.state.data.mirrorA = payload.text;
        // Wait for speaker to confirm
        this.state.data.mirrorAConfirmed = null;
        this.broadcastState();
        return; // Don't advance yet
      } else if (payload.type === "confirm") {
        if (payload.accurate) {
          this.state.data.mirrorAConfirmed = true;
          this.advanceStep();
        } else {
          this.state.data.mirrorAConfirmed = false;
          this.state.data.mirrorA = null;
          // Stay on mirror-a for retry
        }
        return;
      }
    } else if (step === "mirror-a" && senderRole === "speaker") {
      // Speaker confirming the mirror
      if (payload.accurate) {
        this.state.data.mirrorAConfirmed = true;
        this.advanceStep();
      } else {
        this.state.data.mirrorAConfirmed = false;
        this.state.data.mirrorA = null;
      }
    } else if (step === "validate-a" && senderRole === "listener") {
      this.state.data.validateA = payload.text;
      this.advanceStep();
    } else if (step === "empathize-a" && senderRole === "listener") {
      this.state.data.empathizeA = payload.text;
      // Wait for speaker to confirm
      this.state.data.empathizeAConfirmed = null;
      this.broadcastState();
      return;
    } else if (step === "empathize-a" && senderRole === "speaker") {
      if (payload.accurate) {
        this.state.data.empathizeAConfirmed = true;
        this.advanceStep();
      } else {
        this.state.data.empathizeAConfirmed = false;
        this.state.data.empathizeA = null;
      }
    } else if (step === "speak-b" && senderRole === "listener") {
      this.state.data.speakB = payload.text;
      this.advanceStep();
    } else if (step === "mirror-b" && senderRole === "speaker") {
      if (payload.type === "mirror") {
        this.state.data.mirrorB = payload.text;
        this.state.data.mirrorBConfirmed = null;
        this.broadcastState();
        return;
      }
    } else if (step === "mirror-b" && senderRole === "listener") {
      if (payload.accurate) {
        this.state.data.mirrorBConfirmed = true;
        this.advanceStep();
      } else {
        this.state.data.mirrorBConfirmed = false;
        this.state.data.mirrorB = null;
      }
    } else if (step === "validate-b" && senderRole === "speaker") {
      this.state.data.validateB = payload.text;
      this.advanceStep();
    } else if (step === "empathize-b" && senderRole === "speaker") {
      this.state.data.empathizeB = payload.text;
      this.state.data.empathizeBConfirmed = null;
      this.broadcastState();
      return;
    } else if (step === "empathize-b" && senderRole === "listener") {
      if (payload.accurate) {
        this.state.data.empathizeBConfirmed = true;
        this.advanceStep();
      } else {
        this.state.data.empathizeBConfirmed = false;
        this.state.data.empathizeB = null;
      }
    }
  }

  // ─── Repair ───────────────────────────────────────────
  handleRepairStep(payload: Record<string, unknown>, senderRole: string) {
    const step = this.state.step;

    if (step === "feelings") {
      if (senderRole === "speaker") {
        this.state.data.feelingsSpeaker = payload.feelings;
      } else {
        this.state.data.feelingsListener = payload.feelings;
      }
      // Advance only when both have submitted
      if (this.state.data.feelingsSpeaker && this.state.data.feelingsListener) {
        this.advanceStep();
      }
    } else if (step === "realities-a" && senderRole === "speaker") {
      this.state.data.realitiesA = payload.text;
      this.advanceStep();
    } else if (step === "realities-b" && senderRole === "listener") {
      this.state.data.realitiesB = payload.text;
      this.advanceStep();
    } else if (step === "triggers-a" && senderRole === "speaker") {
      this.state.data.triggersA = payload.text;
      this.state.data.triggersAStory = payload.story;
      this.advanceStep();
    } else if (step === "triggers-b" && senderRole === "listener") {
      this.state.data.triggersB = payload.text;
      this.state.data.triggersBStory = payload.story;
      this.advanceStep();
    } else if (step === "responsibility-a" && senderRole === "speaker") {
      this.state.data.responsibilityA = payload.text;
      this.advanceStep();
    } else if (step === "responsibility-b" && senderRole === "listener") {
      this.state.data.responsibilityB = payload.text;
      this.advanceStep();
    } else if (step === "plan") {
      if (senderRole === "speaker") {
        this.state.data.planSpeaker = payload.text;
      } else {
        this.state.data.planListener = payload.text;
      }
      if (this.state.data.planSpeaker && this.state.data.planListener) {
        this.advanceStep();
      }
    }
  }

  handleSubmitRating(rating: Rating, sender: Party.Connection) {
    if (this.state.step !== "rating") return;

    if (sender.id === this.state.speakerId) {
      this.state.ratings.speaker = rating;
    } else if (sender.id === this.state.listenerId) {
      this.state.ratings.listener = rating;
    }

    // Advance when both have rated
    if (this.state.ratings.speaker && this.state.ratings.listener) {
      this.advanceStep();
    }

    this.broadcastState();
  }
}
