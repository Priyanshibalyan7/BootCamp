import express from "express";

const app =express()
const port = 4000;

app.use(express.json())

// app.get('/',(req,res)=>{
//     res.send("<h1>this is home</h1>")
// })
// app.get('/about',(req,res)=>{
//     res.send("<h1>this is about page</h1>")
// })


let students = ["ankit","amit","soham"];
//get operation --> data is passed from server to client
app.get('/getStudents',(req,res)=>{
    res.json({
        data:students,
        success:true,
        message:'data transfered successfully',
    })
})

// post operation --> data is created and passed from client to server

app.post('/createName',(req,res)=>{
    const {name} = req.body
    
    students.push(name)
    res.json({
        data:students,
        success:true,
        message:'data added successfully',

    })
})

//put operation --> data is updated 

app.put('/updateName',(req,res)=>{
    const {name,newName} =req.body
    let index = students.indexOf(name)
    // console.log(index);

    students[index] =newName
    res.json({
        data:students,
        success:true,
        message:'data updated successfully',
    })
})

//app delete --> deletes the value
app.delete('/deleteName',(req,res)=>{
    const {name} =  req.body
    const index = students.indexOf(name)
    students.splice(index,1)
    res.json({
        data:students,
        message:"data deleted successfully",
        success : true,
    })
})


app.listen(port,()=>{
    console.log("server is running on port :",port);
    
})
