import mongoose from "mongoose";
import Progress from "../models/Progress.js";
import Lesson from "../models/Lesson.js";
import Enrollment from "../models/Enrollment.js";
export const markLessonCompleted = async (req, res) => {
    try {

        // Only students
        if (req.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Only students can mark lessons as completed"
            });
        }

        const { lessonId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Lesson ID"
            });
        }

        const lesson = await Lesson.findById(lessonId);

        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Lesson not found"
            });
        }

        // Check enrollment
        const enrolled = await Enrollment.findOne({
            student: req.userId,
            course: lesson.course
        });

        if (!enrolled) {
            return res.status(403).json({
                success: false,
                message: "Please enroll in the course first"
            });
        }

        // Prevent duplicate completion
        const alreadyCompleted = await Progress.findOne({
            student: req.userId,
            lesson: lessonId
        });

        if (alreadyCompleted) {
            return res.status(400).json({
                success: false,
                message: "Lesson already completed"
            });
        }

        const progress = await Progress.create({
            student: req.userId,
            course: lesson.course,
            lesson: lessonId,
            completed: true
        });

        res.status(201).json({
            success: true,
            message: "Lesson marked as completed",
            progress
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
export const getCourseProgress = async (req, res) => {
    try {

        if (req.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Only students can view progress"
            });
        }

        const { courseId } = req.params;

        // Total lessons
        const totalLessons = await Lesson.countDocuments({
            course: courseId
        });

        // Completed lessons
        const completedLessons = await Progress.countDocuments({
            student: req.userId,
            course: courseId,
            completed: true
        });

        const progress =
            totalLessons === 0
                ? 0
                : Math.round((completedLessons / totalLessons) * 100);

        res.status(200).json({
            success: true,
            totalLessons,
            completedLessons,
            progress
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};