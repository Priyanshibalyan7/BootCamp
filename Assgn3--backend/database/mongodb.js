import mongoose from "mongoose";

async function connecttoDB(){
    try{
        await mongoose.connect('mongodb://localhost:27017/employeeDb')
        console.log("database connected successfully");
        
    }catch(error){
        console.log("failed to connect database : ", error);
        process.exit(1)
        

    }
}
export default connecttoDB;