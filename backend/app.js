import connectDB from "./database/connection.js";
import { env } from "./env/config.js";
import getHttpServer from "./rest/index.js";
import initialiseSocketServer from "./socket/index.js";

async function main() {
  // Your code here
  const PORT = env.PORT;
  const DATABASE_NAME = "test-chat";

  await connectDB(DATABASE_NAME);
  const httpServer = getHttpServer(PORT);
  initialiseSocketServer(httpServer);
}

main();
