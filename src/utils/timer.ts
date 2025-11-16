import { log } from "./logger";

export class Timer {
  private startTime: number;
  private label: string;

  constructor(label: string) {
    this.label = label;
    this.startTime = performance.now();
  }

  end(): number {
    const duration = performance.now() - this.startTime;
    log.timed(`${this.label} took ${duration.toFixed(4)}ms`);
    return duration;
  }

  static measure<T extends (...args: any[]) => any>(label: string, fn: T): T {
    return ((...args: any[]) => {
      const timer = new Timer(label);
      try {
        const result = fn(...args);
        if (result instanceof Promise) {
          return result.finally(() => timer.end()) as ReturnType<T>;
        }
        timer.end();
        return result;
      } catch (error) {
        timer.end();
        throw error;
      }
    }) as T;
  }
}

export function Timed(label?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const methodLabel = label || `${target.constructor.name}.${propertyKey}`;

    descriptor.value = function (...args: any[]) {
      const timer = new Timer(methodLabel);
      try {
        const result = originalMethod.apply(this, args);
        if (result instanceof Promise) {
          return result.finally(() => timer.end());
        }
        timer.end();
        return result;
      } catch (error) {
        timer.end();
        throw error;
      }
    };

    return descriptor;
  };
}
