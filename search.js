import express from "express";
import db from "../../../database.js";

const router = express.Router();

//GET /search
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    let results;

    if (!q) {
      results = await db("snippets");
    } else {
      results = await db("snippets").where("title", "like", `%${q}%`);
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET /snippets/:id
router.get("/snippets/:id", async (req, res) => {
  try {
    const snippet = await db("snippets").where("id", req.params.id).first();

    if (!snippet) {
      return res.status(404).json({ error: "Snippet not found" });
    }

    res.json(snippet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//POST / search;
router.post("/search", async (req, res) => {
  try {
    const { q } = req.query;
    const { fields } = req.body;

    // ❌ both provided
    if (q && fields) {
      return res.status(400).json({
        error: "Provide either q or fields, not both",
      });
    }

    let query = db("snippets");

    // 🔍 search with q
    if (q) {
      query = query
        .where("title", "like", `%${q}%`)
        .orWhere("contents", "like", `%${q}%`);
    }

    // 🔍 filter with fields
    if (fields) {
      Object.keys(fields).forEach((key) => {
        query = query.where(key, fields[key]);
      });
    }

    const results = await query;

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;