"use client";

import { useSyncExternalStore } from "react";

export type Market = "in" | "gulf";

const GULF_ZONES = new Set([
  "Asia/Dubai",
  "Asia/Muscat",
  "Asia/Riyadh",
  "Asia/Qatar",
  "Asia/Bahrain",
  "Asia/Kuwait",
]);

let market: Market = "in";
let ready = false;
const listeners = new Set<() => void>();

function detect(): Market {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return GULF_ZONES.has(zone) ? "gulf" : "in";
  } catch {
    return "in";
  }
}

function getSnapshot(): Market {
  if (!ready) {
    ready = true;
    market = detect();
  }
  return market;
}

function getServerSnapshot(): Market {
  return "in";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setMarket(next: Market) {
  ready = true;
  if (next === market) return;
  market = next;
  listeners.forEach((l) => l());
}

/**
 * The market the visitor sells into. One switch re-skins the whole page:
 * signals, sample accounts, drafts, calendar and currency.
 * Starts on India; visitors in a Gulf time zone start on the Gulf.
 */
export function useMarket(): Market {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
