import User from "../models/User.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import Enrollment from "../models/Enrollment.js";
export const getAllUsers = async (req, res) => {

    try {

        const users = await User.find().select("-password");

        res.status(200).json({
            success: true,
            totalUsers: users.length,
            users
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
export const deleteUser = async (req, res) => {

    try {

        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
export const getAllCoursesAdmin = async (req, res) => {

    try {

        const courses = await Course.find()
            .populate("instructor", "name email");

        res.status(200).json({
            success: true,
            totalCourses: courses.length,
            courses
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
export const deleteCourseAdmin = async (req, res) => {

    try {

        const { id } = req.params;

        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Delete related lessons
        await Lesson.deleteMany({
            course: id
        });

        // Delete enrollments
        await Enrollment.deleteMany({
            course: id
        });

        // Delete course
        await Course.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}