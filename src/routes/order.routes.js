import { Router } from "express";
import {
    getOrderListController,
    getOrderByIdController,
    createOrderController,
    updateOrderController,
    deleteOrderController,
    getTotalSalesController,
    getOrderCountController,
    getUserOrderByIdController
} 
from '../controllers/order.controller.js'

const router = Router();

router.route('/').get(
    getOrderListController
)

router.route('/:id').get(
    getOrderByIdController
)

router.route('/').post(
    createOrderController
)

router.route('/:id').put(
    updateOrderController
)

router.route('/:id').delete(
    deleteOrderController
)

router.route('/get/totalsales').get(
    getTotalSalesController
)

router.route('/get/count').get(
    getOrderCountController
)

router.route('/get/userorders/:userid').get(
    getUserOrderByIdController
)

export default router;