import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("mongoose connnected")
    }catch(error){
        console.log("Mongoose connection failed")
        console.log(error.message)
    }
}

export default connectDB