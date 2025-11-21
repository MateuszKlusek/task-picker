import "vitest";

declare module "vitest" {
  interface ProvidedContext {
    ctx: {
      value: string;
      testDir: string;
      buildPath: string;
    };
  }
}
