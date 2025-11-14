import { COLORS_ROTATION, SelectionItem } from "../types/core";
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

    const itemsWithoutColors = await Promise.all(
      Object.entries(usableGenerators).map(async ([_, generator]) => {
        const thisInstanceItems = await new generator().parse({
          config,
          colorIndex,
        });
        return thisInstanceItems;
      })
    );
    const items = itemsWithoutColors
      .map((item) => {
        return {
          ...item,
          color: COLORS_ROTATION[+colorIndex % COLORS_ROTATION.length],
        };
      })
      .flat();

    log.debug(`Generated ${items.length} selection items`);
    return items;
  }
}
