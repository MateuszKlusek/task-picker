import fastGlob from "fast-glob";
import { FileAdapterAbstract } from "../app/adapter.abstract";
import { Config, SelectionItem, SingleAdapterOutput } from "../types/core";

export class PatternExecAdapter extends FileAdapterAbstract {
  async parse({ config }: { config?: Config }): Promise<SingleAdapterOutput> {
    const items: SelectionItem[] = [];

    if (!config?.patternExec || config?.patternExec?.length === 0) {
      return items;
    }

    for (const pattern of config.patternExec) {
      try {
        const files = await fastGlob.glob(pattern.include, {
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
      } catch (error) {
        console.error(`Error finding files: ${error}`);
      }
    }

    return items;
  }
}
