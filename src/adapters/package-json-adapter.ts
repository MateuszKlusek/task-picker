import * as fs from "fs";
import path from "path";
import { FileAdapterAbstract } from "../app/adapter.abstract";
import { COLORS_ROTATION, Config, SelectionItem } from "../types/core";
import { glob } from "fast-glob";

export interface PackageJson {
  scripts?: Record<string, string>;
}

export class PackageJsonAdapter extends FileAdapterAbstract {
  async parse({
    config,
    colorIndex,
  }: {
    config?: Config;
    colorIndex: number;
  }): Promise<SelectionItem[]> {
    try {
      const fileName = "package.json";

      const files = await glob(fileName, {
        absolute: true,
        onlyFiles: true,
      });

      const jsonContent = fs.readFileSync(fileName, "utf-8");
      const packageJson: PackageJson = JSON.parse(jsonContent);

      const items: SelectionItem[] = [];

      if (packageJson.scripts) {
        for (const [name, cmd] of Object.entries(packageJson.scripts)) {
          items.push({
            executableCommand: `npm run ${name}`,
            label: name,
            subcommand: cmd,
            absolutePath: path.dirname(fileName),
            workDir: "./",
            color: COLORS_ROTATION[colorIndex % COLORS_ROTATION.length],
          });
        }
      }

      return items;
    } catch (error) {
      console.error(`Error parsing package.json: ${error}`);
      return [];
    }
  }
}
