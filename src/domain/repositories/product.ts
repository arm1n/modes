import type { Product } from "../models";

import { Repository } from "./types";

export interface ProductRepository extends Repository<Product> {}
