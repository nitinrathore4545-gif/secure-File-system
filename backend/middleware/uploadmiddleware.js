import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,"uploads/")
    },
    filename : (req,file,cb)=>{
        const extension = path.extname(file.originalname)
        const uniquename = 
        `${Date.now()}-${Math.round(Math.random()* 1E9)}${extension}`

        cb(null,uniquename)
    }
})


const fileFilter = (req,file,cb)=>{
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf"
    ]

    const extension = path.extname(file.originalname).toLowerCase()
    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".pdf"
    ]
    if(
        allowedMimeTypes.includes(file.mimetype) && 
        allowedExtensions.includes(extension)
    ){
        cb(null,true)
    }else{
        cb(new Error("Only JPG,PNG and PDF files are allowed"))
    }
}
const upload = multer({
    storage,
    limits:{
        fileSize : 10 * 1024 * 1024
    },
    fileFilter
})

export default upload