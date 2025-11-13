import { glob } from "fast-glob";
import { FileAdapterAbstract } from "../app/adapter.abstract";
import { Config, SelectionItem } from "../types/core";

export class PatternExecAdapter extends FileAdapterAbstract {
  async parse({
    config,
    colorIndex,
    fileName,
  }: {
    config?: Config;
    colorIndex: number;
    fileName: string;
  }): Promise<SelectionItem[]> {
    const items: SelectionItem[] = [];

    if (!config?.patternExec || config?.patternExec?.length === 0) {
      return items;
    }

    for (const pattern of config.patternExec) {
      try {
        const files = await glob(pattern.include, {
          absolute: true,
          onlyFiles: true,
          ignore: pattern.exclude ? [pattern.exclude] : [],
        });

        for (const file of files) {
          items.push({
            executableCommand: `${pattern.runner} ${file}`,
            label: `${pattern?.label || "run"} ${file}`,
            subcommand: "",
            absolutePath: file,
            workDir: "./",
          });
        }

        console.log(files);
      } catch (error) {
        console.error(`Error finding files: ${error}`);
      }
    }

    return items;
  }
}
