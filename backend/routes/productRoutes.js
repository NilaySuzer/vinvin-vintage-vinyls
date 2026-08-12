import express from 'express';
import { getProducts, getProductById, addComment } from '../controllers/productController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/:id/comments', protect, addComment, admin);

export default router;