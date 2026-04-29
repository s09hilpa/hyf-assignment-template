import express from "express";
import snippetsRouter from "./api/src/routers/snippets.js";
import tagsRouter from "./api/src/routers/tags.js";
import searchRouter from "./api/src/routers/search.js";
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

/*  THIS MUST BE AT THE TOP (before routes) */
app.use((req, res, next) => {
  console.log("➡️ Request:", req.method, req.url);
  next();
});

// Routes
app.use("/api/snippets", snippetsRouter);
app.get("/", (req, res) => {
  res.send("Hello Class!");
});
app.use("/api/tags", tagsRouter);
app.use("/", searchRouter);
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
