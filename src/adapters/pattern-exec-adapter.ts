import fastGlob from "fast-glob";
import path from "path";
import { FileAdapterAbstract } from "../app/adapter.abstract";
import { Config, SelectionItem, SingleAdapterOutput } from "../types/core";

export class PatternExecAdapter extends FileAdapterAbstract {
  async parse({ config }: { config?: Config }): Promise<SingleAdapterOutput> {
    if (!config?.patternExec || config?.patternExec?.length === 0) {
      return [];
    }

    const items = await Promise.all(
      config.patternExec.map(async (pattern) => {
        try {
          const files = await fastGlob.glob(pattern.include, {
            absolute: true,
            onlyFiles: true,
            ignore: pattern.exclude ? [pattern.exclude] : [],
          });

          const tempItems: SelectionItem[] = [];
          for (const file of files) {
            const fileDir = path.dirname(file);
            const relativePath = path.relative(fileDir, process.cwd());

            tempItems.push({
              command: `${pattern.runner} ${file}`.trim(),
              label: `${pattern?.label ?? "run"} ${path.basename(file)}`,
              absolutePath: fileDir,
              relativePath,
              runner: pattern.runner,
            });
          }

          return tempItems;
        } catch (error) {
          console.error(`Error finding files: ${error}`);
          return [];
        }
      })
    );

    return items;
  }
}
