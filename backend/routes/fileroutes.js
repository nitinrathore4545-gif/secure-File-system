import express from "express"
import upload from "../middleware/uploadmiddleware.js"
import authMiddleware from "../middleware/authmiddleware.js"
import File from "../models/file.js"
import fs from "fs/promises"

const router = express.Router()

router.post(
    "/upload",
    authMiddleware,
    upload.single("file"),
    async (req,res)=>{
        try {
            if(!req.file){
                return res.status(400).json({
                    message:"No file uploaded"
                })
            }
            const file = await File.create({
                originalName : req.file.originalname,
                fileName : req.file.filename,
                filePath : req.file.path,
                mimeType : req.file.mimetype,
                size : req.file.size,
                owner : req.user
            })

            res.status(201).json({
                message:"File uploaded successfully",
                file
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
        const files = await File.find({
            owner:req.user
        }).sort({
            createdAt : -1
        })
        res.json({
            files
        })
    }catch(error){
        res.status(500).json({
            message : "Failed to fetch files"
        })
    }
})



router.get("/:id",authMiddleware,async (req,res)=>{
    try{
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
router.get("/:id/download",authMiddleware,async (req,res)=>{
    try{
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

router.delete("/:id",authMiddleware,async(req,res)=>{
    try{
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
        const {originalName} = req.body

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