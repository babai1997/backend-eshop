import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getProductController = asyncHandler( async(req, res) => {
    
    let filter = {};
    console.log(req.query.categories, "categories");

    if(req.query.categories){
      filter = {category: req.query.categories.split(',')}
    }
    const productList = await Product.find(filter).populate('category');

    if(!productList){
        throw new ApiError(200, "Product not found")
    };

    return res.status(200).json(
        new ApiResponse(201, productList, "Product List found")
    );

})

const getProductByIdController = asyncHandler( async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');

    if(!product){
        throw new ApiError(200, "Product not found");
    }

    return res.status(200).json(
        new ApiResponse(201, product, "Product List found")
    );

})

const createProductController = asyncHandler( async (req, res) => {

    const { name, description, category, countInStock} = req.body

    //console.log(name, description, category, countInStock,"__________");

    if (
        [name, description, category, countInStock].some((field) => field.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existingCategory = await Category.findById(category);
    if(!existingCategory){
        throw new ApiError(200, "Invalid category");
    }

    const productImageLocalPath = req.file?.path;

    if (!productImageLocalPath) {
        throw new ApiError(400, "Product image file is required")
    }

    const productImage = await uploadOnCloudinary(productImageLocalPath)

    if (!productImage) {
        throw new ApiError(400, "Product image file is required")
    }

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: productImage.url,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })
    product = await product.save();

    if(!product){
        throw new ApiError(200, "Product not saved");
    }

    return res.status(200).json(
        new ApiResponse(201, product, "Product created successfully")
    );
})

const updateProductController = asyncHandler( async (req, res) => {
    const { id } = req.params;
    const { name, 
        description, 
        richDescription, 
        brand, 
        price, 
        category, 
        countInStock, 
        rating, 
        numReviews, 
        isFeatured } = req.body;

        console.log(id, name, description, category, countInStock,"__________");


    if(!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid product id");
     }

     const existingCategory = await Category.findById(category);
     if(!existingCategory){
         throw new ApiError(400, "Invalid category");
     }
   
     const product = await Product.findById(id);
     if (!product){
        throw new ApiError(400, "Invalid Product!");
     }

     const productImageLocalPath = req.file?.path;
     let imagepath;
     if (productImageLocalPath) {
        imagepath = await uploadOnCloudinary(productImageLocalPath);
        imagepath = imagepath.url
     }else{
        imagepath = product.image
     }
   
     const updatedProduct = await Product.findByIdAndUpdate(
          id,
         {
             name: name,
             description: description,
             richDescription: richDescription,
             image: imagepath,
             brand: brand,
             price: price,
             category: category,
             countInStock: countInStock,
             rating: rating,
             numReviews: numReviews,
             isFeatured: isFeatured,
         },
         { new: true}
     )
     if(!updatedProduct){
        throw new ApiError(500, "Product not updated");
    }

    return res.status(200).json(
        new ApiResponse(201, updatedProduct, "Product updated successfully")
    );

})

const deleteProductController = asyncHandler( async( req, res) => {
    const { id } = req.params;
   
    const product = await Product.findByIdAndDelete(id);
    if(!product){
        throw new ApiError(404, "The Product was not deleted");
    }

    return res.status(201).json(
        new ApiResponse(200, product, "Product deleted successfully")
    )
})

const getProductCountController = asyncHandler( async(req, res) => {
    const productCount = await Product.countDocuments({});

    if(!productCount){
        throw new ApiError(404, "Product count not found");
    }

    return res.status(201).json(
        new ApiResponse(200, productCount, "Product count find successfully")
    )

})

const getFeaturedProductCountController = asyncHandler( async(req, res) => {
    const count = req.params.count ? req.params.count : 0
    const products = await Product.find({isFeatured: true}).limit(+count);

    if(!products){
        throw new ApiError(404, "Featured Product count not found");
    }

    return res.status(201).json(
        new ApiResponse(200, products, "Featured Product count find successfully")
    )

})

export {
    getProductController,
    getProductByIdController,
    createProductController,
    updateProductController,
    deleteProductController,
    getProductCountController,
    getFeaturedProductCountController
}