import {
  Colors,
  COLORS_ROTATION,
  SelectionItem,
  SingleAdapterOutput,
} from "../types/core";
import { log } from "../utils/logger";
import { ConfigManager } from "./config-manager";

export class PayloadGenerator {
  static async generate({
    configManager,
  }: {
    configManager: ConfigManager;
  }): Promise<SelectionItem[]> {
    const config = configManager.getConfig();

    const usableGenerators = await configManager.getUsableGenerators();

    const items = await Promise.all(
      Object.entries(usableGenerators).map(
        async ([_, generator]) => await new generator().parse({ config })
      )
    );

    const flattenedItems = this.flattenAndAssignColors(items);

    log.debug(`Generated ${flattenedItems.length} selection items`);
    return flattenedItems;
  }

  private static flattenAndAssignColors(
    items: Array<SingleAdapterOutput>
  ): SelectionItem[] {
    const result: SelectionItem[] = [];
    let colorIndex = 0;

    for (const singleGeneratorItem of items) {
      // Case 1: SelectionItem[]
      if (!Array.isArray(singleGeneratorItem[0])) {
        const color = this.pickColor(colorIndex++);
        (singleGeneratorItem as SelectionItem[]).forEach((item) =>
          result.push({ ...item, color })
        );
        continue;
      }

      // Case 2: SelectionItem[][]
      for (const subgroup of singleGeneratorItem as SelectionItem[][]) {
        const color = this.pickColor(colorIndex++);
        subgroup.forEach((item) => result.push({ ...item, color }));
      }
    }

    return result;
  }

  private static pickColor(colorIndex: number): Colors {
    return COLORS_ROTATION[colorIndex % COLORS_ROTATION.length];
  }
}
