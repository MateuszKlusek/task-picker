import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { log } from "../src/utils/logger";

let spy: ReturnType<typeof vi.spyOn>;
let spyInfo: ReturnType<typeof vi.spyOn>;
let spyWarn: ReturnType<typeof vi.spyOn>;
let spyError: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  spy = vi.spyOn(console, "log").mockImplementation(() => {});
  spyInfo = vi.spyOn(console, "info").mockImplementation(() => {});
  spyWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
  spyError = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  spy.mockRestore();
  spyInfo.mockRestore();
  spyWarn.mockRestore();
  spyError.mockRestore();
});

describe("Logger", () => {
  it("should set log level to debug", () => {
    log.setLogLevel("debug");
    expect(log.getLogLevel()).toBe("debug");
  });

  it("should log debug messages when log level is set to debug", () => {
    log.setLogLevel("debug");
    log.debug("This is a debug message");
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[DEBUG]"));
  });

  it("should warn, info and error messages when log level is set to info", () => {
    log.setLogLevel("info");
    log.info("This is an info message");
    log.warn("This is a warn message");
    log.error("This is an error message");
    expect(spyInfo).toHaveBeenCalledWith(expect.stringContaining("[INFO]"));
    expect(spyWarn).toHaveBeenCalledWith(expect.stringContaining("[WARN]"));
    expect(spyError).toHaveBeenCalledWith(expect.stringContaining("[ERROR]"));
  });

  it("should not log debug messages when log level is set to info", () => {
    log.setLogLevel("info");
    log.debug("This is a debug message");
    expect(spy).not.toHaveBeenCalled();
  });

  it("should not log anything but errors when log level is set to error", () => {
    log.setLogLevel("error");
    log.debug("This is a debug message");
    log.info("This is an info message");
    log.warn("This is a warn message");
    log.error("This is an error message");

    expect(spy).not.toHaveBeenCalled();
    expect(spyWarn).not.toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
  });
});
