import jwt from "jsonwebtoken"

const authMiddleware = (req,res,next)=>{
 try{
    const authheader = req.headers.authorization
    if(!authheader){
        return res.status(401).json({
            message:"No token provided"
        })
    }
    const token = authheader.split(" ")[1]
    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    )
    req.user = decoded.userId
    next()
 }catch(error){
    return res.status(401).json({
        message:"invalid or expired token"
    })
 }
}

export default authMiddleware;