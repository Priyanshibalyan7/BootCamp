import mongoose from "mongoose";
export const connectToDB = async()=>{
    try {
        await mongoose.connect('mongodb://localhost:27017/Capstone')
        console.log("database is running successfully....");
        
        
    } catch (error) {
        console.log("failed to connect to database:",error);
        process.exit(1)
        
        
    }
}