import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";

import pool from "./db/db.js";
import { initDB } from "./db/init.js";
import routes from "./routes/index.js"; // 👈 single import
import { errorHandler, notFound } from "./middleware/error.middleware.js";

dotenv.config();
const app = express();

// ---------- Global Middlewares ----------
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// ---------- Health Check ----------
app.get("/api/health", async (req, res) => {
  const dbCheck = await pool.query("SELECT NOW()");
  res.json({ status: "ok", dbTime: dbCheck.rows[0].now });
});

// ---------- Routes (all in one place) ----------
app.use("/api", routes);

// ---------- 404 + Error Handler ----------
app.use(notFound);
app.use(errorHandler);

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;
(async () => {
  await initDB(); // 👈 ensure tables exist before server starts
  const server = app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );

  // ---------- Graceful Shutdown ----------
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  function shutdown() {
    console.log("\n🛑 Shutting down gracefully...");
    server.close(() => {
      pool.end(() => {
        console.log("✅ PostgreSQL pool closed");
        process.exit(0);
      });
    });
  }
})();
