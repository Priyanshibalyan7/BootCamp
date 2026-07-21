import Course from "../models/Course.js";
import mongoose from "mongoose"

export const createCourse = async (req, res) => {
    try {
        if (req.role !== "instructor") {
            return res.status(403).json({
                success: false,
                message: "Only instructors can create courses",
            });
        }

        const { title, description, category, price } = req.body;

        const course = await Course.create({
            title,
            description,
            category,
            price,
            instructor: req.userId,
        });

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            course,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const getAllCourses = async (req, res) => {
    try {

        const { search, category, sort } = req.query;

        let filter = {};

        // Search by title
        if (search) {
            filter.title = {
                $regex: search,
                $options: "i",
            };
        }

        // Filter by category
        if (category) {
            filter.category = category;
        }

        let query = Course.find(filter).populate(
            "instructor",
            "name email"
        );

        // Sorting
        if (sort === "priceLow") {
            query = query.sort({ price: 1 });
        }

        else if (sort === "priceHigh") {
            query = query.sort({ price: -1 });
        }

        else if (sort === "newest") {
            query = query.sort({ createdAt: -1 });
        }

        else if (sort === "oldest") {
            query = query.sort({ createdAt: 1 });
        }

        const courses = await query;

        res.status(200).json({
            success: true,
            totalCourses: courses.length,
            courses,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};
export const getSingleCourse = async (req, res) => {
    try {

        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Course ID"
            });
        }

        const course = await Course.findById(id)
            .populate("instructor", "name email role");

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            course
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if course ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Course ID",
            });
        }

        // Find course
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Only instructors can update
        if (req.role !== "instructor") {
            return res.status(403).json({
                success: false,
                message: "Only instructors can update courses",
            });
        }

        // Check ownership
        if (course.instructor.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: "You can update only your own courses",
            });
        }

        // Update fields
        const { title, description, category, price } = req.body;

        if (title !== undefined) course.title = title;
        if (description !== undefined) course.description = description;
        if (category !== undefined) course.category = category;
        if (price !== undefined) course.price = price;

        await course.save();

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Course ID",
            });
        }

        // Find course
        const course = await Course.findById(id);

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
                message: "Only instructors can delete courses",
            });
        }

        // Check ownership
        if (course.instructor.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: "You can delete only your own courses",
            });
        }

        // Delete course
        await Course.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};