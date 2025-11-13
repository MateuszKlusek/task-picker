import { FileAdapterAbstract } from "../app/adapter.abstract";
import {
  COLORS_ROTATION,
  Config,
  SelectionItem,
  UserCommand,
} from "../types/core";

export class UserCommandsAdapter extends FileAdapterAbstract {
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

    for (const userCmd of userCommands) {
      items.push({
        executableCommand: userCmd.command,
        label: userCmd.label || userCmd.command,
        workDir: userCmd.workDir || "./",
        subcommand: "",
        color: COLORS_ROTATION[colorIndex % COLORS_ROTATION.length],
      });
    }

    return Promise.resolve(items);
  }
}
