import { Config, SelectionItem } from "../types/core";

export abstract class FileAdapterAbstract {
  abstract parse({
    config,
    colorIndex,
  }: {
    config?: Config;
    colorIndex: number;
  }): Promise<SelectionItem[]>;
}
