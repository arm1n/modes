import { useState, useMemo, useCallback, createContext } from "react";
import type { FC } from "react";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

let ID = 0;

type Notification = {
  id: string;
  message: string;
  persistent?: boolean;
  type?: "success" | "error" | "warning" | "info";
};

export type State = {
  addNotification: (notification: Omit<Notification, "id">) => string;
  removeNotification: (id: string) => void;
};

export const Provider: FC = ({ children }) => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const removeNotification = useCallback(
    (...[id]: Parameters<State["removeNotification"]>) => {
      setNotification(null);
    },
    []
  );

  const addNotification = useCallback(
    (
      ...[
        { message, type = "info", persistent = type === "error" },
      ]: Parameters<State["addNotification"]>
    ) => {
      const notification = {
        id: `notification-${ID++}`,
        type,
        message,
        persistent,
      };

      setNotification(notification);
      setShowNotification(true);

      return notification.id;
    },
    []
  );

  const value = useMemo(
    () => ({
      removeNotification,
      addNotification,
    }),
    [removeNotification, addNotification]
  );

  return (
    <Context.Provider value={value}>
      <Snackbar
        open={showNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={notification?.persistent ? null : 5000}
        onClose={(_, reason) => {
          if (reason !== "clickaway") {
            setShowNotification(false);
          }
        }}
      >
        <Alert
          variant="filled"
          sx={{ width: "100%" }}
          severity={notification?.type}
          onClose={() => setShowNotification(false)}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
      {children}
    </Context.Provider>
  );
};

export const Context = createContext<State>({
  addNotification: (notification) => "",
  removeNotification: (id) => {},
});
