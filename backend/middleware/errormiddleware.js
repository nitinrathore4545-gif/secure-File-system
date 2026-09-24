const errorMiddleware = (err,req,res,next) => {
    console.log("ERROR:",err.message)
    return res.status(500).json({
        message : "Something Went Wrong"
    })
}

export default errorMiddleware