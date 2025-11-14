import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import studentRoutes from "./routes/studentRoutes.js";
import { testConnection } from "./config/db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Main API Routes
app.use("/api/students", studentRoutes);

// Basic root route
app.get("/", (req, res) => {
  res.send("Backend API Running ✔");
});

// HEALTH CHECK — added
app.get("/health", async (req, res) => {
  try {
    const dbRes = await testConnection();
    res.json({ status: "ok", db: dbRes });
  } catch (err) {
    res.status(500).json({
      status: "db_error",
      error: err.message,
    });
  }
});

const PORT = process.env.PORT || 8080;

// Startup with DB test
const startServer = async () => {
  try {
    // Check DB at startup
    try {
      const dbRes = await testConnection();
      console.log("✅ Database connection test passed:", dbRes);
    } catch (dbErr) {
      console.error(
        "❌ Database connection test failed:",
        dbErr.message || dbErr
      );
      // Still start server so we can call /health
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
