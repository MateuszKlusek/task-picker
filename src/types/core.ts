export type UserCommand = {
  command: string;
  workDir: string;
  label: string;
  runner: string;
};

export type SelectionItem = {
  executableCommand: string;
  command: string;
  label: string;
  absolutePath: string;
  workDir: string;
  color?: Colors;
};

export type SingleAdapterOutput = SelectionItem[] | SelectionItem[][];

export type PatternExec = {
  include: string;
  exclude?: string;
  label?: string;
  runner: string;
};

export type Config = {
  root?: string;
  userCommandsExec?: UserCommand[];
  shell?: string;
  patternExec?: PatternExec[];
  packageJsonExec?: PatternExec;
  fzfConfig?: {
    height?: string;
    previewWindow?: {
      direction?: "down" | "up" | "left" | "right";
      percentage?: string;
    };
  };
};

export type CLIArgs = {
  help: boolean;
  version: boolean;
  init: boolean;
  command: string;
  args: string[];
  logLevel: LogLevel;
};

export type LogLevel = "debug" | "info" | "warn" | "error";

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

// -------------------------- temp sunset -------------------------- //

export type ChecksumEntry = {
  path: string;
  checksum: string;
  algorithm: string;
  lastModified: string;
  fileSize: number;
  status: string;
};

export type ChecksumsFile = {
  version: string;
  lastUpdated: string;
  files: ChecksumEntry[];
};
