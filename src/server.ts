// src/server.ts
import "dotenv/config";
import app from "@/app.js";
import { env } from "@/env.js";

const PORT = env.PORT || 6969;

const server = app.listen(PORT, () => {
  console.log(
    `✅ InnerCircles running on http://localhost:${PORT} (${
      env.NODE_ENV || "development"
    })`
  );
});

// Graceful shutdown
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

function shutdown() {
  console.log("🛑 Shutting down server...");
  server.close(() => {
    console.log("✅ Server closed cleanly");
    process.exit(0);
  });
}
