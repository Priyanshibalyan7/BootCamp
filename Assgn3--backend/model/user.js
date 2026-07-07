import mongoose from "mongoose";
const user= new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    empID:{
        type:Number,
        require:true,
    }
})

const User = mongoose.model("User",user)

export default User;