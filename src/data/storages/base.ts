import type { Json } from "types";

import type { Storage } from "./types";

export abstract class BaseStorage implements Storage {
  public abstract get length(): number;

  public abstract clear(): void;
  public abstract getItem(key: string): Json;
  public abstract setItem(key: string, value: Json): void;
  public abstract removeItem(key: string): void;

  protected encode(value: Json): string {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return "";
    }
  }

  protected decode(value: string): Json {
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }
}
