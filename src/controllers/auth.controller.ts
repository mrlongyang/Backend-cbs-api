import { Request, Response } from "express";
import { db } from "../db";
import crypto from "crypto";
import jwt from "jsonwebtoken";

function md5(text: string) {
  return crypto.createHash("md5").update(text).digest("hex"); // 32 chars
}

export async function register(req: Request, res: Response) {
  const { user_id, user_name, user_password } = req.body as {
    user_id: string;
    user_name: string;
    user_password: string;
  };

  if (!user_id || !user_name || !user_password) {
    return res.status(400).json({ message: "Missing fields" });
  }
  if (user_id.length !== 3) {
    return res.status(400).json({ message: "user_id must be 3 characters" });
  }

  try {
    const [exists] = await db.query<any[]>("SELECT user_id FROM user WHERE user_id=?", [user_id]);
    if (exists.length > 0) return res.status(409).json({ message: "User already exists" });

    const hashed = md5(user_password);

    await db.query("INSERT INTO user (user_id, user_name, user_password) VALUES (?,?,?)", [
      user_id,
      user_name,
      hashed
    ]);

    return res.json({ message: "Register success" });
  } catch (e: any) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
}

export async function login(req: Request, res: Response) {
  const { user_id, user_password } = req.body as { user_id: string; user_password: string };

  if (!user_id || !user_password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const [rows] = await db.query<any[]>("SELECT * FROM user WHERE user_id=?", [user_id]);

    if (rows.length === 0) return res.status(404).json({ message: "User not found" });

    const user = rows[0];
    const hashed = md5(user_password);

    if (hashed !== user.user_password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    return res.json({
      message: "Login success",
      token,
      user: { user_id: user.user_id, user_name: user.user_name }
    });
  } catch (e: any) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
}
