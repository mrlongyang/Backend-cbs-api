import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createProduct, getProducts, updateProduct, deleteProduct } from "../controllers/product.controller";

const router = Router();

router.use(authMiddleware);
router.post("/", createProduct);
router.get("/", getProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
