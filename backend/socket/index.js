import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import { chatNamespaceHandler } from "./namespaces/chat.js";
import { socketAuthAndMapping } from "../middleware/socketAuthMapping.js";
import { env } from "./../env/config.js";

function initialiseSocketServer(httpServer, options) {
  const socketServer = new Server(httpServer, {
    ...options,
    cors: { origin: env.CLIENTS_URL.split(","), credentials: true },
    pingInterval: 2000,
    pingTimeout: 1000,
  });

  // _id -> socket.id
  const idToSocketMap = new Map();

  // _id -> { status: active | online | offline, lastSeen: Date }
  const idToStatusMap = new Map();

  // [ userId_1, userId_2, userId_3, ... ] status : active
  const activeUsersIds = new Set();

  // [ userId_1, userId_2, userId_3, ... ] status : online
  const onlineUsersIds = new Set();

  const namespaces = ["/ws/chat"];

  // Middleware to map sockets to users
  namespaces.forEach((ns) => {
    const namespaceInstance = socketServer.of(ns);
    namespaceInstance.use(
      socketAuthAndMapping(
        namespaceInstance,
        idToSocketMap,
        activeUsersIds,
        onlineUsersIds,
        idToStatusMap
      )
    );
  });

  const chatNamespace = socketServer.of("/ws/chat");

  chatNamespace.on("connection", chatNamespaceHandler(chatNamespace));

  return socketServer;
}

export default initialiseSocketServer;
