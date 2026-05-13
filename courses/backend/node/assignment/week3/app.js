import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import express from "express";
import snippetsRouter from "./api/src/routers/snippets.js";

const app = express();
const port = 3006;

app.use(express.json());
console.log("APP JWT SECRET:", process.env.JWT_SECRET);
/*  THIS MUST BE AT THE TOP (before routes) */
app.use((req, res, next) => {
  console.log(" Request: received", req.method, req.url);
  next();
});

// Routes

app.get("/", (req, res) => {
  res.send("Snippets API running");
});

app.use("/api/snippets", snippetsRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
