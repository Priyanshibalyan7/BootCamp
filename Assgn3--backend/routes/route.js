import express from "express";
import { createUser, deleteUser, getUser, updateUser } from "../controller/userLogic.js";

const route= express.Router();
route.post('/createUser',createUser)
route.get('/getUser',getUser)
route.put('/updateUser/:userID',updateUser)
route.delete('/deleteUser/:userID',deleteUser)
export default route;