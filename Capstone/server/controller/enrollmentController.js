import mongoose from "mongoose";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

export const enrollCourse = async (req, res) => {
    try {

        // Only students can enroll
        if (req.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Only students can enroll in courses",
            });
        }

        const { courseId } = req.params;

        // Check valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Course ID",
            });
        }

        // Check course exists
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Check duplicate enrollment
        const alreadyEnrolled = await Enrollment.findOne({
            student: req.userId,
            course: courseId,
        });

        if (alreadyEnrolled) {
            return res.status(400).json({
                success: false,
                message: "You are already enrolled in this course",
            });
        }

        // Create enrollment
        const enrollment = await Enrollment.create({
            student: req.userId,
            course: courseId,
        });

        res.status(201).json({
            success: true,
            message: "Enrollment successful",
            enrollment,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};
export const getMyCourses = async (req, res) => {
    try {

        // Only students can access
        if (req.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Only students can view enrolled courses"
            });
        }

        const enrollments = await Enrollment.find({
            student: req.userId
        })
            .populate({
                path: "course",
                populate: {
                    path: "instructor",
                    select: "name email"
                }
            });

        res.status(200).json({
            success: true,
            totalCourses: enrollments.length,
            enrollments
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
export const unenrollCourse = async (req, res) => {
    try {

        // Only students can unenroll
        if (req.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Only students can unenroll from courses"
            });
        }

        const { courseId } = req.params;

        // Validate Course ID
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Course ID"
            });
        }

        // Find enrollment
        const enrollment = await Enrollment.findOne({
            student: req.userId,
            course: courseId
        });

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: "You are not enrolled in this course"
            });
        }

        // Delete enrollment
        await Enrollment.findByIdAndDelete(enrollment._id);

        res.status(200).json({
            success: true,
            message: "Course unenrolled successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};