import { Config, SingleAdapterOutput } from "../types/core";

export abstract class FileAdapterAbstract {
  abstract parse({ config }: { config?: Config }): Promise<SingleAdapterOutput>;
}
