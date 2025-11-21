import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, inject, it } from "vitest";
import { CLI } from "../src/app/cli";
import { ConfigManager } from "../src/app/config-manager";
import { log } from "../src/utils/logger";

const { value } = inject("ctx");

// TODO: reconsider appraoch
const distPath = join(process.cwd(), "dist/index.js");
let testDir: string;
let cli: CLI;
let cm: ConfigManager;

beforeAll(async () => {
  testDir = await mkdtemp(join(process.cwd(), "test/test-files-"));
  log.setLogLevel("debug");

  cm = new ConfigManager({
    cwd: testDir,
    configFileName: join(".task-picker.config.yaml"),
  });

  cli = new CLI({ configManager: cm });

  await mkdir(testDir, { recursive: true });

  spawnSync("npm", ["run", "build"]);
  console.log("ctx", value);
});

afterAll(async () => {
  await rm(testDir, { recursive: true, force: true });
});

describe("CLI", () => {
  it("should print help", () => {
    const result = spawnSync("node", [distPath, "help"], {
      encoding: "utf-8",
    });

    expect(result.stdout).toContain("Usage: task-picker [options] [command]");
  });

  it("should print version", () => {
    const result = spawnSync("node", [distPath, "version"], {
      encoding: "utf-8",
    });

    expect(result.stdout).toContain("task-picker version");
  });

  it("should exec init - the config file should be created ", async () => {
    const result = spawnSync("node", [distPath, "init"], {
      cwd: testDir,
      encoding: "utf-8",
    });

    expect(result.stdout).toContain("Created .task-picker-config.yaml");
  });

  it("should exec init - the config file should exist", async () => {
    const result = spawnSync("node", [distPath, "init"], {
      cwd: testDir,
      encoding: "utf-8",
    });

    expect(result.stdout).toContain(".task-picker-config.yaml already exist");
  });

  it("should exec init - override the config file", async () => {
    const result = spawnSync("node", [distPath, "init", "--override"], {
      cwd: testDir,
      encoding: "utf-8",
    });
    console.log("result", result);
    expect(result.stdout).toContain("Overwritten .task-picker-config.yaml");
  });
});

// await copyFile(
//   join(process.cwd(), ".task-picker-config.yaml"),
//   join(testDir, ".task-picker.config.yaml")
// );
