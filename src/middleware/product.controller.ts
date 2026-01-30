import { Request, Response } from "express";
import { db } from "../db";

export async function createProduct(req: Request, res: Response) {
  const { product_id, product_name } = req.body as { product_id: string; product_name: string };

  if (!product_id || !product_name) return res.status(400).json({ message: "Missing fields" });
  if (product_id.length !== 3) return res.status(400).json({ message: "product_id must be 3 characters" });

  try {
    const [exists] = await db.query<any[]>("SELECT product_id FROM product WHERE product_id=?", [product_id]);
    if (exists.length > 0) return res.status(409).json({ message: "Product already exists" });

    await db.query("INSERT INTO product (product_id, product_name) VALUES (?,?)", [product_id, product_name]);
    return res.json({ message: "Create success" });
  } catch (e: any) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
}

export async function getProducts(req: Request, res: Response) {
  try {
    const [rows] = await db.query<any[]>("SELECT * FROM product ORDER BY product_id");
    return res.json(rows);
  } catch (e: any) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
}

export async function updateProduct(req: Request, res: Response) {
  const id = req.params.id;
  const { product_name } = req.body as { product_name: string };

  if (!product_name) return res.status(400).json({ message: "Missing product_name" });

  try {
    const [result] = await db.query<any>("UPDATE product SET product_name=? WHERE product_id=?", [product_name, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found" });
    return res.json({ message: "Update success" });
  } catch (e: any) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  const id = req.params.id;

  try {
    const [result] = await db.query<any>("DELETE FROM product WHERE product_id=?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found" });
    return res.json({ message: "Delete success" });
  } catch (e: any) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
}
