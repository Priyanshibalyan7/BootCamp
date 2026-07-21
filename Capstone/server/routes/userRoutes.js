import express from "express"
import { getProfile, login, registerUser } from "../controller/userLogic.js";
import { auth } from "../middldeware/auth.js";
const router = express.Router()

router.post("/register", registerUser);
router.post('/login',login)

router.get("/profile", auth, getProfile);

export default router
