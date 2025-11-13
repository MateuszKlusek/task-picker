import { Config, SelectionItem } from "../types/core";

export abstract class FileAdapterAbstract {
  abstract parse({
    config,
    colorIndex,
    fileName,
  }: {
    config?: Config;
    colorIndex: number;
    fileName: string;
  }): Promise<SelectionItem[]>;
}
