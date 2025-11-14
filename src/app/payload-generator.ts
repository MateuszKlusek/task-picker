import { PatternExecAdapter } from "../adapters/pattern-exec-adapter";
import { UserCommandsAdapter } from "../adapters/user-commands-adapter";
import { SelectionItem } from "../types/core";
import { FileUtils } from "../utils/fileUtils";
import { log } from "../utils/logger";
import { ConfigManager } from "./config-manager";

export class PayloadGenerator {
  static async generate({
    configManager,
  }: {
    configManager: ConfigManager;
  }): Promise<SelectionItem[]> {
    const items: SelectionItem[] = [];

    let colorIndex = 0;
    const config = configManager.getConfig();

    const foundFiles = await FileUtils.findFiles(
      config.root || "./",
      config.filesSearchInclude || []
    );

    log.debug(`Found config files: ${foundFiles.join(", ")}`);

    const usableGenerators = await configManager.getUsableGenerators();
    console.log("usableGenerators", usableGenerators);

    const i = await Promise.all(
      Object.entries(usableGenerators).map(
        async ([generatorName, generator]) => {
          const g = new generator();
          const thisInstanceItems = await g.parse({
            config,
            colorIndex,
            fileName: "",
          });
          items.push(...thisInstanceItems);
        }
      )
    );

    // for (const fileNameFullPath of foundFiles) {
    //   const fileName = fileNameFullPath.split("/").pop();
    //   if (!fileName) {
    //     continue;
    //   }

    //   const adapter = adapterMap?.[fileName.toLowerCase()];
    //   if (!adapter) {
    //     continue;
    //   }

    //   const adapterInstance = new adapter();
    //   const thisInstanceItems = await adapterInstance.parse({
    //     config,
    //     colorIndex,
    //     fileName: fileNameFullPath,
    //   });

    //   if (thisInstanceItems.length > 0) {
    //     colorIndex++;
    //     items.push(...thisInstanceItems);
    //   }
    // }

    // Parse user commands
    const userItems = await new UserCommandsAdapter().parse({
      config,
      colorIndex,
      fileName: "",
    });
    items.push(...userItems);

    // Parse dirExe
    const patternExecItems = await new PatternExecAdapter().parse({
      config,
      colorIndex,
      fileName: "",
    });
    items.push(...patternExecItems);

    log.debug(`Generated ${items.length} selection items`);
    return items;
  }
}
