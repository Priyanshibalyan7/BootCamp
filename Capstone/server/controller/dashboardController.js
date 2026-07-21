import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";

export const studentDashboard = async (req, res) => {
    try {

        if (req.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Only students can access this dashboard"
            });
        }

        // Get enrolled courses
        const enrollments = await Enrollment.find({
            student: req.userId
        });

        const enrolledCourses = enrollments.length;

        // Count lessons in enrolled courses
        const courseIds = enrollments.map(item => item.course);

        const totalLessons = await Lesson.countDocuments({
            course: { $in: courseIds }
        });

        res.status(200).json({
            success: true,
            dashboard: {
                enrolledCourses,
                totalLessons
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const instructorDashboard = async (req, res) => {
    try {

        if (req.role !== "instructor") {
            return res.status(403).json({
                success: false,
                message: "Only instructors can access this dashboard"
            });
        }

        // Courses created by instructor
        const courses = await Course.find({
            instructor: req.userId
        });

        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        // Total lessons
        const totalLessons = await Lesson.countDocuments({
            course: { $in: courseIds }
        });

        // Total enrollments
        const totalStudents = await Enrollment.countDocuments({
            course: { $in: courseIds }
        });

        res.status(200).json({
            success: true,
            dashboard: {
                totalCourses,
                totalLessons,
                totalStudents
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};