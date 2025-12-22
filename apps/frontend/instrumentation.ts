export const runtime = "nodejs";

export async function register() {
  if (process.env.NEXT_RUNTIME && process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  if (!hasFileLoggingEnabled()) {
    return;
  }

  const { serverLogger } = await import("./lib/server-logger");
  serverLogger.info("Frontend server started", { context: "startup" });
}

function hasFileLoggingEnabled() {
  return Boolean(process.env.LOG_FILE?.trim() || process.env.LOG_DIR?.trim());
}
