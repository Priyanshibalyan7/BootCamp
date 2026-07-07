import express from 'express';
import connecttoDB from './database/mongodb.js';
import route from './routes/route.js';
const app = express();
const port = 5000;

app.use(express.json())
app.use(route)
connecttoDB();

app.listen(port,()=>{
    console.log("server is running on port :", port)
})