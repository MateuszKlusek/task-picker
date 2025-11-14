export interface UserCommand {
  command: string;
  workDir: string;
  label: string;
  runner: string;
}

export interface SelectionItem {
  executableCommand: string;
  subcommand: string;
  label: string;
  absolutePath: string;
  workDir: string;
  color?: Colors;
}

export interface Config {
  root?: string;
  userCommands?: UserCommand[];
  shell?: string;
  patternExec?: PatternExec[];
  packageJsonExec?: PatternExec;
}

export interface PatternExec {
  include: string;
  exclude?: string;
  label?: string;
  runner: string;
}

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface CLIArgs {
  help: boolean;
  version: boolean;
  init: boolean;
  command: string;
  args: string[];
  logLevel: LogLevel;
}

export interface PackageJson {
  scripts?: Record<string, string>;
}

export interface ChecksumEntry {
  path: string;
  checksum: string;
  algorithm: string;
  lastModified: string;
  fileSize: number;
  status: string;
}

export interface ChecksumsFile {
  version: string;
  lastUpdated: string;
  files: ChecksumEntry[];
}

// -------------------------- colors -------------------------- //

export enum Colors {
  RED = "\x1b[31m",
  GREEN = "\x1b[32m",
  YELLOW = "\x1b[33m",
  BLUE = "\x1b[34m",
  PURPLE = "\x1b[35m",
  CYAN = "\x1b[36m",
  WHITE = "\x1b[37m",
  RESET = "\x1b[0m",
}

export const COLORS_ROTATION: Colors[] = [
  Colors.RED,
  Colors.GREEN,
  Colors.BLUE,
  Colors.YELLOW,
  Colors.PURPLE,
  Colors.CYAN,
  Colors.WHITE,
];
