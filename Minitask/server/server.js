import express from "express";
import connecttoDB from "./database/mongoDB.js";
import router from "./routes/api.js";
import cors from 'cors';
const app = express();
app.use(cors({
    origin:'*',
    methods:['GET','POST','PUT','DELETE']
}))
app.use(express.json())
app.use(router)


const port = 4000
connecttoDB()

app.listen(port,()=>{
    console.log("server is running on port :", port)
})