import express from "express";
import{ getStudent , addStudent , updateStudent, deleteStudent} from "../controller/user.js";

const route = express.Router()
route.get('/getStudent' ,getStudent)
route.post('/addStudent', addStudent)
route.put('/updateStudent', updateStudent)
route.delete('/deleteStudent', deleteStudent)

export default route;