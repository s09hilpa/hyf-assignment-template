import express from "express";
import db from "../../../database.js";
import { z } from "zod";
const router = express.Router();

// Snippet body validation
const snippetSchema = z.object({
  title: z.string().min(1, "Title is required"),
  contents: z.string().min(1, "Contents are required"),
  user_id: z.number().int().positive(),
});

// Query validation (safe sorting)
const sortSchema = z.object({
  sort: z.enum(["title", "created_at"]).optional(),
  direction: z.enum(["asc", "desc"]).optional(),
});

// param validation
const userIdSchema = z.object({
  userId: z.string().regex(/^\d+$/, "User ID must be a number"),
});

// GET ALL SNIPPETS
router.get("/", async (req, res) => {
  try {
    const data = await db("snippets");
    res.status(200).json({ data });
  } catch (err) {
    console.error("GET ALL ERROR:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//CREATE SNIPPET (POST)
router.post("/", async (req, res) => {
  try {
    const parsed = snippetSchema.safeParse({
      ...req.body,
      user_id: Number(req.body.user_id),
    });

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues.map((i) => i.message),
      });
    }

    const { title, contents, user_id } = parsed.data;

    const [id] = await db("snippets").insert({
      title,
      contents,
      user_id,
    });

    res.status(201).json({
      message: "Snippet created",
      id,
    });
  } catch (err) {
    console.error("POST ERROR:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//  UNSAFE ENDPOINT (SQL INJECTION)
router.get("/unsafe", async (req, res) => {
  let query = db("snippets").select("*");

  if ("sort" in req.query) {
    const orderBy = req.query.sort.toString();

    if (orderBy.length > 0) {
      query = query.orderByRaw(orderBy); //  vulnerable
    }
  }

  console.log("UNSAFE SQL:", query.toSQL().sql);

  try {
    const data = await query;
    res.status(200).json({ data });
  } catch (err) {
    console.error("UNSAFE ERROR:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// SAFE ENDPOINT (FIXED)
router.get("/safe", async (req, res) => {
  try {
    const parsed = sortSchema.safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0].message,
      });
    }

    const { sort, direction } = parsed.data;

    let query = db("snippets");

    if (sort) {
      query = query.orderBy(sort, direction || "asc");
    }

    const data = await query;

    res.status(200).json({ data });
  } catch (err) {
    console.error("SAFE ERROR:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//public feed(non-private snippets)
router.get("/public", async (req, res) => {
  try {
    const data = await db("snippets")
      .where({ is_private: 0 })
      .orderBy("created_at", "desc");

    res.status(200).json({ data });
  } catch (err) {
    console.error("PUBLIC ERROR:", err.message);

    res.status(500).json({
      error: "Internal server error",
    });
  }
});
//SNIPPETS BY USER: ID
router.get("/user/:userId", async (req, res) => {
  try {
    const parsed = userIdSchema.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0].message,
      });
    }

    const userId = Number(parsed.data.userId);

    const data = await db("snippets")
      .where({ user_id: userId })
      .orderBy("created_at", "desc");

    if (data.length === 0) {
      return res.status(404).json({
        error: "No snippets found for this user",
      });
    }

    res.status(200).json({ data });
  } catch (err) {
    console.error("USER ERROR:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
