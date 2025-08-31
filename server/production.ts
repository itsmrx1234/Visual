import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for production
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Serve static files in production
const distPath = path.resolve(__dirname, "..", "dist", "public");
app.use(express.static(distPath));

// Register API routes
registerRoutes(app).then(() => {
  console.log("Routes registered successfully");
}).catch((error) => {
  console.error("Failed to register routes:", error);
});

// Fallback to index.html for SPA routing
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    res.status(404).json({ message: "API endpoint not found" });
  } else {
    res.sendFile(path.resolve(distPath, "index.html"));
  }
});

// For Vercel serverless functions
export default app;