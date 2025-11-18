import fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";
import { EMBEDDED_TEMPLATE } from "../template";
import { type Config } from "../types/core";
import { FileUtils } from "../utils/fileUtils";
import { log } from "../utils/logger";
import { Timed } from "../utils/timer";
import { z } from "zod";
import { FileAdapterAbstract } from "./adapter.abstract";
import { GENERATOR_MAP } from "./constants";

export class ConfigManager {
  private config: Config | null = null;
  private readonly configFileName = ".task-picker-config.yaml";
  private cwd: string = process.cwd();
  private configPath: string = path.join(this.cwd, this.configFileName);

  constructor() {
    this.config = null;
    this.cwd = process.cwd();
    this.configPath = path.join(this.cwd, this.configFileName);
  }

  @Timed("ConfigManager.upsertConfigKey")
  public async upsertConfigKey<K extends keyof Config>(
    key: K,
    value: Config[K]
  ): Promise<void> {
    const config = await this.getConfigFile();
    config[key] = value;
    await this.saveConfigFile(config);
  }

  @Timed("ConfigManager.getUsableGenerators")
  public async getUsableGenerators() {
    const generators: Record<string, new () => FileAdapterAbstract> = {};
    if (!this.config) {
      return generators;
    }

    for (const generator of Object.keys(GENERATOR_MAP)) {
      if (generator in this.config) {
        generators[generator] = GENERATOR_MAP[generator];
      }
    }

    return generators;
  }

  @Timed("ConfigManager.saveConfigFile")
  public async saveConfigFile(config: Config): Promise<void> {
    try {
      const yamlContent = yaml.dump(config, {
        indent: 2,
        lineWidth: 120,
        noRefs: true,
        sortKeys: false,
      });

      fs.writeFileSync(this.configPath, yamlContent, {
        encoding: "utf-8",
        flag: "w",
      });
    } catch (error) {
      throw new Error(`Error saving config file: ${error}`);
    }
  }

  @Timed("ConfigManager.getConfigFile")
  public async getConfigFile(): Promise<Config> {
    log.debug(`Getting config file from: ${this.configPath}`);

    if (!FileUtils.fileExists(this.configPath)) {
      throw new Error(`Configuration file not found: ${this.configPath}`);
    }

    try {
      const yamlContent = FileUtils.readFile(this.configPath);
      const config = yaml.load(yamlContent) as Config;
      return config;
    } catch (error) {
      throw new Error(`Error getting config file: ${error}`);
    }
  }

  @Timed("ConfigManager.loadConfig")
  async loadConfig() {
    try {
      const config = await this.getConfigFile();
      this.config = config;

      // how about defaults ??

      log.debug(`Config loaded: ${JSON.stringify(this.config, null, 2)}`);
    } catch (error) {
      throw new Error(`Error loading config: ${error}`);
    }
  }

  @Timed("ConfigManager.initializeConfig")
  async initializeConfig(
    override: boolean = false,
    templateOverride: any = {}
  ): Promise<void> {
    log.debug(`Override flag: ${override}`);

    if (FileUtils.fileExists(this.configPath) && !override) {
      log.info(`${this.configFileName} already exists`);
      log.info("Use --override flag to overwrite existing configuration");
      return;
    }

    // Load template - try embedded template first, then fallback to file system
    let templateConfig = {};

    // First, try embedded template (works for global installations)
    if (EMBEDDED_TEMPLATE) {
      try {
        templateConfig = yaml.load(EMBEDDED_TEMPLATE) as any;
        log.debug("Loaded embedded template");
      } catch (error) {
        log.warn(`Failed to load embedded template: ${error}`);
      }
    }

    await this.upsertConfigKey("root", process.cwd());

    // Fallback: try to load from file system (for development)
    if (!templateConfig || Object.keys(templateConfig).length === 0) {
      const templatePath = path.resolve(
        process.cwd(),
        "config/.task-picker.config-template.yaml"
      );

      console.log("templatePath", templatePath);

      if (FileUtils.fileExists(templatePath)) {
        try {
          const templateContent = FileUtils.readFile(templatePath);
          console.log("templateContent", templateContent);
          templateConfig = yaml.load(templateContent) as any;
          log.debug(`Loaded template from: ${templatePath}`);
        } catch (error) {
          log.warn(`Failed to load template from ${templatePath}: ${error}`);
        }
      }
    }

    const finalConfig = {
      ...templateConfig,
      ...templateOverride,
      root: process.cwd(),
    };

    console.log("finalConfig", finalConfig);
    console.log("this.configPath", this.configPath);

    await this.saveConfigFile(finalConfig);

    log.info(`Created ${this.configFileName} with template configuration`);
    log.info("You can now edit this file to add your task definitions.");
  }

  @Timed("ConfigManager.validateConfig")
  public async validateConfig(): Promise<boolean> {
    try {
      const config = await this.getConfigFile();

      const configSchema = z.object({
        root: z.string(),
        shell: z.string().optional(),
        fzfConfig: z.object({
          height: z.string().optional,
          previewWindow: z
            .object({
              direction: z.enum(["down", "up", "left", "right"]).optional(),
              percentage: z.string().optional(),
            })
            .optional(),
        }),
      });

      const result = configSchema.parse(config);
      console.log("result", result);

      // log.info("Configuration is valid");
      return true;
    } catch (error) {
      log.error(`Configuration validation failed: ${error}`);
      return false;
    }
  }

  @Timed("ConfigManager.getConfig")
  public getConfig() {
    if (!this.config) {
      throw new Error("Config not loaded");
    }
    return this.config;
  }

  @Timed("ConfigManager.logConfig")
  public logConfig(): void {
    if (this.config) {
      log.debug(`Config: ${JSON.stringify(this.config, null, 2)}`);
    }
  }
}
