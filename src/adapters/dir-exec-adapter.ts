import { Config, SelectionItem } from "../types/core";
import { FileAdapterAbstract } from "../app/adapter.abstract";
import { log } from "../utils/logger";

export interface PackageJson {
  scripts?: Record<string, string>;
}

export class DirExecAdapter extends FileAdapterAbstract {
  parse(config: Config, colorIndex: number): SelectionItem[] {
    console.log(config);
    log.debug(`config.dirExec: ${config.dirExec}`);
    return [];
  }
}
