#!/usr/bin/env node

import { CLI } from "./app/cli";
import { ConfigManager } from "./app/config-manager";
import { FzfRunner } from "./app/fzf-runner";
import { PayloadGenerator } from "./app/payload-generator";
import { log } from "./utils/logger";

const main = async (): Promise<void> => {
  const configManager = new ConfigManager();
  const cli = new CLI({ configManager });

  if (!cli.getDidRun()) {
    try {
      await configManager.loadConfig();
      const items = await PayloadGenerator.generate({ configManager });
      await FzfRunner.run({ items, configManager });
    } catch (error) {
      log.error(error as string);
      process.exit(1);
    }
  }
};

main().catch((error) => {
  log.error(`Unhandled error:, ${error}`);
  process.exit(1);
});
