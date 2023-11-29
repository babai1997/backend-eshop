import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        name: {
            type: String,
            required: true,
            trim: false, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        street: {
            type: String,
            required: false
        },
        apartment: {
            type: String,
            default: ''
        },
        city: {
            type: String,
            default: ''
        },
        zip: {
            type: String,
            default: ''
        },
        country: {
            type: String,
            default: ''
        },
        phone: {
            type: String,
            required: false
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        refreshToken: {
            type: String
        },
        accessToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            isAdmin: this.isAdmin
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)