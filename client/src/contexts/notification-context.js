import { createContext, useContext } from "react";

const NotificationContext = createContext({
  user: null,
  setUser: () => {},
});

export default NotificationContext;

export const useNotificationContext = () => useContext(NotificationContext);
