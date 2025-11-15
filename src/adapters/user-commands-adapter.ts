import { FileAdapterAbstract } from "../app/adapter.abstract";
import { Config, SelectionItem, SingleAdapterOutput } from "../types/core";

export class UserCommandsAdapter extends FileAdapterAbstract {
  async parse({ config }: { config?: Config }): Promise<SingleAdapterOutput> {
    const items: SelectionItem[] = [];

    for (const userCmd of config?.userCommandsExec || []) {
      items.push({
        executableCommand: userCmd.command,
        label: userCmd.label || userCmd.command,
        workDir: userCmd.workDir || "./",
        subcommand: "",
        absolutePath: "",
      });
    }

    return Promise.resolve(items);
  }
}
