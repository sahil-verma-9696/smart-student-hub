import { createContext, useContext } from "react";

const NotificationContext = createContext({
  notifications: null,
  socket: null,
});

export default NotificationContext;

export const useNotificationContext = () => useContext(NotificationContext);
