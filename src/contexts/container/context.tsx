import { createContext } from "react";
import type { FC } from "react";

import { Container } from "di";

const VALUE = {
  container: new Container(),
};

export type State = {
  container: Container
};

export const Provider: FC = (props) => (
  <Context.Provider value={VALUE} {...props} />
);

export const Context = createContext<State>(VALUE);
