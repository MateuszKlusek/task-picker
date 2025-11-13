import { PackageJsonAdapter } from "../adapters/package-json-adapter";
import { PatternExecAdapter } from "../adapters/pattern-exec-adapter";
import { UserCommandsAdapter } from "../adapters/user-commands-adapter";
import { FileAdapterAbstract } from "./adapter.abstract";

export const GENERATOR_MAP: Record<string, typeof FileAdapterAbstract> = {
  packageJson: PackageJsonAdapter,
  patternExec: PatternExecAdapter,
  userCommands: UserCommandsAdapter,
};
