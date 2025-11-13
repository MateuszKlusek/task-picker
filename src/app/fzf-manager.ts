import { spawn } from "child_process";
import { Colors, SelectionItem } from "../types/core";
import { log } from "../utils/logger";

export class FzfManager {
  static async run(items: SelectionItem[]): Promise<void> {
    if (items.length === 0) {
      log.warn(
        'No tasks found. Run "task-picker init" to create a configuration file.'
      );
      return;
    }

    // Check if fzf is available
    try {
      await this.checkFzfAvailable();
    } catch (error) {
      log.error("fzf is not installed. Please install fzf to use this tool.");
      log.info(
        "Installation instructions: https://github.com/junegunn/fzf#installation"
      );
      process.exit(1);
    }

    const fzfProcess = spawn(
      "fzf",
      [
        "--delimiter=\t",
        "--with-nth=1",
        "--preview=echo label: {1} ; echo subcommand: {2} ;echo executableCommand: {3} ; echo executable directory: {4} ; echo absolute path: {5}",
        "--preview-window=wrap",
        "--ansi",
        "--height=50%",
      ],
      {
        stdio: ["pipe", "pipe", "inherit"],
      }
    );

    // Write items to fzf stdin
    for (const item of items) {
      const line = `${item.color}${item.label}${Colors.RESET}\t${item.subcommand}\t${item.executableCommand}\t${item.workDir}\t${item.absolutePath}\n`;
      fzfProcess.stdin?.write(line);
    }
    fzfProcess.stdin?.end();

    // Handle selection
    let selectedData = "";
    fzfProcess.stdout?.on("data", (data) => {
      selectedData += data.toString();
    });

    fzfProcess.on("close", (code) => {
      if (code === 0 && selectedData.trim()) {
        this.executeSelection(selectedData.trim());
      } else {
        log.info("No selection made");
      }
    });

    fzfProcess.on("error", (error) => {
      log.error(`Error running fzf: ${error}`);
    });
  }

  private static async checkFzfAvailable(): Promise<void> {
    return new Promise((resolve, reject) => {
      const checkProcess = spawn("which", ["fzf"], { stdio: "ignore" });
      checkProcess.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error("fzf not found"));
        }
      });
    });
  }

  private static executeSelection(selected: string): void {
    const parts = selected.split("\t");
    if (parts.length < 2) {
      log.error(`Unexpected selection format: ${selected}`);
      return;
    }

    const [label, subcommand, executableCommand, workDir, absolutePath] = parts;
    log.debug({ label, subcommand, executableCommand, workDir, absolutePath });

    const cleanCommand = executableCommand.trim();

    // directory change
    if (workDir && workDir !== process.cwd()) {
      try {
        process.chdir(workDir);
        log.debug(`Changed to directory: ${workDir}`);
      } catch (error) {
        log.error(`Failed to change directory: ${error}`);
        process.exit(1);
      }
    }

    // mimmick the terminal prompt
    console.log(`${Colors.GREEN}❯ ${cleanCommand}${Colors.RESET}`);

    // Use the specified shell or default
    const shell = process.env.SHELL || "/bin/bash";

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
