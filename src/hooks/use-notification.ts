import { useContext } from 'react';

import { NotificationContext } from 'contexts/notification';
import type { NotificationState } from 'contexts/notification';

export const useNotification = (): NotificationState =>
  useContext(NotificationContext);
