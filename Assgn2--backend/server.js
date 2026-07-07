import express, { Router } from 'express';
import route from './routes/userRoutes.js';
import cors from 'cors';

const app = express()
app.use(express.json()) // to parse the data from client to server
app.use(cors())
app.use(route) // Use the routes and build the connection

let port = 3000
app.get('/',(req,res)=>{
    res.send(`<h1>welcome to backend</h1>`)
})
app.post('/addEmployee',(req,res)=>{
    
})
app.listen(port,()=>{
    console.log("server running on port : " ,port);
    
})