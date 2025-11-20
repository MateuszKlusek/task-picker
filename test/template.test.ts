import * as yaml from "js-yaml";
import path from "path";
import { describe, expect, it } from "vitest";
import { Config } from "../src/types/core";
import { FileUtils } from "../src/utils/fileUtils";
import { configSchema } from "../src/utils/validation";

describe("yaml config template", () => {
  const templatePath = path.join(
    process.cwd(),
    "config/.task-picker.config-template.yaml"
  );

  it("should be valid", async () => {
    const fileContent = FileUtils.readFile(templatePath);
    const templateConfig = yaml.load(fileContent);

    const clonedConfig = structuredClone(templateConfig) as Config;
    // normally we would use the config manager to get the root, but for testing purposes we will set it manually
    clonedConfig.root = process.cwd();

    const result = configSchema.safeParse(clonedConfig);
    expect(result.success).toBe(true);
  });
});
