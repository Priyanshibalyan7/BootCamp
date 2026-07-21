import express from "express"
import { enrollCourse, getMyCourses, unenrollCourse } from "../controller/enrollmentController.js";
import { auth } from "../middldeware/auth.js";

const router = express.Router();

router.post("/enroll/:courseId", auth, enrollCourse);
router.get("/my-courses", auth, getMyCourses);
router.delete("/:courseId", auth, unenrollCourse);
export default router;