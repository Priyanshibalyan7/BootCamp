import express from "express";

import {instructorDashboard, studentDashboard,} from "../controller/dashboardController.js";
import { auth } from "../middldeware/auth.js";

const router = express.Router();

router.get("/student", auth, studentDashboard);

router.get("/instructor", auth, instructorDashboard);

export default router;