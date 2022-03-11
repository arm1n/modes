import { Localization } from "utils";

import CATALOG from "./translations/de.json";

const service = new Localization<typeof CATALOG>(CATALOG);

export const t = (...args: Parameters<Localization<typeof CATALOG>["t"]>) =>
	service.t(...args);
	
export const n = (...args: Parameters<Localization<typeof CATALOG>["n"]>) =>
	service.n(...args);
