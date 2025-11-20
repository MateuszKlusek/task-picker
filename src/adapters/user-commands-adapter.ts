import path from "path";
import { FileAdapterAbstract } from "../app/adapter.abstract";
import { Config, SelectionItem, SingleAdapterOutput } from "../types/core";

export class UserCommandsAdapter extends FileAdapterAbstract {
  async parse({ config }: { config?: Config }): Promise<SingleAdapterOutput> {
    const items: SelectionItem[] = [];

    for (const {
      command,
      label,
      relativePath,
      runner,
    } of config?.userCommandsExec || []) {
      items.push({
        command: `${runner} ${command}`.trim(),
        label,
        runner,
        relativePath,
        absolutePath: path.join(config?.root || "", relativePath),
      });
    }

    return Promise.resolve(items);
  }
}
