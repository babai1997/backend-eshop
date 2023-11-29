import { Router } from "express";
import { 
    getProductController,
    getProductByIdController,
    createProductController,
    updateProductController,
    deleteProductController,
    getProductCountController,
    getFeaturedProductCountController
}
from '../controllers/product.controller.js'
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route('/').get(
    getProductController
)

router.route('/:id').get(
    getProductByIdController
)

router.route('/').post(
    upload.single('image'),
    createProductController
)

router.route('/:id').put(
    upload.single('image'),
    updateProductController
)

router.route('/:id').delete(
    deleteProductController
)

router.route('/get/count').get(
    getProductCountController
)

router.route('/get/featured/:count').get(
    getFeaturedProductCountController
)

router.route('/gallery-images/:id').put(
    
)


export default router;