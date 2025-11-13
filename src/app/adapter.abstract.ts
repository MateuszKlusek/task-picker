import { Config, SelectionItem } from "../types/core";

export abstract class FileAdapterAbstract {
  abstract parse(
    config: Config,
    colorIndex: number,
    fileName: string
  ): SelectionItem[];
}
