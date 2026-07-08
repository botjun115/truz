"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { FeedItem, FeedTab } from "@/types/feed";
import { notImplemented } from "@/utils/errors";

export type FeedStatus = "idle" | "loading" | "ready" | "error";

interface FeedContextValue {
  items: FeedItem[];
  tab: FeedTab;
  status: FeedStatus;
  setTab: (tab: FeedTab) => void;
  refresh: () => Promise<void>;
}

const FeedContext = createContext<FeedContextValue | null>(null);

export function FeedProvider({ children }: { children: React.ReactNode }) {
  const [items] = useState<FeedItem[]>([]);
  const [tab, setTab] = useState<FeedTab>("following");
  const [status] = useState<FeedStatus>("idle");

  const refresh = useCallback(async () => notImplemented("FeedContext.refresh"), []);

  const value = useMemo<FeedContextValue>(
    () => ({ items, tab, status, setTab, refresh }),
    [items, tab, status, refresh],
  );

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export function useFeedContext(): FeedContextValue {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error("useFeedContext must be used within a FeedProvider.");
  }
  return context;
}
