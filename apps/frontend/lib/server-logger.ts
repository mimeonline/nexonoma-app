import "server-only";
import * as fs from "node:fs";
import * as path from "node:path";

type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

type LogMeta = {
  error?: unknown;
  context?: string;
};

const serviceName = "app";
let logStream: fs.WriteStream | null | undefined;

export const serverLogger = {
  info(message: string, meta?: LogMeta) {
    write("INFO", message, meta);
  },
  warn(message: string, meta?: LogMeta) {
    write("WARN", message, meta);
  },
  error(message: string, meta?: LogMeta) {
    write("ERROR", message, meta);
  },
  debug(message: string, meta?: LogMeta) {
    write("DEBUG", message, meta);
  },
};

function write(level: LogLevel, message: string, meta?: LogMeta) {
  const line = formatLine(level, message, meta);

  switch (level) {
    case "ERROR":
      console.error(line);
      break;
    case "WARN":
      console.warn(line);
      break;
    case "DEBUG":
      console.debug(line);
      break;
    default:
      console.log(line);
  }

  const stream = getLogStream();
  if (stream) {
    stream.write(`${line}\n`);
  }
}

function getLogStream(): fs.WriteStream | null {
  if (logStream !== undefined) return logStream;
  logStream = createLogStream(serviceName);
  return logStream;
}

function createLogStream(service: string): fs.WriteStream | null {
  const logFile = resolveLogFile(service);
  if (!logFile) return null;

  try {
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
    return fs.createWriteStream(logFile, { flags: "a" });
  } catch (error) {
    console.warn(`[serverLogger] Failed to create log file at ${logFile}:`, error);
    return null;
  }
}

function resolveLogFile(service: string): string | null {
  const explicitFile = process.env.LOG_FILE?.trim();
  if (explicitFile) return explicitFile;

  const logDir = process.env.LOG_DIR?.trim();
  if (!logDir) return null;

  return path.join(logDir, `${service}.log`);
}

function formatLine(level: LogLevel, message: string, meta?: LogMeta) {
  const timestamp = new Date().toISOString();
  const contextLabel = meta?.context ? ` [${meta.context}]` : "";
  const errorText = meta?.error ? `\n${stringify(meta.error)}` : "";

  return `${timestamp} [${level}]${contextLabel} ${message}${errorText}`.trim();
}

function stringify(value: unknown) {
  if (value instanceof Error) return value.stack ?? value.message;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || value === null || value === undefined) {
    return String(value);
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
