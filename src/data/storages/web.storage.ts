import type { Json } from "types";

import { BaseStorage } from "./base";

export class WebStorage extends BaseStorage {
  constructor(private storage: Storage) {
    super();
  }

  public get length() {
    return this.storage.length;
  }

  public getItem(key: string) {
    const value = this.storage.getItem(key);
    if (value === null) {
      return value;
    }

    return this.decode(value);
  }

  public setItem(key: string, value: Json) {
    const encoded = this.encode(value);
    this.storage.setItem(key, encoded);
  }

  public removeItem(key: string) {
    this.storage.removeItem(key);
  }

  public clear() {
    this.storage.clear();
  }
}