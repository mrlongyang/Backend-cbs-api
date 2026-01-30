import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";

export const app = express();

app.use(cors());
app.use(express.json());

// serve simple web forms
app.use(express.static(path.join(process.cwd(), "public")));

app.use("/api", authRoutes);
app.use("/api/products", productRoutes);

app.get("/health", (_, res) => 
    res.json({ ok: true })
);
