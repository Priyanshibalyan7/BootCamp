import express from 'express';
import connecttoDB from './database/mongodb.js';
import route from './routes/route.js';
import cors from 'cors';
const app = express();
app.use(cors({
    origin:'*',
    methods:['GET','POST','PUT','DELETE']
}))

app.use(express.json())
app.use(route)
const port = 5000;
connecttoDB();

app.listen(port,()=>{
    console.log("server is running on port :", port)
})