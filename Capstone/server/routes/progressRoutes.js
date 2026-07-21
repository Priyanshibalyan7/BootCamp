import express from "express";
import {
    markLessonCompleted,
    getCourseProgress
} from "../controller/progressController.js";
import { auth } from "../middldeware/auth.js";


const router = express.Router();

router.post("/:lessonId",auth , markLessonCompleted);

router.get("/:courseId", auth, getCourseProgress);

export default router;