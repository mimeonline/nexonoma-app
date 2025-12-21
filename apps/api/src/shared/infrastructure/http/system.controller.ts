import { Controller, Get } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';

@Controller()
export class SystemController {
  @Get('health')
  getHealth() {
    return { status: 'ok' };
  }

  @Get('version')
  getVersion() {
    const version =
      this.readPackageJsonVersion() ?? process.env.VERSION ?? 'unknown';

    return {
      name: 'nexonoma-api',
      version,
      environment: process.env.NODE_ENV ?? 'unknown',
    };
  }

  private readPackageJsonVersion(): string | undefined {
    const candidates = [
      path.join(process.cwd(), 'apps', 'api', 'package.json'),
      path.join(process.cwd(), 'package.json'),
    ];

    for (const filePath of candidates) {
      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(raw) as { version?: string };

        if (parsed.version) {
          return parsed.version;
        }
      } catch {
        continue;
      }
    }

    return undefined;
  }
}
