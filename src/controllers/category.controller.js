import { asyncHandler } from "../utils/asyncHandler.js";
import { Category } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getCategoryController = asyncHandler( async (req, res) => {
    const categoryList = await Category.find();
    if(!categoryList){
        throw new ApiError(404, "The Category List not found");
    }

    return res.status(200).json(
        new ApiResponse(200, categoryList, "Category List found")
    )

})

const getCategoryByIdController = asyncHandler( async(req, res) => {
    const category = await Category.findById(req.params.id);

    if(!category){
        throw new ApiError(404, "The Category search by this id was not exists");
    }

    return res.status(201).json(
        new ApiResponse(200, category, "Categor found successfully")
    )
})

const createCategoryController = asyncHandler( async(req, res) => {
    
    const {name, icon, color } = req.body

    if (
        [name, icon, color].some((field) => field.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    });
    category = await category.save();

    if(!category){
        throw new ApiError(404, "Category not created");
    }

    return res.status(201).json(
        new ApiResponse(200, category, "Category created successfully")
    )
})

const updateCategoryController = asyncHandler( async(req, res) => {

    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
           name: req.body.name,
           icon: req.body.icon,
           color: req.body.color
        },
        {new: true}
    );

    if(!category){
        throw new ApiError(404, "The Category was not updated successfully");
    }

    return res.status(201).json(
        new ApiResponse(200, category, "Category updated successfully")
    )
})

const deleteCategoryController = asyncHandler( async (req, res) => {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if(!category){
        throw new ApiError(404, "The Category was not deleted");
    }

    return res.status(201).json(
        new ApiResponse(200, category, "Category deleted successfully")
    )
})

export{
    getCategoryController,
    getCategoryByIdController,
    createCategoryController,
    updateCategoryController,
    deleteCategoryController
    
}