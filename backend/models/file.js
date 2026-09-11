import mongoose from "mongoose"

const FileSchema = new mongoose.Schema({
    originalName : {
        type : String,
        required:true
    },
    fileName :{
        type : String,
         required : true
    },
    filePath : {
        type : String,
        required : true
    },
    mimeType : {
        type : String,
        required : true
    },
    size : {
        type : Number,
        required : true
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{
    timestamps : true
})

const File = mongoose.model("File",FileSchema)

export default File;