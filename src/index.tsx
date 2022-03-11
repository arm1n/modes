import { StrictMode } from "react";
import ReactDOM from "react-dom";

import { Router } from "./routing";
import { App } from "./app";

import "./index.css";

ReactDOM.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
  document.getElementById("root")
);
