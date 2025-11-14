#!/usr/bin/env node

import { CLI } from "./app/cli";
import { ConfigManager } from "./app/config-manager";
import { FzfManager } from "./app/fzf-manager";
import { PayloadGenerator } from "./app/payload-generator";
import { log } from "./utils/logger";

async function main(): Promise<void> {
  const configManager = new ConfigManager();
  const cli = new CLI({ configManager });

  if (!cli.getDidRun()) {
    try {
      await configManager.loadConfig();
      const payload = await PayloadGenerator.generate({ configManager });
      await FzfManager.run(payload);
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
