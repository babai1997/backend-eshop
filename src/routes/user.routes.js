import { Router } from "express";
import { loginUser, registerUser, getUser, getUserById, getUserCount, updateUser, deleteUser } from "../controllers/user.controller.js";
//import {upload} from "../middlewares/multer.middleware.js"


const router = Router()

router.route("/register").post(
    //upload.single('avatar'),
    registerUser
    )

    router.route("/login").post(
        loginUser
    )

    router.route('/').get(
        getUser
    )

    router.route('/:id').get(
        getUserById
    )

    router.route('/get/count').get(
        getUserCount
    )

    router.route('/:id').put(
        updateUser
    )

    router.route('/:id').delete(
        deleteUser
    )
export default router