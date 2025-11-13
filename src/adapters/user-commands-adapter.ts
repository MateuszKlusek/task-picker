import { COLORS_ROTATION, SelectionItem, UserCommand } from "../types/core";

export class UserCommandsAdapter {
  static parse(
    userCommands: UserCommand[],
    colorIndex: number
  ): SelectionItem[] {
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

    return items;
  }
}
