import { DirExecAdapter } from "../adapters/dir-exec-adapter";
import { PackageJsonAdapter } from "../adapters/package-json-adapter";
import { TaskfileAdapter } from "../adapters/taskfile-adapter";
import { UserCommandsAdapter } from "../adapters/user-commands-adapter";
import { Config, SelectionItem } from "../types/core";
import { FileAdapterAbstract } from "./adapter.abstract";
import { FileUtils } from "../utils/fileUtils";
import { log } from "../utils/logger";

export class PayloadGenerator {
  static async generate(config: Config): Promise<SelectionItem[]> {
    const items: SelectionItem[] = [];

    let colorIndex = 0;

    const foundFiles = await FileUtils.findFiles(
      config.root,
      config.filesSearchInclude
    );

    log.debug(`Found config files: ${foundFiles.join(", ")}`);

    for (const fileNameFullPath of foundFiles) {
      const fileName = fileNameFullPath.split("/").pop();
      if (!fileName) {
        continue;
      }

      const adapter = adapterMap?.[fileName.toLowerCase()];
      if (!adapter) {
        continue;
      }

      const adapterInstance = new adapter();
      const thisInstanceItems = adapterInstance.parse(
        config,
        colorIndex,
        fileNameFullPath
      );

      if (thisInstanceItems.length > 0) {
        colorIndex++;
        items.push(...thisInstanceItems);
      }
    }

    // Parse user commands
    const userItems = UserCommandsAdapter.parse(
      config.userCommands,
      colorIndex
    );
    items.push(...userItems);

    // Parse dirExe
    const dirExecItems = new DirExecAdapter().parse(config, colorIndex);
    items.push(...dirExecItems);

    log.debug(`Generated ${items.length} selection items`);
    return items;
  }
}

const adapterMap: Record<string, new () => FileAdapterAbstract> = {
  "package.json": PackageJsonAdapter,
  "taskfile.yml": TaskfileAdapter,
  "taskfile.yaml": TaskfileAdapter,
};
