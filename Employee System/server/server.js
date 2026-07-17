import express from 'express';
import connecttoDB from './database/mongodb.js';
import route from './routes/route.js';
import cors from 'cors';
import dotenv from "dotenv"
dotenv.config()
const app = express();
app.use(cors({
    origin:'*',
    methods:['GET','POST','PUT','DELETE']
}))

app.use(express.json())
app.use(route)
const port = process.env.PORT;
connecttoDB();

app.listen(port,()=>{
    console.log("server is running on port :", port)
})