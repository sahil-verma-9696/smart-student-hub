// src/hooks/useNotificationLogic.js
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

export default function useNotificationLogic(userId) {
  const [notifications, setNotifications] = useState([
    {
      title: "Welcome!",
      message: "This is your notification center.",
      isReaded: false,
    },
    {
      title: "Getting Started",
      message: "Explore the app to discover more features.",
      isReaded: false,  
    },
  ]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    // SOCKET CONNECT
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      query: { userId },
    });

    socketRef.current.on("connect", () => {
      console.log("🟢 Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("notification", (data) => {
      console.log("📩 RECEIVED:", data);
      setNotifications((prev) => [data, ...prev]);
    });

    // 🔥 DUMMY TEST NOTIFICATION
    setTimeout(() => {
      const dummy = {
        title: "Dummy Notification",
        message: "This is only for testing!",
        time: new Date().toISOString(),
      };
      console.log("🔥 Dummy Added:", dummy);
      setNotifications((prev) => [dummy, ...prev]);
    }, 2000);

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId]);

  return { notifications };
}
