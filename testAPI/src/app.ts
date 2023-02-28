/**
 * @fileoverview This is the top level Express app.
 */

import express, { Express, Request, Response } from "express";
import cors from "cors";
import path from "path";
import { Api } from "./api";

/**
 *
 * @param {Api} api An instance of the API Express router provided via
 *     dependency injection.
 * @return {Express} The top level Express server. It serves static assets
 *     from the root endpoint, and anything sent to the API endpoint is
 *     handled by the API router.
 */
export function App(api: Api): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("./build"));
  app.use("/api/v0", api.router);

  app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.resolve("./build/" + "index.html"));
  });

  return app;
}
