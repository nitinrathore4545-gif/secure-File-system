import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import fileroutes from "./routes/fileroutes.js"
import authroutes from "./routes/authroutes.js"
import multer from "multer"
import cors from "cors"



dotenv.config()

const app = express()
app.use(cors())

app.use(express.json())


connectDB()

app.use("/api/auth",authroutes)
app.use("/api/files",fileroutes)

app.use((err,req,res,next)=>{
    if(err instanceof multer.MulterError){
        if(err.code === "LIMIT_FILE_SIZE"){
            return res.status(400).json({
                message:"File size cannot exceed 10 MB"
            })
        }
        return res.status(400).json({
            message : err.message
        })
    }
    if(err){
        return res.status(400).json({
            message : err.message
        })
    }
    next()
})



app.get("/",(req,res)=>{
    res.send("Backend is running")
})

app.listen(3000, ()=>{
    console.log("server is running on http://localhost:3000")
})