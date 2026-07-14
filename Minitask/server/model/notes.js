import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title:{
        type :String,
        require:true
    },
    description:{
        type :String,
        require:true
    },


})
const Notes = mongoose.model("Notes",noteSchema)
export default Notes;