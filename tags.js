import express from "express";
import db from "../../../database.js";

const router = express.Router();

// GET ALL
router.get("/", async (req, res) => {
  try {
    const data = await db("tags");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET BY ID
router.get("/:id", async (req, res) => {
  try {
    const row = await db("tags").where("id", req.params.id).first();

    if (!row) {
      return res.status(404).json({ error: "Tag not found" });
    }

    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing name" });
    }

    const [id] = await db("tags").insert({ name });

    const created = await db("tags").where("id", id).first();

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT
router.put("/:id", async (req, res) => {
  try {
    const updated = await db("tags")
      .where("id", req.params.id)
      .update(req.body);

    if (!updated) {
      return res.status(404).json({ error: "Tag not found" });
    }

    const row = await db("tags").where("id", req.params.id).first();

    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await db("tags").where("id", req.params.id).del();

    if (!deleted) {
      return res.status(404).json({ error: "Tag not found" });
    }

    res.json({ message: "Tag deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
