import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
//import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {name, email, password } = req.body

    // [name, email, password].some((field) => field.trim() === "")

    if ( !name || !email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // const avatarLocalPath = req.file?.path;

    // if (!avatarLocalPath) {
    //     throw new ApiError(400, "Avatars file is required")
    // }

    // const avatar = await uploadOnCloudinary(avatarLocalPath)

    // if (!avatar) {
    //     throw new ApiError(400, "Avatar file is required")
    // }

    const user = await User.create({
        name,
        //avatar: avatar.url,
        email, 
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    const token = await user.generateAccessToken();
    createdUser["password"] = undefined;
    createdUser["accessToken"] = token;

    // res.cookie('jwt', token, {
    //     expires: new Date(
    //       Date.now() + 1 * 24 * 60 * 60 * 1000 //******************
    //     ),
    //     httpOnly: true,
    //     secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    //   });

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const loginUser = asyncHandler(async (req, res) => {

    const {email, password} = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
         throw new ApiError(400, 'Please provide email and password!');
      }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.isPasswordCorrect(password))) {
        throw new ApiError(401, 'Incorrect email or password');
    }

    // 3) If everything ok, send token to client
    const token = await user.generateAccessToken();
    user["password"] = undefined;
    user["accessToken"] = token;

    // res.cookie('jwt', token, {
    //     expires: new Date(
    //       Date.now() + 1 * 24 * 60 * 60 * 1000 //******************
    //     ),
    //     httpOnly: true,
    //     secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    //   });

    return res.status(201).json(
        new ApiResponse(200, user, "User logged in Successfully")
    )

})

const getUser = asyncHandler( async (req, res) => {
    const user = await User.find().select("-password");

    if(!user){
        throw new ApiError(404,"User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "User found successfully")
    )
})

const getUserById = asyncHandler( async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if(!user){
        throw new ApiError(404,"User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "User found successfully")
    )
})


const getUserCount = asyncHandler( async(req, res) => {
    const userCount = await User.countDocuments({});

    if(!userCount){
        throw new ApiError(404, "User count not found");
    }

    return res.status(201).json(
        new ApiResponse(200, userCount, "User count find successfully")
    )

})

const updateUser = asyncHandler(async(req, res)=> {
    const userExist = await User.find({_id:req.params.id});
    let newPassword;
    // if(req.body.password){
    //     newPassword = bcrypt.hashSync(req.body.password, 10);
    // }else{
    //     newPassword = userExist.passwordHash;
    // }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            street: req.body.street,
            apartment: req.body.apartment,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
        },
        { new: true}
    )  

    if(!user){
        throw new ApiError(404, "User not updated");
    }

    return res.status(201).json(
        new ApiResponse(200, user, "User upted successfully")
    )
})

const deleteUser = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const user = User.findByIdAndDelete(id);

    if(!user){
        throw new ApiError(404, "User not found");
    }

    return res.status(204).json(
        new ApiResponse(204, user, "User deleted successfully")
    )
})



export {
    registerUser,
    loginUser,
    getUser,
    getUserById,
    getUserCount,
    updateUser,
    deleteUser
}