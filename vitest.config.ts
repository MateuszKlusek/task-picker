// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["**/*.test.ts"],
    silent: false,
    globalSetup: ["./test/test-setup.ts"],
  },
});
