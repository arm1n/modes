import type { Order } from "../models";

import { Repository } from "./types";

export interface OrderRepository extends Repository<Order> {}
