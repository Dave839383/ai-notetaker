import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRouter from "./routes/api";

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // React FE URL
  credentials: true
}));

// Routes
app.use("/v1", apiRouter);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});