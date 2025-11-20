import { copyFile, mkdir, mkdtemp, rm } from "fs/promises";
import { join } from "path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { ConfigManager } from "../src/app/config-manager";
import { log } from "../src/utils/logger";

let testDir: string;

beforeAll(async () => {
  testDir = await mkdtemp(join(process.cwd(), "test/test-files-"));
  log.setLogLevel("warn");
});

afterAll(async () => {
  await rm(testDir, { recursive: true, force: true });
});

describe("Config Manager", async () => {
  it("yaml template is valid", async () => {
    const configDir = join(testDir, "config");

    await mkdir(configDir, { recursive: true });
    await copyFile(
      join(process.cwd(), "config", ".task-picker.config-template.yaml"),
      join(testDir, "config", ".task-picker.config-template.yaml")
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
