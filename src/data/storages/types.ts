import type { Json } from "types";

export interface Storage {
  length: number;

  clear(): void;
  getItem(key: string): Json;
  setItem(key: string, value: Json): void;
  removeItem(key: string): void;
}
