import { Router } from "express";
import { 
    getCategoryController,
    getCategoryByIdController, 
    createCategoryController,
    updateCategoryController,
    deleteCategoryController 
} from "../controllers/category.controller.js";

const router = Router();

router.route('/').get(
    getCategoryController
)

router.route('/:id').get(
    getCategoryByIdController
)

router.route('/').post(
    createCategoryController
)

router.route('/:id').put(
    updateCategoryController
)
router.route('/:id').delete(
    deleteCategoryController
)



export default router;