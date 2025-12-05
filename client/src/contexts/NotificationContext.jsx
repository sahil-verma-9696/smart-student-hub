import { createContext, useContext } from "react";
import useNotificationLogic from "../hooks/useNotificationLogic";
import useAuthContext from "../hooks/useAuthContext";

export const NotificationContext = createContext({
  notifications: [],
});

export const useNotificationContext = () => useContext(NotificationContext);

export default function NotificationContextProvider({ children }) {
  const notificationContext = useNotificationLogic();
  return (
    <NotificationContext.Provider value={notificationContext}>
      {children}
    </NotificationContext.Provider>
  );
}
