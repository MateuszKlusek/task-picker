import * as fs from "fs";
import path from "path";
import { COLORS_ROTATION, Config, SelectionItem } from "../types/core";
import { FileAdapterAbstract } from "../app/adapter.abstract";

export interface PackageJson {
  scripts?: Record<string, string>;
}

export class PackageJsonAdapter extends FileAdapterAbstract {
  parse(
    config: Config,
    colorIndex: number,
    jsonFilePath: string
  ): SelectionItem[] {
    if (!fs.existsSync(jsonFilePath)) {
      return [];
    }

    try {
      const jsonContent = fs.readFileSync(jsonFilePath, "utf-8");
      const packageJson: PackageJson = JSON.parse(jsonContent);

      const items: SelectionItem[] = [];

      if (packageJson.scripts) {
        for (const [name, cmd] of Object.entries(packageJson.scripts)) {
          items.push({
            executableCommand: `npm run ${name}`,
            label: name,
            subcommand: cmd,
            absolutePath: path.dirname(jsonFilePath),
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
