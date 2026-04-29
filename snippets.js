import express from "express";
import db from "../../../database.js";

const router = express.Router();

// GET all snippets
router.get("/", async (req, res) => {
  try {
    const snippets = await db("snippets");
    res.json({
      message: "Snippets fetched successfully",
      data: snippets,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET SNIPPET BY ID
// GET /api/snippets/:id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const snippet = await db("snippets").where("id", id).first();

    if (!snippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    res.json(snippet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// CREATE SNIPPET (POST)
router.post("/", async (req, res) => {
  try {
    const { title, contents, user_id } = req.body;

    if (!title || !contents || !user_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [id] = await db("snippets").insert({
      title,
      contents,
      user_id,
      is_private: 1,
    });

    const newSnippet = await db("snippets").where("id", id).first();

    res.status(201).json(newSnippet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// UPDATE SNIPPET (PUT)
router.put("/:id", async (req, res) => {
  try {
    const updated = await db("snippets")
      .where("id", req.params.id)
      .update(req.body);

    if (!updated) {
      return res.status(404).json({ error: "Snippet not found" });
    }

    const snippet = await db("snippets").where("id", req.params.id).first();

    res.json(snippet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// DELETE SNIPPET
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await db("snippets").where("id", req.params.id).del();

    if (!deleted) {
      return res.status(404).json({ error: "Snippet not found" });
    }

    res.json({ message: "Snippet deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
