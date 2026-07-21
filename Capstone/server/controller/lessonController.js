import mongoose from "mongoose";
import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

export const createLesson = async (req, res) => {
    try {

        if (req.role !== "instructor") {
            return res.status(403).json({
                success: false,
                message: "Only instructors can create lessons",
            });
        }

        const { courseId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Course ID",
            });
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Only course owner can add lessons
        if (course.instructor.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: "You can add lessons only to your own courses",
            });
        }

        const {
            title,
            description,
            videoUrl,
            lessonNumber,
        } = req.body;

        const lesson = await Lesson.create({
            title,
            description,
            videoUrl,
            lessonNumber,
            course: courseId,
        });

        res.status(201).json({
            success: true,
            message: "Lesson created successfully",
            lesson,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

export const getCourseLessons = async (req, res) => {
    try {

        const { courseId } = req.params;

        // Check valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Course ID"
            });
        }

        // Check course exists
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // If Instructor → only own course
        if (req.role === "instructor") {

            if (course.instructor.toString() !== req.userId) {
                return res.status(403).json({
                    success: false,
                    message: "You can only view lessons of your own courses"
                });
            }

        }

        // If Student → enrolled?
        if (req.role === "student") {

            const enrollment = await Enrollment.findOne({
                student: req.userId,
                course: courseId
            });

            if (!enrollment) {
                return res.status(403).json({
                    success: false,
                    message: "Enroll in this course first"
                });
            }

        }

        const lessons = await Lesson.find({
            course: courseId
        }).sort({
            lessonNumber: 1
        });

        res.status(200).json({
            success: true,
            totalLessons: lessons.length,
            lessons
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
export const getSingleLesson = async (req, res) => {
    try {

        const { lessonId } = req.params;

        // Validate Lesson ID
        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Lesson ID"
            });
        }

        // Find Lesson
        const lesson = await Lesson.findById(lessonId);

        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Lesson not found"
            });
        }

        // Find Course
        const course = await Course.findById(lesson.course);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Instructor can access only their own course lessons
        if (req.role === "instructor") {

            if (course.instructor.toString() !== req.userId) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }

        }

        // Student must be enrolled
        if (req.role === "student") {

            const enrollment = await Enrollment.findOne({
                student: req.userId,
                course: course._id
            });

            if (!enrollment) {
                return res.status(403).json({
                    success: false,
                    message: "Please enroll in the course first"
                });
            }

        }

        res.status(200).json({
            success: true,
            lesson
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
export const updateLesson = async (req, res) => {
    try {

        const { lessonId } = req.params;

        // Check valid Lesson ID
        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Lesson ID"
            });
        }

        // Find lesson
        const lesson = await Lesson.findById(lessonId);

        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Lesson not found"
            });
        }

        // Find course
        const course = await Course.findById(lesson.course);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Only instructor can update
        if (req.role !== "instructor") {
            return res.status(403).json({
                success: false,
                message: "Only instructors can update lessons"
            });
        }

        // Check ownership
        if (course.instructor.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: "You can update only your own course lessons"
            });
        }

        const {
            title,
            description,
            videoUrl,
            lessonNumber,
        } = req.body;

        // Partial Update
        if (title !== undefined) lesson.title = title;
        if (description !== undefined) lesson.description = description;
        if (videoUrl !== undefined) lesson.videoUrl = videoUrl;
        if (lessonNumber !== undefined) lesson.lessonNumber = lessonNumber;

        await lesson.save();

        res.status(200).json({
            success: true,
            message: "Lesson updated successfully",
            lesson,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};
export const deleteLesson = async (req, res) => {
    try {

        const { lessonId } = req.params;

        // Check valid Lesson ID
        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Lesson ID",
            });
        }

        // Find Lesson
        const lesson = await Lesson.findById(lessonId);

        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Lesson not found",
            });
        }

        // Find Course
        const course = await Course.findById(lesson.course);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Only instructors can delete
        if (req.role !== "instructor") {
            return res.status(403).json({
                success: false,
                message: "Only instructors can delete lessons",
            });
        }

        // Check ownership
        if (course.instructor.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: "You can delete only your own course lessons",
            });
        }

        // Delete lesson
        await Lesson.findByIdAndDelete(lessonId);

        res.status(200).json({
            success: true,
            message: "Lesson deleted successfully",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};