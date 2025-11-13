import { Command } from "commander";
import { log } from "../utils/logger";
import { ConfigManager } from "./config";

export class CLI {
  private program: Command;
  private didRun: boolean = false;

  constructor() {
    this.program = new Command();

    this.setupCommands();

    this.program.hook("preAction", () => {
      const options = this.program.opts();
      log.setLogLevel(options.logLevel);
    });

    this.program.parse();
  }

  private setupCommands(): void {
    this.program
      .name("task-picker")
      .description("Interactive task selection tool with fzf integration")
      .option("-h, --help", "Show help information", false)
      .option("--debug", "Enable debug output")
      .option("--log-level <level>", "Set log level", "info");

    this.program
      .command("init")
      .description("Initialize configuration")
      .option("-o, --override", "Override existing configuration")
      .action(async (options) => {
        this.didRun = true;
        await new ConfigManager().initializeConfig(options.override);
      });

    this.program
      .command("update-root")
      .description("Update the root directory")
      .action(async () => {
        this.didRun = true;
        this.updateRoot();
      });
    this.program
      .command("version")
      .description("Show version information")
      .action(() => {
        this.didRun = true;
        this.showVersion();
      });

    this.program
      .command("help")
      .description("Show help information")
      .action(() => {
        this.didRun = true;
        this.showUsage();
      });

    this.program.arguments("[command]").action((cmd: string) => {
      if (cmd) {
        const availableCommands = this.program.commands.map((c) => c.name());
        if (!availableCommands.includes(cmd)) {
          console.error(`\nError: Unknown command '${cmd}'`);
          console.log("Available commands:", availableCommands.join(", "));
          process.exit(1);
        }
      }
    });
  }

  private showUsage(): void {
    this.program.help();
  }

  private showVersion(): void {
    console.log("task-picker version 1.0.0");
  }

  public getDidRun(): boolean {
    return this.didRun;
  }

  private updateRoot(): void {
    this.didRun = true;
    const cwd = process.cwd();
    new ConfigManager().upsertConfigKey("root", cwd);
    log.info(`Updating root directory to: ${cwd}`);
  }
}
