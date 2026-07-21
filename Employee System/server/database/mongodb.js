import mongoose from "mongoose";

async function connecttoDB(){
    try{
        await mongoose.connect('mongodb://Employee-System:1980@ac-dbtdczd-shard-00-00.vfyxktw.mongodb.net:27017,ac-dbtdczd-shard-00-01.vfyxktw.mongodb.net:27017,ac-dbtdczd-shard-00-02.vfyxktw.mongodb.net:27017/?ssl=true&replicaSet=atlas-6a69er-shard-0&authSource=admin&appName=Employee')
        console.log("database connected successfully");
        
    }catch(error){
        console.log("failed to connect database : ", error);
        process.exit(1)
    }
}
export default connecttoDB;