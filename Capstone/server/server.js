import express from "express"
import cors from "cors"
import { connectToDB } from "./database/MongoDB.js";
import router from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express()
const port = 5000;
app.use(cors());
app.use(express.json());
connectToDB()
app.use(router)
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/admin", adminRoutes);




app.listen(port,()=>{
    console.log("server is running on port :",port);
    
})