// import { use } from "react";
import User from "../model/user.js";

const createUser = async (req, res) => {
    try {
        const { name, email, empId, mobile, age, designation } = req.body;
        // let empIDupdated = Number(empId)
        // console.log(typeof empIDupdated);


        if (!name || !email || !empId || !age || !mobile || !designation) {
            return res.json({
                message: "data not found",
                success: false
            })


        }
        //-----------data creation-----------
        let user = await User.create({ empId, name, email,mobile,age,designation })
        console.log(user);

        //--------send response to User----------
        res.status(200).json({
            message: 'data created successfully',
            success: true,
            user,

        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "data not created ", error
        })

    }
}

const getUser = async (req, res) => {
    try {
        const user = await User.find()
        if (!user) {
            res.status(404).json({
                message: "data not found....",
                success: false

            })
        }
        res.status(200).json({
            succcess: true,
            user,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "server error :", error
        })

    }
}

const updateUser = async (req, res) => {
    try {
        let { name, email, empId, mobile, age, designation } = req.body
        let { userID } = req.params
        let user = await User.findById(userID)
        if (!user) {
            return res.status(404).json({
                message: "data not found",
                success: false
            })
        }
        let updateUser = user

        if (name) {
            updateUser = await User.findByIdAndUpdate(userID, { name }, { new: true })
        }

        if (email) {
            updateUser = await User.findByIdAndUpdate(userID, { email }, { new: true })
        }

        if (empId) {
            updateUser = await User.findByIdAndUpdate(userID, { empId }, { new: true })

        }
        if (mobile) {
            updateUser = await User.findByIdAndUpdate(userID, { mobile }, { new: true })

        }
        if (age) {
            updateUser = await User.findByIdAndUpdate(userID, { age }, { new: true })

        }
        if (designation) {
            updateUser = await User.findByIdAndUpdate(userID, { designation }, { new: true })

        }

        res.status(200).json({
            message: "data updated successfully....",
            updateUser,
            success: true
        })

    } catch (error) {
        res.status(500).json({
            message: 'failed to updated data internal server error',
            success: false
        })

    }
}

const deleteUser = async (req, res) => {
    try {
        let { userID } = req.params
        let deleteUser = await User.findByIdAndDelete(userID)

        res.status(200).json({
            message: "data deleted successfully..",
            success: true,
        })

    } catch (error) {
        req.status(500).json({
            message: "failed to delete user....",
            success: false
        })

    }
}
export { createUser, getUser, updateUser, deleteUser };