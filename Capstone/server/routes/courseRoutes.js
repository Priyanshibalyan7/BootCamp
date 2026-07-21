import express from "express";
import { createCourse, deleteCourse, getAllCourses, getSingleCourse, updateCourse } from "../controller/courseController.js";
import { auth } from "../middldeware/auth.js";


const router = express.Router();

router.get("/", getAllCourses);
router.post("/create",auth, createCourse);
router.get("/:id", getSingleCourse);
router.put("/:id", auth, updateCourse);
router.delete("/:id", auth, deleteCourse);


export default router;
