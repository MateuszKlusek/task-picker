import { Command } from "commander";
import { log } from "../utils/logger";
import { Timed } from "../utils/timer";
import { ConfigManager } from "./config-manager";

export class CLI {
  private program: Command;
  private didRun: boolean = false;
  private configManager: ConfigManager;

  constructor({ configManager }: { configManager: ConfigManager }) {
    this.program = new Command();
    this.configManager = configManager;
    this.setupCommands();

    this.program.hook("preAction", () => {
      const options = this.program.opts();
      log.setLogLevel(options?.logLevel);
    });

    this.program.parse();
  }

  @Timed("CLI.setupCommands")
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
        await this.configManager.initializeConfig(options.override);
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
      .command("validate")
      .description("Validate the configuration")
      .action(async () => {
        this.didRun = true;
        await this.configManager.validateConfig();
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

  @Timed("CLI.showUsage")
  private showUsage(): void {
    this.program.help();
  }

  @Timed("CLI.showVersion")
  private showVersion(): void {
    console.log("task-picker version 0.1.0");
  }

  public getDidRun(): boolean {
    return this.didRun;
  }

  @Timed("CLI.updateRoot")
  private updateRoot(): void {
    const cwd = process.cwd();
    this.configManager.upsertConfigKey("root", cwd);
    log.info(`Updating root directory to: ${cwd}`);
  }
}
