import util from "util";
import { Colors, LogLevel } from "../types/core";

const LogLevelList: LogLevel[] = ["debug", "info", "warn", "error"];

class Logger {
  private logLevel: LogLevel;

  constructor(logLevel: LogLevel = "info") {
    this.logLevel = logLevel;
  }

  public setLogLevel(logLevel: LogLevel): void {
    this.logLevel = logLevel;
  }

  public debug(message: string | object): void {
    if (this.isLogLevelEnabled("debug")) {
      console.log(
        `${Colors.BLUE}[DEBUG]${Colors.RESET} ${this.formatMessage(message)}`
      );
    }
  }

  // don't set this level in LogLevelList, it's tied to debug level
  public timed(message: string | object): void {
    if (this.isLogLevelEnabled("debug")) {
      console.log(
        `${Colors.YELLOW}[TIMED]${Colors.RESET} ${this.formatMessage(message)}`
      );
    }
  }

  public info(message: string | object): void {
    if (this.isLogLevelEnabled("info")) {
      console.info(
        `${Colors.GREEN}[INFO]${Colors.RESET} ${this.formatMessage(message)}`
      );
    }
  }

  public warn(message: string | object): void {
    if (this.isLogLevelEnabled("warn")) {
      console.warn(
        `${Colors.YELLOW}[WARN]${Colors.RESET} ${this.formatMessage(message)}`
      );
    }
  }

  public error(message: string | object): void {
    if (this.isLogLevelEnabled("error")) {
      console.error(
        `${Colors.RED}[ERROR]${Colors.RESET} ${this.formatMessage(message)}`
      );
    }
  }

  public withPrefix(prefix: string, message: string | object) {
    console.log(`${prefix} ${this.formatMessage(message)}`);
  }

  private isLogLevelEnabled(logLevel: LogLevel): boolean {
    return (
      LogLevelList.indexOf(logLevel) >= LogLevelList.indexOf(this.logLevel)
    );
  }

  public getLogLevel(): LogLevel {
    return this.logLevel;
  }

  private formatMessage(message: string | object): string {
    if (typeof message === "object") {
      return util.inspect(message, { colors: true, depth: null });
    }
    return message;
  }
}

export const log = new Logger();
