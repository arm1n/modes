import { useContext } from "react";

import { ContainerContext } from "contexts/container";
import type { ContainerState } from "contexts/container";

export const useContainer = (): ContainerState => useContext(ContainerContext);
