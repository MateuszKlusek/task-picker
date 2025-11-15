import { PackageJsonAdapter } from "../adapters/package-json-adapter";
import { PatternExecAdapter } from "../adapters/pattern-exec-adapter";
import { UserCommandsAdapter } from "../adapters/user-commands-adapter";
import { FileAdapterAbstract } from "./adapter.abstract";

export const GENERATOR_MAP: Record<string, new () => FileAdapterAbstract> = {
  packageJsonExec: PackageJsonAdapter,
  patternExec: PatternExecAdapter,
  userCommandsExec: UserCommandsAdapter,
};
