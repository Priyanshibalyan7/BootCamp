import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken"
import User from "../models/User.js"

const registerUser = async (req, res) => {
    try {
        let { name, email, password, role } = req.body
        if (!name || !email || !password || !role) {
            return res.status(404).json({
                message: "data not found for registration...:("
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
            message: "internal server error",
            success: false
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
            let token = jsonwebtoken.sign({ userid: user._id, role: user.role }, 'studentKey', { expiresIn: "3d" })
            res.cookie('token', token, { maxAge: 3 * 24 * 60 * 60 * 1000 })
                .status(200).json({
                    success: true,
                    token,
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    message: "Login successful"
                });
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

async function getProfile(req, res) {
    try {

        const user = await User.findById(req.userid).select("-password");

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}


export { registerUser, login, getProfile };