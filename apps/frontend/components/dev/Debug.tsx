// src/components/dev/Debug.tsx

/**
 * DEV ONLY
 * Visual debug helper for inspecting runtime state in the UI.
 * Must never be used in production features.
 *
 * Add to file imports import { Debug } from "@/components/dev/Debug";
 */
export const Debug = ({
  label,
  value,
  open = false,
}: {
  label: string;
  value: unknown; // 'unknown' ist sicherer als 'any'
  open?: boolean;
}) => {
  // In Production gar nicht erst rendern
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="my-4 rounded-lg border border-yellow-500/30 bg-yellow-950/20 text-left text-xs font-mono">
      <details open={open} className="group">
        <summary className="flex cursor-pointer items-center justify-between bg-yellow-900/10 px-4 py-2 text-yellow-200 hover:bg-yellow-900/20">
          <span className="font-bold">🐞 DEBUG: {label}</span>
          <span className="text-[10px] opacity-50 group-open:rotate-180 transition-transform">▼</span>
        </summary>

        <div className="max-h-[400px] overflow-auto p-4 text-yellow-100/80 scrollbar-thin scrollbar-thumb-yellow-700">
          <pre className="whitespace-pre-wrap break-all">{safeStringify(value)}</pre>
        </div>
      </details>
    </div>
  );
};

const safeStringify = (value: unknown) => {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '"<Unserializable value>"';
  }
};
