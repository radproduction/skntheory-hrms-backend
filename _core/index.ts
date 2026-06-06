import "dotenv/config";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import avatarUploadRouter from "../avatar-upload";
import employeeDocumentUploadRouter from "../employee-document-upload";
import { connectToMongoDB } from "../mongodb";
import { UPLOADS_DIR } from "../storage";
import { initRealtime } from "./realtime";

async function startServer() {
  await connectToMongoDB();

  const app = express();
  const server = createServer(app);
  initRealtime(server);
  const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map(origin => origin.trim()).filter(Boolean)
    : undefined;
  app.use(
    cors({
      origin: corsOrigin && corsOrigin.length > 0 ? corsOrigin : true,
      credentials: true,
    })
  );
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // Serve uploaded files
  app.use("/uploads", express.static(UPLOADS_DIR));
  // Avatar upload endpoint
  app.use(avatarUploadRouter);
  // Employee document upload endpoint
  app.use(employeeDocumentUploadRouter);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  const port = Number.parseInt(process.env.PORT || "3000", 10);
  const host = process.env.HOST || "0.0.0.0";

  server.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}/`);
  });
}

startServer().catch(console.error);
