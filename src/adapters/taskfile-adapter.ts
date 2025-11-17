import * as fs from "fs";
import * as yaml from "js-yaml";
import {
  COLORS_ROTATION,
  Config,
  SelectionItem,
  SingleAdapterOutput,
} from "../types/core";
import { FileAdapterAbstract } from "../app/adapter.abstract";
import { FileUtils } from "../utils/fileUtils";

// https://taskfile.dev/docs/guide#task

export type Task = {
  desc?: string;
  cmds?: string[];
  vars?: Record<string, string | number | boolean>;
  deps?: string[];
  silent?: boolean;
  ignoreError?: boolean;
  preconditions?: string[];
  [key: string]: any;
};

export type Taskfile = {
  version?: string | number;
  tasks?: Record<string, Task>;
  [key: string]: any;
};

export class TaskfileAdapter extends FileAdapterAbstract {
  async parse({ config }: { config?: Config }): Promise<SingleAdapterOutput> {
    try {
      const yamlContent = FileUtils.readFile(config?.taskfileExec?.include);
      const taskfile: Taskfile = yaml.load(yamlContent) as Taskfile;

      const items: SelectionItem[] = [];

      const tasks = taskfile?.tasks;
      if (!tasks) {
        return items;
      }

      for (const [taskName, task] of Object.entries(tasks)) {
        if (task.cmds && task.cmds.length > 0) {
          const command = task.cmds.join(" && ");
          const label = task.desc || taskName;

          items.push({
            executableCommand: command,
            label,
            subcommand: "",
            workDir: "./",
            absolutePath: "",
          });
        }
      }

      return items;
    } catch (error) {
      console.error(`Error parsing Taskfile: ${error}`);
      return [];
    }
  }
}
