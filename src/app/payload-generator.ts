import { SelectionItem } from "../types/core";
import { log } from "../utils/logger";
import { ConfigManager } from "./config-manager";

export class PayloadGenerator {
  static async generate({
    configManager,
  }: {
    configManager: ConfigManager;
  }): Promise<SelectionItem[]> {
    let colorIndex = 0;
    const config = configManager.getConfig();

    const usableGenerators = await configManager.getUsableGenerators();
    console.log("usableGenerators", usableGenerators);

    const items = await Promise.all(
      Object.entries(usableGenerators).map(async ([_, generator]) => {
        const g = new generator();
        const thisInstanceItems = await g.parse({
          config,
          colorIndex,
        });
        return thisInstanceItems;
      })
    );

    log.debug(`Generated ${items.length} selection items`);
    return items;
  }
}
