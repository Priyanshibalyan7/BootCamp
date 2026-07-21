import express from "express";

import { auth } from "../middldeware/auth.js";
import {
    getAllUsers,
    deleteUser,
    getAllCoursesAdmin,
    deleteCourseAdmin
} from "../controller/adminController.js";
import { admin } from "../middldeware/admin.js";


const router = express.Router();

router.get("/users",auth,admin, getAllUsers);

router.delete("/user/:id",auth,admin, deleteUser);

router.get("/courses",auth ,admin,getAllCoursesAdmin);

router.delete("/course/:id",auth,admin, deleteCourseAdmin);

export default router;