"use client";

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";
import usePartySocket from "partysocket/react";
import type { RoomState, Role, ServerMessage, ClientMessage } from "@/lib/types";

interface RoomContextValue {
  state: RoomState | null;
  yourRole: Role | null;
  connected: boolean;
  error: string | null;
  send: (msg: ClientMessage) => void;
}

const RoomContext = createContext<RoomContextValue>({
  state: null,
  yourRole: null,
  connected: false,
  error: null,
  send: () => {},
});

export function useRoom() {
  return useContext(RoomContext);
}

interface RoomProviderProps {
  code: string;
  role: Role;
  children: ReactNode;
}

export default function RoomProvider({ code, role, children }: RoomProviderProps) {
  const [state, setState] = useState<RoomState | null>(null);
  const [yourRole, setYourRole] = useState<Role | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<ReturnType<typeof usePartySocket> | null>(null);

  const ws = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST!,
    room: code.toLowerCase(),
    query: { role },
    onOpen() {
      setConnected(true);
      setError(null);
    },
    onMessage(event) {
      try {
        const msg: ServerMessage = JSON.parse(event.data);
        if (msg.type === "state-update") {
          setState(msg.state);
          setYourRole(msg.yourRole);
        } else if (msg.type === "error") {
          setError(msg.message);
        }
      } catch {
        // ignore parse errors
      }
    },
    onClose() {
      setConnected(false);
    },
    onError() {
      setError("Connection lost. Trying to reconnect...");
    },
  });

  wsRef.current = ws;

  const send = useCallback((msg: ClientMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  return (
    <RoomContext.Provider value={{ state, yourRole, connected, error, send }}>
      {children}
    </RoomContext.Provider>
  );
}
