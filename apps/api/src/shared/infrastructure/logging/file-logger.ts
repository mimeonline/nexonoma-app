import { LoggerService } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'VERBOSE';

export class FileLogger implements LoggerService {
  private readonly logStream: fs.WriteStream | null;

  constructor({ serviceName }: { serviceName: string }) {
    this.logStream = createLogStream(serviceName);
  }

  log(message: unknown, context?: string) {
    this.write('INFO', message, context);
  }

  error(message: unknown, trace?: string, context?: string) {
    this.write('ERROR', message, context, trace);
  }

  warn(message: unknown, context?: string) {
    this.write('WARN', message, context);
  }

  debug(message: unknown, context?: string) {
    this.write('DEBUG', message, context);
  }

  verbose(message: unknown, context?: string) {
    this.write('VERBOSE', message, context);
  }

  private write(
    level: LogLevel,
    message: unknown,
    context?: string,
    trace?: string,
  ) {
    const line = formatLine(level, message, context, trace);

    switch (level) {
      case 'ERROR':
        console.error(line);
        break;
      case 'WARN':
        console.warn(line);
        break;
      case 'DEBUG':
        console.debug(line);
        break;
      default:
        console.log(line);
    }

    if (this.logStream) {
      this.logStream.write(`${line}\n`);
    }
  }
}

function createLogStream(serviceName: string): fs.WriteStream | null {
  const logFile = resolveLogFile(serviceName);
  if (!logFile) return null;

  try {
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
    return fs.createWriteStream(logFile, { flags: 'a' });
  } catch (error) {
    console.warn(
      `[FileLogger] Failed to create log file at ${logFile}:`,
      error,
    );
    return null;
  }
}

function resolveLogFile(serviceName: string): string | null {
  const explicitFile = process.env.LOG_FILE?.trim();
  if (explicitFile) return explicitFile;

  const logDir = process.env.LOG_DIR?.trim();
  if (!logDir) return null;

  return path.join(logDir, `${serviceName}.log`);
}

function formatLine(
  level: LogLevel,
  message: unknown,
  context?: string,
  trace?: string,
) {
  const timestamp = new Date().toISOString();
  const contextLabel = context ? ` [${context}]` : '';
  const messageText = stringify(message);
  const traceText = trace ? `\n${trace}` : '';

  return `${timestamp} [${level}]${contextLabel} ${messageText}${traceText}`.trim();
}

function stringify(value: unknown) {
  if (value instanceof Error) return value.stack ?? value.message;
  if (typeof value === 'string') return value;
  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null ||
    value === undefined
  ) {
    return String(value);
  }

  try {
    return JSON.stringify(value);
  } catch {
    return Object.prototype.toString.call(value);
  }
}
