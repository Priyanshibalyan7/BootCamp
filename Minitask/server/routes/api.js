import express from "express";
import { createNote, getNotes, login, SignUp, updateNote } from "../controller/userLogic.js";
const router = express.Router()

router.post('/register',SignUp)
router.post('/login',login)
router.post('/notes',createNote)
router.get('/notes',getNotes)
router.put('/notes:id',updateNote)

export default router;