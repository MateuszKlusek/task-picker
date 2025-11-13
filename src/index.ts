#!/usr/bin/env node

import { CLI } from "./app/cli";
import { ConfigManager } from "./app/config";
import { FzfManager } from "./app/fzf-manager";
import { PayloadGenerator } from "./app/payload-generator";
import { log } from "./utils/logger";

async function main(): Promise<void> {
  const cli = new CLI();

  if (!cli.getDidRun()) {
    try {
      const config = await new ConfigManager().loadConfig();
      console.log("config", config);
      const items = await PayloadGenerator.generate(config);

      await FzfManager.run(items, config);
    } catch (error) {
      log.error(error as string);
      process.exit(1);
    }
  }
}

main().catch((error) => {
  log.error(`Unhandled error:, ${error}`);
  process.exit(1);
});
