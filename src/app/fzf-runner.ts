import { spawn } from "child_process";
import { Colors, Config, SelectionItem } from "../types/core";
import { log } from "../utils/logger";
import { Timed } from "../utils/timer";
import { ConfigManager } from "./config-manager";

export class FzfRunner {
  @Timed("FzfRunner.run")
  static async run({
    items,
    configManager,
  }: {
    items: SelectionItem[];
    configManager: ConfigManager;
  }): Promise<void> {
    if (items.length === 0) {
      log.info("No tasks found.");
      return;
    }

    const config = configManager.getConfig();

    const fzfConfigToArgs = [
      `--height=${config?.fzfConfig?.windowHeight || "100%"}`,
      `--preview-window=${config?.fzfConfig?.previewWindow?.direction || "right"}:${config?.fzfConfig?.previewWindow?.percentage || "50%"}`,
    ];

    const fzfProcess = spawn(
      "fzf",
      [
        "--delimiter=\t",
        "--with-nth=1",
        "--preview=echo label: {1} ; echo command: {2} ;echo; echo runner: {3} ; echo relative path: {4} ; echo absolute path: {5}",
        "--preview-window=wrap",
        "--ansi",
        ...fzfConfigToArgs,
      ],
      {
        stdio: ["pipe", "pipe", "inherit"],
      }
    );

    const createFzfLine = (item: SelectionItem) => {
      return `${item.color}${item.label}${Colors.RESET}\t${item.command}\t${item.runner}\t${item.relativePath}\t${item.absolutePath}\t${JSON.stringify(item)}\n`;
    };

    // --------------------- Write items to fzf stdin ---------------------
    for (const item of items) {
      const line = createFzfLine(item);
      fzfProcess.stdin?.write(line);
    }
    fzfProcess.stdin?.end();

    // --------------------- Handle selection from fzf ---------------------
    let selectedData = "";
    fzfProcess.stdout?.on("data", (data) => {
      selectedData += data.toString();
    });

    fzfProcess.on("close", (code) => {
      if (code === 0 && selectedData.trim()) {
        this.executeSelection({ selected: selectedData.trim(), config });
      } else {
        log.info("No selection made");
      }
    });

    fzfProcess.on("error", (error) => {
      if (error.message.includes("ENOENT")) {
        log.error("fzf is not installed. Please install fzf to use this tool.");
        log.info(
          "Installation instructions: https://github.com/junegunn/fzf#installation"
        );
        process.exit(1);
      }

      log.error(`Error running fzf: ${error}`);
    });
  }

  @Timed("FzfRunner.executeSelection")
  private static executeSelection({
    selected,
    config,
  }: {
    selected: string;
    config: Config;
  }): void {
    const parts = selected.split("\t");
    if (parts.length < 3) {
      log.error(`Unexpected selection format: ${selected}`);
      return;
    }

    const json = JSON.parse(parts[parts.length - 1]) as SelectionItem;
    const { absolutePath, command } = json;

    log.debug({ json });

    const cleanCommand = command.trim();

    // directory change
    if (absolutePath && absolutePath !== process.cwd()) {
      try {
        process.chdir(absolutePath);
        log.debug(`Changed to directory: ${absolutePath}`);
      } catch (error) {
        log.error(`Failed to change directory: ${error}`);
        process.exit(1);
      }
    }

    // mimmick the terminal prompt
    console.log(`${Colors.GREEN}❯ ${cleanCommand}${Colors.RESET}`);

    // Use the specified shell or default
    const shell = config?.shell || process?.env?.SHELL || "/bin/bash";

    // needed for colors in the terminal
    process.env.CLICOLOR = "1";
    process.env.FORCE_COLOR = "1";

    // Execute the command
    const childProcess = spawn(shell, ["-c", cleanCommand], {
      stdio: "inherit",
      env: process.env,
    });

    childProcess.on("error", (error) => {
      log.error(`Failed to execute command: ${error}`);
      process.exit(1);
    });

    childProcess.on("exit", (code) => {
      process.exit(code || 0);
    });
  }
}
