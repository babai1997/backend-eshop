import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.model.js";
import { OrderItem } from "../models/order-item.model.js";

const getOrderListController = asyncHandler( async (req, res) => {
    const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});

    if(!orderList){
        throw new ApiError(200, "Order List not found");
    }

    return res.status(200).json(
        new ApiResponse(201, orderList, "Order List found")
    );
})

const getOrderByIdController = asyncHandler( async (req, res) => {
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({ path: 'orderItems', model:'OrderItem',
        populate: {path: 'product', model:'Product', 
        populate: {path: 'category', model:'Category'
            }}, 
        });

        if(!order){
            throw new ApiError(400, "Order not found");
        }
    
        return res.status(200).json(
            new ApiResponse(201, order, "Order found")
        );
})

const createOrderController = asyncHandler( async ( req, res) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))
    const orderItemsIdsResolved =  await orderItemsIds;

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
        const orderItem = await OrderItem.findById(orderItemId).populate({path: 'product', model:'Product'});
        console.log(orderItem);
        const totalPrice = +orderItem.product.price * +orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a,b) => a + b , 0);
    console.log(totalPrice, "totalprice");
   
    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    });
    order = await order.save();

    if(!order){
        throw new ApiError(200, "Order not created");
    }

    return res.status(200).json(
        new ApiResponse(201, order, "Order created successfully")
    );
})

const updateOrderController = asyncHandler( async(req, res) => {

    const { id } = req.params;
    const { status } = req. body

    const order = await Order.findByIdAndUpdate(
         id,
        {
            status: status
        },
        { new: true}
    )

    if(!order){
        throw new ApiError(200, "Order not updated");
    }

    return res.status(200).json(
        new ApiResponse(201, order, "Order updated successfully")
    );
})

const deleteOrderController = asyncHandler( async(req, res) => {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id)
  
        if(!order) {
            throw new ApiError(404, "Order not found!");
        } else {
            order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndDelete(orderItem)
            })
            return res.status(200).json(
                new ApiResponse(200, order, "The order is deleted!")
            );
        }
    })

const getTotalSalesController = asyncHandler( async (req, res) => {
    let totalSales= await Order.aggregate([
        { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
    ])

    if(!totalSales){
        throw new ApiError(400, "The order sales cannot be generated");
    }

    totalSales = totalSales.pop().totalsales;

    return res.status(200).json(
        new ApiResponse(201, totalSales, "Order updated successfully")
    );
})

const getOrderCountController = asyncHandler( async (req, res) => {
    const orderCount = await Order.countDocuments({});

    if(!orderCount){
        throw new ApiError(400, "Order count not found");
    }

    return res.status(200).json(
        new ApiResponse(201, orderCount, "Order count sended")
    );
})

const getUserOrderByIdController = asyncHandler( async (req, res) => {
    const userOrderList = await Order.find({user: req.params.userid})
                populate({ path: 'orderItems', model:'OrderItem',
                populate: {path: 'product', model:'Product', 
                populate: {path: 'category', model:'Category'
        }}, 
    })
    .sort({'dateOrdered': -1});

    if(!userOrderList){
        throw new ApiError(400, "User order list not found");
    }

    return req.status(200).json(
        new ApiResponse(201, userOrderList, "User order list sended")
    );

});



export {
    getOrderListController,
    getOrderByIdController,
    createOrderController,
    updateOrderController,
    deleteOrderController,
    getTotalSalesController,
    getOrderCountController,
    getUserOrderByIdController

}