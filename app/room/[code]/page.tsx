"use client";

import { useSearchParams } from "next/navigation";
import { use } from "react";
import RoomProvider, { useRoom } from "@/components/RoomProvider";
import type { Role } from "@/lib/types";

// Shared screens
import WaitingScreen from "@/components/screens/WaitingScreen";
import WaitingForPartner from "@/components/screens/WaitingForPartner";
import ModePickerScreen from "@/components/screens/ModePickerScreen";
import RatingScreen from "@/components/screens/RatingScreen";
import ResultsScreen from "@/components/screens/ResultsScreen";
import ErrorScreen from "@/components/screens/ErrorScreen";

// Check In screens
import CheckInShareScreen from "@/components/screens/check-in/ShareScreen";
import CheckInValidateScreen from "@/components/screens/check-in/ValidateScreen";

// Appreciate screens
import AppreciateScreen from "@/components/screens/appreciate/AppreciateScreen";
import AcknowledgeScreen from "@/components/screens/appreciate/AcknowledgeScreen";

// Raise a Concern screens
import StatementScreen from "@/components/screens/raise-concern/StatementScreen";
import ParaphraseScreen from "@/components/screens/raise-concern/ParaphraseScreen";
import ConfirmScreen from "@/components/screens/raise-concern/ConfirmScreen";

// Work Through It screens
import SpeakScreen from "@/components/screens/work-through-it/SpeakScreen";
import MirrorScreen from "@/components/screens/work-through-it/MirrorScreen";
import WTIValidateScreen from "@/components/screens/work-through-it/ValidateScreen";
import EmpathizeScreen from "@/components/screens/work-through-it/EmpathizeScreen";

// Repair screens
import FeelingsScreen from "@/components/screens/repair/FeelingsScreen";
import RealitiesScreen from "@/components/screens/repair/RealitiesScreen";
import TriggersScreen from "@/components/screens/repair/TriggersScreen";
import ResponsibilityScreen from "@/components/screens/repair/ResponsibilityScreen";
import PlanScreen from "@/components/screens/repair/PlanScreen";

export default function RoomPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as Role) || "speaker";

  return (
    <RoomProvider code={code} role={role}>
      <ScreenRouter code={code} />
    </RoomProvider>
  );
}

function ScreenRouter({ code }: { code: string }) {
  const { state, yourRole, error } = useRoom();

  if (error) return <ErrorScreen message={error} />;
  if (!state) return <LoadingScreen />;

  const { step, mode, data } = state;

  // Pre-mode screens
  if (step === "waiting") return <WaitingScreen code={code} />;
  if (step === "mode-select") {
    if (yourRole === "speaker") return <ModePickerScreen />;
    return <WaitingForPartner message="Your partner is choosing a mode..." />;
  }

  // Shared post-mode screens
  if (step === "rating") return <RatingScreen />;
  if (step === "results") return <ResultsScreen />;

  // Mode-specific routing
  switch (mode) {
    case "check-in":
      return renderCheckIn(step, yourRole!, data);
    case "appreciate":
      return renderAppreciate(step, yourRole!, data);
    case "raise-concern":
      return renderRaiseConcern(step, yourRole!, data);
    case "work-through-it":
      return renderWorkThroughIt(step, yourRole!, data);
    case "repair":
      return renderRepair(step, yourRole!, data);
    default:
      return <ErrorScreen message="Unknown mode" />;
  }
}

// ─── Check In ─────────────────────────────────────────
function renderCheckIn(step: string, role: string, data: Record<string, unknown>) {
  switch (step) {
    case "share-a":
      return role === "speaker"
        ? <CheckInShareScreen />
        : <WaitingForPartner message="Your partner is sharing what's on their mind..." />;
    case "validate-a":
      return role === "listener"
        ? <CheckInValidateScreen partnerText={data.shareA as string} />
        : <WaitingForPartner message="Your partner is reflecting on what you shared..." />;
    case "share-b":
      return role === "listener"
        ? <CheckInShareScreen />
        : <WaitingForPartner message="Your partner is sharing what's on their mind..." />;
    case "validate-b":
      return role === "speaker"
        ? <CheckInValidateScreen partnerText={data.shareB as string} />
        : <WaitingForPartner message="Your partner is reflecting on what you shared..." />;
    default:
      return <ErrorScreen message="Unknown step" />;
  }
}

// ─── Appreciate ───────────────────────────────────────
function renderAppreciate(step: string, role: string, data: Record<string, unknown>) {
  switch (step) {
    case "appreciate-a":
      return role === "speaker"
        ? <AppreciateScreen />
        : <WaitingForPartner message="Your partner is writing an appreciation..." />;
    case "acknowledge-a":
      return role === "listener"
        ? <AcknowledgeScreen appreciation={data.appreciateA as { action: string; feeling: string }} />
        : <WaitingForPartner message="Your partner is reading your appreciation..." />;
    case "appreciate-b":
      return role === "listener"
        ? <AppreciateScreen />
        : <WaitingForPartner message="Your partner is writing an appreciation..." />;
    case "acknowledge-b":
      return role === "speaker"
        ? <AcknowledgeScreen appreciation={data.appreciateB as { action: string; feeling: string }} />
        : <WaitingForPartner message="Your partner is reading your appreciation..." />;
    default:
      return <ErrorScreen message="Unknown step" />;
  }
}

