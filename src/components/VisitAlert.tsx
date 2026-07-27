"use client";

import { useEffect } from "react";

const STORAGE_KEY = "portfolio-visit-alerted";

export function VisitAlert() {
  useEffect(() => {
    // Only alert once per session
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    sessionStorage.setItem(STORAGE_KEY, "1");

    // Fire and forget — don't block anything
    fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: window.location.pathname + window.location.hash,
        referrer: document.referrer || "",
      }),
    }).catch(() => {});
  }, []);

  return null;
}
