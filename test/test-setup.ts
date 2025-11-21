import { mkdir, mkdtemp, rm } from "fs/promises";
import { join } from "path";
import type { TestProject } from "vitest/node";
import { log } from "../src/utils/logger";

export default async function testSetup(project: TestProject) {
  log.withPrefix("[test-setup]", "setting up test environment");
  log.withPrefix("[test-setup]", `project.config.root: ${project.config.root}`);

  // ------------------------- prepare file system-------------------------
  const testDir = await mkdtemp(join(project.config.root, "test/test-files-"));
  const configDir = await mkdir(join(testDir, "config"), {
    recursive: true,
  });
  const buildPath = join(project.config.root, "dist/index.js");
  await mkdir(testDir, { recursive: true });

  log.withPrefix("[test-setup]", `testDir: ${testDir}`);

  project.provide("ctx", {
    value: "Matusz",
    buildPath,
    testDir,
  });

  // ------------------------- return teardown function -------------------------
  return async () => {
    log.withPrefix("[test-setup]", "tearing down test environment");
    // await rm(testDir, { recursive: true, force: true });
  };
}
