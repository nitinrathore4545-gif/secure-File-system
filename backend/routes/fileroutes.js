import express from "express"
import upload from "../middleware/uploadmiddleware.js"
import authMiddleware from "../middleware/authmiddleware.js"
import File from "../models/file.js"
import fs from "fs/promises"
import { uploadLimiter,downloadLimiter } from "../middleware/rateLimitmiddleware.js"
import mongoose from "mongoose"

const router = express.Router()

router.post(
    "/upload",
    authMiddleware,
    uploadLimiter,
    upload.array("files",5),
    async (req,res)=>{
        try {
           if(!req.files || req.files.length === 0){
            return res.status(400).json({
                message:"No files uploaded"
            })
           }
           const files = await File.insertMany(
            req.files.map((file)=>({
                originalName:file.originalname,
                fileName:file.filename,
                filePath:file.path,
                mimeType:file.mimetype,
                size:file.size,
                owner:req.user
            }))
           )

            res.status(201).json({
                message:"Files uploaded successfully",
                files
            })
        }catch(error){
            res.status(500).json({
                message : "File upload failed",
                error : error.message
            })
        }
    } 
)

router.get("/",authMiddleware,async (req,res)=>{
    try{
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
       

        const skip = (page-1) * limit

         const search = req.query.search || ""

        const files = await File.find({
            owner:req.user,
            originalName :{
                $regex : search,
                $options : "i"
            }
        }).sort({
            createdAt : -1
        }).skip(skip)
        .limit(limit)
        const totalFiles = await File.countDocuments({
            owner:req.user,
            originalName :{
                $regex:search,
                $options:"i"
            }
        })
        res.json({
            files,
            page,
            limit,
            totalFiles,
            totalPages:Math.ceil(totalFiles/limit)
        })
    }catch(error){
        res.status(500).json({
            message : "Failed to fetch files"
        })
    }
})


router.get("/:id/download",authMiddleware,downloadLimiter,async (req,res)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({
                message:"Invalid File ID"
            })
        }
        const file = await File.findOne({
            _id : req.params.id,
            owner : req.user
        })
        if(!file){
            return res.status(404).json({
                message : "File not found"
            })
        }
        res.download(
            file.filePath,
            file.originalName,
            (error)=>{
                if(error){
                    console.log("Download error : ",error.message)
                }
            }
        )
    }catch(error){
        res.status(500).json({
            message:"Failed to download File"
        })
    }
})


router.get("/:id",authMiddleware,async (req,res)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({
                message:"Invalid file ID"
            })
        }
        const file = await File.findOne({
            _id : req.params.id,
            owner : req.user
        })
        if(!file){
            return res.status(404).json({
                message :"File not Found"
            })
        }
        res.json({
            file
        })
    }catch(error){
        res.status(500).json({
            message:"Failed to Fetch File"
        })
    }
})

router.delete("/:id",authMiddleware,async(req,res)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({
                message:"Invalid file ID"
            })
        }
        const file = await File.findOne({
            _id:req.params.id,
            owner : req.user
        })
        if(!file){
            return res.status(404).json({
                message:"File not Found"
            })
        }
        await fs.unlink(file.filePath)
        await File.deleteOne({
            _id : file._id
        })
        res.json({
            message:"File deleted Successfully"
        })
    }catch(error){
        res.status(500).json({  
            message:"Failed to delete File"
        })
    }
})

router.patch("/:id",authMiddleware,async(req,res)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({
                message:"Invalid file ID"
            })
        }
        const {originalName} = req.body

        if(!originalName || typeof originalName !== "string"){
            return res.status(400).json({
                message:"Valid file name is required"
            })
        }
        if(originalName.length > 255){
            return res.status(400).json({
                message:"File name is too long"
            })
        }

        if(!originalName){
            return res.status(400).json({
                message:"New File is required"
            })
        }
        const file = await File.findOne({
            _id:req.params.id,
            owner:req.user
        })
        if(!file){
            return res.status(404).json({
                message:"File not Found"
            })
        }
        file.originalName = originalName
        await file.save()
        res.json({
            message:"File renamed successfully",
            file
        })
    }catch(error){
        res.status(500).json({
            message:"Failed to rename File"
        })
    }
})

export default router