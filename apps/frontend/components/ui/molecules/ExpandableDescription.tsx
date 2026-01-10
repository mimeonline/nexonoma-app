"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useId, useMemo, useState, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

interface ExpandableDescriptionProps {
  lines: string[];
  collapsedLines?: number;
  labels: { show: string; hide: string };
  storageKey?: string;
  id?: string;
  className?: string;
  textClassName?: string;
}

type StorageStore = {
  value: boolean;
  initialized: boolean;
  listeners: Set<() => void>;
};

const storageStores = new Map<string, StorageStore>();

function getStore(key: string): StorageStore {
  let store = storageStores.get(key);
  if (!store) {
    store = { value: false, initialized: false, listeners: new Set() };
    storageStores.set(key, store);
  }
  return store;
}

function readStorageValue(key: string) {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(key) === "true";
}

function notifyStore(store: StorageStore) {
  store.listeners.forEach((listener) => listener());
}

function initStoreFromStorage(key: string, store: StorageStore) {
  if (store.initialized || typeof window === "undefined") return;
  store.initialized = true;
  const next = readStorageValue(key);
  if (next !== store.value) {
    store.value = next;
  }
}

function subscribeToStorage(key: string, callback: () => void) {
  const store = getStore(key);
  store.listeners.add(callback);

  const prev = store.value;
  initStoreFromStorage(key, store);
  if (store.value !== prev) {
    queueMicrotask(callback);
  }

  return () => {
    store.listeners.delete(callback);
  };
}

function getSnapshot(key: string) {
  return getStore(key).value;
}

function setStoredExpanded(key: string, value: boolean) {
  const store = getStore(key);
  store.value = value;
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(key, String(value));
  }
  notifyStore(store);
}

export function ExpandableDescription({ lines, collapsedLines = 1, labels, storageKey, id, className, textClassName }: ExpandableDescriptionProps) {
  const generatedId = useId();
  const controlsId = id ?? generatedId;
  const sanitizedLines = useMemo(() => lines.filter((line) => typeof line === "string" && line.trim().length > 0), [lines]);
  const hasHidden = sanitizedLines.length > collapsedLines;
  const storedExpanded = useSyncExternalStore(
    (callback) => (storageKey ? subscribeToStorage(storageKey, callback) : () => undefined),
    () => (storageKey ? getSnapshot(storageKey) : false),
    () => false
  );
  const [localExpanded, setLocalExpanded] = useState(false);
  const expanded = storageKey ? storedExpanded : localExpanded;

  if (sanitizedLines.length === 0) {
    return null;
  }

  const visibleLines = expanded ? sanitizedLines : sanitizedLines.slice(0, Math.max(1, collapsedLines));

  return (
    <div className={cn("space-y-2", className)}>
      <div id={controlsId} className={cn("relative", textClassName, visibleLines.length > 1 && "space-y-2", !expanded && hasHidden && "pb-1")}>
        {visibleLines.map((line, index) => (
          <p key={`${line}-${index}`}>{line}</p>
        ))}
        {!expanded && hasHidden && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-linear-to-b from-transparent via-slate-900/25 to-slate-950"
          />
        )}
      </div>

      {hasHidden && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={controlsId}
          onClick={() => (storageKey ? setStoredExpanded(storageKey, !expanded) : setLocalExpanded((prev) => !prev))}
          className="
            inline-flex items-center gap-1 rounded-md px-1.5 py-1 mt-2
            text-sm font-medium text-slate-200/80
            hover:text-slate-100 hover:bg-white/5
            transition
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexo-ocean/70
            focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950/70"
        >
          <span>{expanded ? labels.hide : labels.show}</span>
          {expanded ? <ChevronUp className="h-4 w-4" aria-hidden="true" /> : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}
