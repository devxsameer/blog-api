// src/app.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

/* -------------------- CORE MIDDLEWARE -------------------- */
app.use(express.json());

/* -------------------- ROUTES -------------------- */
app.route("/").get((req, res, next) => {
  res.json("Hello from Blog API");
});
