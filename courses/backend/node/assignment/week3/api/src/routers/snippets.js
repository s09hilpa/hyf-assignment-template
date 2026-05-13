import express from "express";
import db from "../../../database.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { z } from "zod";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "myjwtsecret123";
//API KEY MIDDLEWARE

const API_KEY = process.env.API_KEY || "myapikey123";

function requireApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({
      error: "API key missing",
    });
  }

  if (apiKey !== API_KEY) {
    return res.status(401).json({
      error: "Invalid API key",
    });
  }

  next();
}
//
// ===============================
// ZOD SCHEMAS
// ===============================
//

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

const snippetSchema = z.object({
  title: z.string().min(1, "Title is required"),
  contents: z.string().min(1, "Contents are required"),
  user_id: z.number().int().positive(),
});


//
// ===============================
// JWT AUTH MIDDLEWARE
// ===============================
//
function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expired",
      });
    }

    return res.status(401).json({
      error: "Invalid token",
    });
  }
}
//ADMIN MIDDLEWARE
function adminOnly(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "Admins only",
    });
  }

  next();
}
//
// ===============================
// DATABASE TOKEN AUTH MIDDLEWARE
// ===============================
//

async function authToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Missing token",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    const storedToken = await db("tokens").where({ token }).first();

    if (!storedToken) {
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    // optional expiration check
    if (
      storedToken.expires_at &&
      new Date(storedToken.expires_at) < new Date()
    ) {
      return res.status(401).json({
        error: "Token expired",
      });
    }

    req.user = {
      id: storedToken.user_id,
    };

    next();
  } catch (err) {
    console.error("AUTH TOKEN ERROR:", err.message);

    res.status(500).json({
      error: "Internal server error",
    });
  }
}

//
// ===============================
// GET ALL SNIPPETS
// ===============================
//

router.get("/", async (req, res) => {
  try {
    const data = await db("snippets");

    res.status(200).json({ data });
  } catch (err) {
    console.error("GET ERROR:", err.message);

    res.status(500).json({
      error: "Internal server error",
    });
  }
});



//
// ===============================
// GET SNIPPETS BY USER ID
// ===============================
//

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

    res.status(500).json({
      error: "Internal server error",
    });
  }
});

//
// ===============================
// LOGIN WITH JWT
// ===============================
//

router.post("/login", async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0].message,
      });
    }

    const { email, password } = parsed.data;

    const user = await db("users").where({ email }).first();

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const validPassword = await bcrypt.compare(password, user.token);

    if (!validPassword) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);

    res.status(500).json({
      error: "Internal server error",
    });
  }
});

//
// ===============================
// LOGIN WITH DATABASE TOKEN
// ===============================
//

router.post("/login-token", async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0].message,
      });
    }

    const { email, password } = parsed.data;

    const user = await db("users").where({ email }).first();

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const validPassword = await bcrypt.compare(password, user.token);

    if (!validPassword) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // Generate random token
    const generatedToken = crypto.randomBytes(32).toString("hex");

    // Expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // Store token in DB
    await db("tokens").insert({
      user_id: user.id,
      token: generatedToken,
      expires_at: expiresAt,
    });

    res.status(200).json({
      message: "Login successful",
      token: generatedToken,
    });
  } catch (err) {
    console.error("LOGIN TOKEN ERROR:", err.message);

    res.status(500).json({
      error: "Internal server error",
    });
  }
});

//
// ===============================
// LOGOUT DATABASE TOKEN
// ===============================
//

router.post("/logout-token", authToken, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    const token = authHeader.split(" ")[1];

    await db("tokens").where({ token }).del();

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("LOGOUT ERROR:", err.message);

    res.status(500).json({
      error: "Internal server error",
    });
  }
});

//
// ===============================
// PROTECTED CREATE SNIPPET (JWT)
// ===============================
//

router.post("/protected-jwt", authMiddleware, async (req, res) => {
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
      message: "Snippet created with JWT",
      id,
    });
  } catch (err) {
    console.error("POST JWT ERROR:", err.message);

    res.status(500).json({
      error: "Internal server error",
    });
  }
});

//
// ===============================
// PROTECTED DELETE SNIPPET (JWT)
// ===============================
//

router.delete(
  "/protected-jwt/:id",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!id) {
        return res.status(400).json({
          error: "Invalid snippet ID",
        });
      }

      const deleted = await db("snippets").where({ id }).del();

      if (!deleted) {
        return res.status(404).json({
          error: "Snippet not found",
        });
      }

      res.status(200).json({
        message: "Snippet deleted with JWT",
      });
    } catch (err) {
      console.error("DELETE JWT ERROR:", err.message);

      res.status(500).json({
        error: "Internal server error",
      });
    }
  },
);

//
// ===============================
// PROTECTED CREATE SNIPPET (DB TOKEN)
// ===============================
//

router.post("/protected-db", authToken, async (req, res) => {
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
      message: "Snippet created with DB token",
      id,
    });
  } catch (err) {
    console.error("POST DB TOKEN ERROR:", err.message);

    res.status(500).json({
      error: "Internal server error",
    });
  }
});

//
// ===============================
// PROTECTED DELETE SNIPPET (DB TOKEN)
// ===============================
//

router.delete("/protected-db/:id", authToken, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: "Invalid snippet ID",
      });
    }

    const deleted = await db("snippets").where({ id }).del();

    if (!deleted) {
      return res.status(404).json({
        error: "Snippet not found",
      });
    }

    res.status(200).json({
      message: "Snippet deleted with DB token",
    });
  } catch (err) {
    console.error("DELETE DB TOKEN ERROR:", err.message);

    res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: "Invalid snippet ID",
      });
    }

    const deleted = await db("snippets").where({ id }).del();

    if (!deleted) {
      return res.status(404).json({
        error: "Snippet not found",
      });
    }

    res.status(200).json({
      message: "Snippet deleted",
    });
  } catch (err) {
    console.error("DELETE ERROR:", err.message);

    res.status(500).json({
      error: "Internal server error",
    });
  }
});
router.get("/health", requireApiKey, (req, res) => {
  res.status(200).json({
    status: "API running",
    time: new Date(),
  });
});
export default router;
