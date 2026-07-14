import User from "../model/user.js";
import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken"
import Notes from "../model/notes.js";
const SignUp = async (req, res) => {
    try {

        let { name, email, password, role } = req.body
        if (!name || !email || !password || !role) {
            return res.status(404).json({
                message: "Please give all the required information",
                success: false
            })
        }
        let existUser = await User.findOne({ email })

        if (existUser) {
            return res.status(409).json({
                message: "user already exists with this email ID",
                success: false
            })

        }
        let hashpassword;

        try {
            hashpassword = await bcrypt.hash(password, 10)
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "did not hash pass..."
            })
        }
        let user = await User.create({ name, email, role, password: hashpassword })

        res.status(200).json({
            message: "data created successfully..",
            success: true,
            user,
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "server error :", error
        })

    }

}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(404).json({
                success: true,
                message: "data not found for login..."
            })
        }
        let user = await User.findOne({ email })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "user not found by this email ID"
            })
        }


        if (await bcrypt.compare(password, user.password)) {
            let token = jsonwebtoken.sign({ useid: user._id }, 'studentkey', { expiresIn: "3d" })
            res.cookie('tokenCookie', token, { maxAge: 3 * 24 * 60 * 60 * 1000 })
                .status(200).json({
                    success: true,
                    token,
                    message: "user loged in successfully"
                })
        } else {
            return res.status(401).json({
                message: "invalid password",
                success: false
            })
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "internal server error", error,
            success: false
        })

    }
}
const createNote = async (req, res) => {
    try {
        const { title, description } = req.body
        if (!title || !description) {
            return res.status(404).json({
                success: true,
                message: "data not found for note..."
            })
        }
        const note = await Notes.create({ title, description, user: req.user })

        res.status(200).json({
            message: "note created successfully..",
            success: true,
            note
        })

    } catch (error) {
        res.status(500).json({
            message: "internal server error", error,
            success: false

        })

    }
}
const getNotes = async (req, res) => {
    const notes = await Notes.find({ user: req.user })

    res.status(200).json({
        User,
        success:true,
        notes
    });

}
const updateNote = async (req, res) => {
    try {
        let { title,description} = req.body

        let { userID } = req.params
        if (!note) {
            return res.status(404).json({
                succcess: false,
                message: "note ID not found for update"
            })
        }
        let note = await Notes.findById(userID)
        if (!note) {
            return res.status(404).json({
                message: "data not found",
                success: false
            })

        }
        let updateNote = note

        if (title) {
            updateNote = await Notes.findByIdAndUpdate(userID, { title }, { new: true })
        }

        if (description) {
            updateNote = await Notes.findByIdAndUpdate(userID, { description }, { new: true })
        }
        res.status(200).json({
            message: "note updated successfully....",
            updateNote,
            success: true
        })

    } catch (error) {
        res.status(500).json({
            message: 'failed to updated note internal server error',
            success: false
        })

    }
}


export { SignUp, login, createNote,getNotes,updateNote };