// ─── Raise a Concern ──────────────────────────────────
function renderRaiseConcern(step: string, role: string, data: Record<string, unknown>) {
  switch (step) {
    case "statement":
      return role === "speaker"
        ? <StatementScreen />
        : <WaitingForPartner message="Your partner is sharing a concern..." />;
    case "paraphrase":
      return role === "listener"
        ? <ParaphraseScreen />
        : <WaitingForPartner message="Your partner is reflecting on your concern..." />;
    case "confirm":
      return role === "speaker"
        ? <ConfirmScreen />
        : <WaitingForPartner message="Your partner is checking your paraphrase..." />;
    default:
      return <ErrorScreen message="Unknown step" />;
  }
}

// ─── Work Through It ──────────────────────────────────
function renderWorkThroughIt(step: string, role: string, data: Record<string, unknown>) {
  switch (step) {
    case "speak-a":
      return role === "speaker"
        ? <SpeakScreen />
        : <WaitingForPartner message="Your partner is sharing their perspective..." />;
    case "mirror-a":
      if (role === "listener") {
        return <MirrorScreen partnerText={data.speakA as string} mirror={data.mirrorA as string | null} confirmed={data.mirrorAConfirmed as boolean | null} />;
      }
      if (data.mirrorA && data.mirrorAConfirmed === null) {
        return <MirrorScreen partnerText={data.speakA as string} mirror={data.mirrorA as string} confirmed={null} />;
      }
      return <WaitingForPartner message="Your partner is mirroring what you said..." />;
    case "validate-a":
      return role === "listener"
        ? <WTIValidateScreen partnerText={data.speakA as string} />
        : <WaitingForPartner message="Your partner is validating your perspective..." />;
    case "empathize-a":
      if (role === "listener" && !data.empathizeA) {
        return <EmpathizeScreen empathy={null} confirmed={data.empathizeAConfirmed as boolean | null} />;
      }
      if (data.empathizeA && data.empathizeAConfirmed === null && role === "speaker") {
        return <EmpathizeScreen empathy={data.empathizeA as string} confirmed={null} />;
      }
      if (role === "listener" && data.empathizeAConfirmed === false) {
        return <EmpathizeScreen empathy={null} confirmed={false} />;
      }
      return <WaitingForPartner message="Your partner is empathizing..." />;
    case "speak-b":
      return role === "listener"
        ? <SpeakScreen />
        : <WaitingForPartner message="Your partner is sharing their perspective..." />;
    case "mirror-b":
      if (role === "speaker") {
        return <MirrorScreen partnerText={data.speakB as string} mirror={data.mirrorB as string | null} confirmed={data.mirrorBConfirmed as boolean | null} />;
      }
      if (data.mirrorB && data.mirrorBConfirmed === null) {
        return <MirrorScreen partnerText={data.speakB as string} mirror={data.mirrorB as string} confirmed={null} />;
      }
      return <WaitingForPartner message="Your partner is mirroring what you said..." />;
    case "validate-b":
      return role === "speaker"
        ? <WTIValidateScreen partnerText={data.speakB as string} />
        : <WaitingForPartner message="Your partner is validating your perspective..." />;
    case "empathize-b":
      if (role === "speaker" && !data.empathizeB) {
        return <EmpathizeScreen empathy={null} confirmed={data.empathizeBConfirmed as boolean | null} />;
      }
      if (data.empathizeB && data.empathizeBConfirmed === null && role === "listener") {
        return <EmpathizeScreen empathy={data.empathizeB as string} confirmed={null} />;
      }
      if (role === "speaker" && data.empathizeBConfirmed === false) {
        return <EmpathizeScreen empathy={null} confirmed={false} />;
      }
      return <WaitingForPartner message="Your partner is empathizing..." />;
    default:
      return <ErrorScreen message="Unknown step" />;
  }
}

// ─── Repair ───────────────────────────────────────────
function renderRepair(step: string, role: string, data: Record<string, unknown>) {
  switch (step) {
    case "feelings":
      return <FeelingsScreen />;
    case "realities-a":
      return role === "speaker"
        ? <RealitiesScreen isPersonA={true} />
        : <WaitingForPartner message="Your partner is sharing their perspective..." />;
    case "realities-b":
      return role === "listener"
        ? <RealitiesScreen isPersonA={false} />
        : <WaitingForPartner message="Your partner is reflecting on your perspective..." />;
    case "triggers-a":
      return role === "speaker"
        ? <TriggersScreen />
        : <WaitingForPartner message="Your partner is sharing what triggered them..." />;
    case "triggers-b":
      return role === "listener"
        ? <TriggersScreen />
        : <WaitingForPartner message="Your partner is sharing what triggered them..." />;
    case "responsibility-a":
      return role === "speaker"
        ? <ResponsibilityScreen />
        : <WaitingForPartner message="Your partner is reflecting on their responsibility..." />;
    case "responsibility-b":
      return role === "listener"
        ? <ResponsibilityScreen />
        : <WaitingForPartner message="Your partner is reflecting on their responsibility..." />;
    case "plan":
      return <PlanScreen />;
    default:
      return <ErrorScreen message="Unknown step" />;
  }
}

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-8 h-8 rounded-full border-2 border-violet-200 border-t-violet-600 animate-spin" />
    </div>
  );
}
