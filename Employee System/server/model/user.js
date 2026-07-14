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
    empId:{
        type:Number,
        require:true,
    },
    mobile:{
        type:Number,
        require:true,
    },
    age:{
        type:Number,
        require:true,
    },
    designation:{
        type:String,
        require:true,
    }
})

const User = mongoose.model("User",user)

export default User;