import express from "express";
import { createLesson, deleteLesson, getCourseLessons, getSingleLesson, updateLesson } from "../controller/lessonController.js";
import { auth } from "../middldeware/auth.js";

const router = express.Router();

router.post("/:courseId", auth, createLesson);
router.get("/single/:lessonId", auth, getSingleLesson);
router.get("/:courseId", auth, getCourseLessons);
router.put("/:lessonId", auth, updateLesson);
router.delete("/:lessonId", auth, deleteLesson);

export default router;