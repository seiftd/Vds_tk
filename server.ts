import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import { initDb } from "./server/db";
import { registerRoutes } from "./server/routes";
import { createServer } from "http";
import { initWebSockets } from "./server/websocket";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Database
  initDb();

  // JSON parsing
  app.use(express.json());

  // API Routes
  registerRoutes(app);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  const server = createServer(app);
  initWebSockets(server);

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
