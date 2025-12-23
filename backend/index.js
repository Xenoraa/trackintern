// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// import sequelize (default) and connect helper (named)
import sequelize, { connectMYSQL } from "./config/db.js";

// routes
import studentRoutes from "./routes/student.js";
import authRoutes from "./routes/auth.js";
import logbookRoutes from "./routes/logbook.js";
import letterRoutes from "./routes/letter.js";
import verificationRoutes from "./routes/VerificationCode.js"; // file name used earlier
import institutionSupervisorRoutes from "./routes/institutionSupervisor.js";
import industrySupervisorRoutes from "./routes/industrySupervisor.js";
import hodRoutes from "./routes/hod.js";
import siwesCoordinatorRoutes from "./routes/siwesCoordinator.js";
// optional aggregated supervisors route if you implemented one:
// import supervisorRoutes from "./routes/supervisor.js";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect DB and sync
connectMYSQL();

sequelize
  .sync({ alter: true })
  .then(() => console.log(" All tables synced successfully"))
  .catch((err) => console.error("Sync error:", err.message));

// health
app.get("/", (req, res) => res.send("InternTrack backend is running..."));

// register routes (consistent REST prefixes)
app.use("/api/auth", authRoutes);                          // /api/auth/*
app.use("/api/students", studentRoutes);                  // /api/students/*
app.use("/api/logbook", logbookRoutes);                  // /api/logbook/*
app.use("/api/letters", letterRoutes);                   // /api/letters/*
app.use("/api/verification", verificationRoutes);        // /api/verification/*

/* Supervisor-related routes */
app.use("/api/institution-supervisors", institutionSupervisorRoutes); // /api/institution-supervisors/*
app.use("/api/industry-supervisors", industrySupervisorRoutes);       // /api/industry-supervisors/*
app.use("/api/hods", hodRoutes);                                     // /api/hods/*
app.use("/api/siwes-coordinators", siwesCoordinatorRoutes);          // /api/siwes-coordinators/*

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found", path: req.originalUrl });
});

// basic error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
