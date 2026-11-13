"use client";

import { useSyncExternalStore } from "react";

/* The website typed into the hero is carried down to the application form. */
let site = "";
const listeners = new Set<() => void>();

export function setSite(next: string) {
  site = next;
  listeners.forEach((l) => l());
}

export function useSite() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
    () => site,
    () => "",
  );
}
