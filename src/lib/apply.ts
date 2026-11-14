"use client";

import { useSyncExternalStore } from "react";

/*
 * What the visitor gives us to read: a website, or a PDF (deck, brochure,
 * case study). Shared between the hero form and the request form below it.
 */
export type Source = "website" | "pdf";

let site = "";
let source: Source = "website";
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function setSite(next: string) {
  site = next;
  emit();
}

export function setSource(next: Source) {
  source = next;
  emit();
}

export function useSite() {
  return useSyncExternalStore(subscribe, () => site, () => "");
}

export function useSource() {
  return useSyncExternalStore(subscribe, () => source, (): Source => "website");
}

/** Scroll to the request form and put the cursor in the first empty field. */
export function goToRequest() {
  const el = document.getElementById("apply");
  if (!el) return;
  el.scrollIntoView({ block: "start" });
  window.setTimeout(
    () => el.querySelector<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true }),
    700,
  );
}
