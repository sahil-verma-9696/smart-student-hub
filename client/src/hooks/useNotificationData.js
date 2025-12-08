import { useGlobalContext } from "@/contexts/global-context";
import React from "react";

export default function useNotificationData(socket) {
  const [notifications, setNotifications] = React.useState(null);
  const { USER_ID, BACKEND_URL } = useGlobalContext();

  // GET : Stored Notification from REST API
  React.useEffect(() => {
    if (USER_ID) {
      (async function getNotifications() {
        const res = await fetch(
          `${BACKEND_URL}/users/${USER_ID}/notifications`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        const jsonRes = await res.json();

        console.log(jsonRes);

        setNotifications(jsonRes?.data);
      })();
    }
  }, [USER_ID, BACKEND_URL]);

  // Listen for 🔥 SOCKET EVENT
  React.useEffect(() => {
    if (socket) {
      // Notification Event
      socket.on("notification", (data) => {
        console.log("notification", data);
        setNotifications((prev) => [data, ...prev]);
      });
    }
    return () => {
      if (socket) {
        socket.off("notification");
      }
    };
  }, [socket]);
  return {
    notifications,
    socket,
  };
}
