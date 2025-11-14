import { FileAdapterAbstract } from "../app/adapter.abstract";
import { COLORS_ROTATION, Config, SelectionItem } from "../types/core";

export class UserCommandsAdapter extends FileAdapterAbstract {
  async parse({
    config,
    colorIndex,
  }: {
    config?: Config;
    colorIndex: number;
  }): Promise<SelectionItem[]> {
    const items: SelectionItem[] = [];

    for (const userCmd of config?.userCommands || []) {
      items.push({
        executableCommand: userCmd.command,
        label: userCmd.label || userCmd.command,
        workDir: userCmd.workDir || "./",
        subcommand: "",
        color: COLORS_ROTATION[colorIndex % COLORS_ROTATION.length],
        absolutePath: "",
      });
    }

    return Promise.resolve(items);
  }
}
