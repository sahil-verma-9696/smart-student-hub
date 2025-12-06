import { useGlobalContext } from "@/contexts/global-context";
import NotificationContext from "@/contexts/notification-context";
import useNotificationData from "@/hooks/useNotificationData";
import React, { useRef } from "react";
import { io } from "socket.io-client";

const NotificationContextProvider = ({ children }) => {
  const { USER_ID, BACKEND_URL } = useGlobalContext();
  const socketRef = useRef(null);

  React.useEffect(() => {
    if (USER_ID && !socketRef.current) {
      // 🔥 SOCKET CONNECT
      socketRef.current = io(BACKEND_URL, {
        query: { userId: USER_ID },
      });

      socketRef.current.on("connect", () => {
        console.log("🟢 Socket connected:", socketRef.current.id);
      });
    }

    // Cleanup
    return () => {
      if (socketRef.current) {
        console.log("🔴 Socket disconnected");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [USER_ID, BACKEND_URL]);

  const contextValue = useNotificationData(socketRef.current);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContextProvider;
