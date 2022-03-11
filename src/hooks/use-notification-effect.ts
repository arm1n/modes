import { useEffect } from "react";

import { Result } from "utils";

import type { NotificationEffect, State, Presenter } from "presentation/types";

import { useNotification } from "./use-notification";

export const useNotificationEffect = <
  T extends Presenter<State, NotificationEffect>
>(
  presenter: T
): void => {
  const notification = useNotification();

  useEffect(() => {
    const subscription = presenter.effects$.subscribe({
      update: (effect) => {
        switch (effect.name) {
          case "showNotification":
            notification.addNotification(
              Result.isSuccess(effect.data)
                ? {
                    message: effect.data.value.message,
                    type: effect.data.value.type ?? "success",
                    persistent: effect.data.value.persistent ?? false,
                  }
                : { message: effect.data.error.message, type: "error" }
            );
            break;
          default:
        }
      },
    });

    return () => subscription.unsubscribe();
  }, [notification, presenter.effects$]);
};
