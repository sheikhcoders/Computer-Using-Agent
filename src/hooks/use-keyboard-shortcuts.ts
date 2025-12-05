"use client";

import { useEffect, useCallback } from "react";

type KeyboardShortcut = {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
  description?: string;
};

/**
 * Hook for managing keyboard shortcuts
 * MUST: Full keyboard support per WAI-ARIA APG
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatch =
          event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey;
        const metaMatch = shortcut.meta ? event.metaKey : !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        // Check if the shortcut uses cmd/ctrl (platform-agnostic)
        const cmdOrCtrl = shortcut.meta || shortcut.ctrl;
        const cmdOrCtrlMatch = cmdOrCtrl
          ? event.metaKey || event.ctrlKey
          : !event.metaKey && !event.ctrlKey;

        if (
          keyMatch &&
          (cmdOrCtrl ? cmdOrCtrlMatch : ctrlMatch && metaMatch) &&
          shiftMatch &&
          altMatch
        ) {
          event.preventDefault();
          shortcut.callback();
          return;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Format keyboard shortcut for display
 * Uses proper symbols for different platforms
 */
export function formatShortcut(shortcut: Omit<KeyboardShortcut, "callback">): string {
  const isMac =
    typeof navigator !== "undefined" && navigator.platform.includes("Mac");

  const parts: string[] = [];

  if (shortcut.ctrl || shortcut.meta) {
    parts.push(isMac ? "⌘" : "Ctrl");
  }
  if (shortcut.alt) {
    parts.push(isMac ? "⌥" : "Alt");
  }
  if (shortcut.shift) {
    parts.push("⇧");
  }

  // Format special keys
  const keyDisplay =
    {
      enter: "↵",
      escape: "Esc",
      arrowup: "↑",
      arrowdown: "↓",
      arrowleft: "←",
      arrowright: "→",
      backspace: "⌫",
      delete: "⌦",
      tab: "⇥",
      space: "Space",
    }[shortcut.key.toLowerCase()] || shortcut.key.toUpperCase();

  parts.push(keyDisplay);

  // Use non-breaking spaces between parts
  // MUST: Use non-breaking spaces to glue terms: ⌘&nbsp;+&nbsp;K
  return parts.join("\u00A0+\u00A0");
}
