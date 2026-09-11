import express from "express"
import bcrypt from "bcryptjs"
import User from "../models/user.js"
import jwt from "jsonwebtoken"
import authMiddleware from "../middleware/authmiddleware.js"


const router = express.Router()

router.post("/register",async (req,res)=>{
   const {name,email,password}= req.body
  const existinguser = await User.findOne({email})
  if(existinguser){
    return res.status(400).json({
        message:"user already exists"
    })
  }
  const hashedpassword = await bcrypt.hash(password,10)
  const user = await User.create({
    name,
    email,
    password : hashedpassword
  })
  res.status(201).json({
    message:"user registered successfully",
    user:{
        id:user._id,
        name:user.name,
        email:user.email
    }
  })
})

router.post("/login",async (req,res)=>{
    const {email,password} = req.body
    const user = await User.findOne({email})
    if(!user){
        return res.status(400).json({
            message:"invalid email or password"
        })
    }
    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    )
    if(!isPasswordCorrect){
        return res.status(400).json({
            message:"invalid email or password"
        })
    }
    const token = jwt.sign(
        {userId: user._id},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )
    res.json({
        message:"login successful",
        token,
        user:{
            id:user._id,
            name:user.name,
            email:user.email
        }
    })
})

router.get("/profile",authMiddleware,async (req,res)=>{
    const user = await User.findById(req.user).select("-password")
    res.json({
        message:"this is a protected route",
        user
    })
})
export default router;