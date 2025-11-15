import * as crypto from "crypto";
import { glob } from "fast-glob";
import * as fs from "fs";

export class FileUtils {
  static async findFiles({
    include,
    exclude = [],
  }: {
    include?: string | string[];
    exclude?: string | string[];
  }): Promise<string[]> {
    if (!include) {
      return [];
    }

    const excludePatterns = Array.isArray(exclude) ? exclude : [exclude];

    return await glob(include, {
      absolute: true,
      onlyFiles: true,
      ignore: excludePatterns,
    });
  }

  static generateChecksum(filePath: string): string {
    const content = fs.readFileSync(filePath);
    return crypto.createHash("md5").update(content).digest("hex");
  }

  static ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  static readFile(filePath: string): string {
    return fs.readFileSync(filePath, "utf-8");
  }

  static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  static getFileStats(filePath: string): fs.Stats | null {
    try {
      return fs.statSync(filePath);
    } catch {
      return null;
    }
  }
}
