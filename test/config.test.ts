import { copyFile } from "fs/promises";
import { join } from "path";
import { beforeAll, describe, expect, inject, it } from "vitest";
import { ConfigManager } from "../src/app/config-manager";
import { log } from "../src/utils/logger";

const { testDir } = inject("ctx");

beforeAll(async () => {
  log.setLogLevel("info");
});

describe("Config Manager", async () => {
  it("yaml template is valid", async () => {
    const configDir = join(testDir, "config");

    await copyFile(
      join(process.cwd(), "config", ".task-picker.config-template.yaml"),
      join(configDir, ".task-picker.config-template.yaml")
    );

    const cm = new ConfigManager({
      cwd: testDir,
      configFileName: join("config", ".task-picker.config-template.yaml"),
    });

    await cm.initializeConfig(true);
    await cm.loadConfig();
    const isValid = await cm.validateConfig();

    expect(isValid).toBe(true);
  });
});
