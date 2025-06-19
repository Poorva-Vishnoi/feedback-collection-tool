import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import feedbackRoutes from "./routes/feedback.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.set("io", io);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/feedback', feedbackRoutes);

io.on("connection", (socket) => {
  console.log("📶 Admin connected:", socket.id);
  socket.on("disconnect", () => console.log("🔌 Admin disconnected:", socket.id));
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

server.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`),
);
