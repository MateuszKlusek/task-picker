import * as fs from "fs";
import path from "path";
import { FileAdapterAbstract } from "../app/adapter.abstract";
import { Config, SelectionItem, SingleAdapterOutput } from "../types/core";
import { FileUtils } from "../utils/fileUtils";
import { log } from "../utils/logger";

export type PackageJson = {
  scripts?: Record<string, string>;
};

export class PackageJsonAdapter extends FileAdapterAbstract {
  async parse({ config }: { config?: Config }): Promise<SingleAdapterOutput> {
    try {
      const files = await FileUtils.findFiles({
        include: config?.packageJsonExec?.include,
        exclude: config?.packageJsonExec?.exclude,
      });

      const items = await Promise.all(
        files.map(async (fileName) => {
          try {
            const jsonContent = await fs.promises.readFile(fileName, "utf-8");
            const packageJson: PackageJson = JSON.parse(jsonContent);
            const fileDir = path.dirname(fileName);
            log.debug({ fileDir, fileName });

            if (packageJson.scripts) {
              const tempItems: SelectionItem[] = [];
              for (const [name, cmd] of Object.entries(packageJson.scripts)) {
                tempItems.push({
                  executableCommand: `${config?.packageJsonExec?.runner} ${name}`,
                  label: name,
                  subcommand: cmd,
                  absolutePath: path.dirname(fileName),
                  workDir: fileDir,
                });
              }
              return tempItems;
            }
            return [];
          } catch (error) {
            console.error(`Error parsing ${fileName}: ${error}`);
            return [];
          }
        })
      );
      return items;
    } catch (error) {
      console.error(`Error parsing package.json: ${error}`);
      return [];
    }
  }
}
