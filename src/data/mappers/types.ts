import type  {Json } from "types";
import type { Model } from "domain/models";

export interface Mapper<M extends Model, D extends Model & Json> {
  toData(model: M): D;
  toModel(data: D): M;
}
