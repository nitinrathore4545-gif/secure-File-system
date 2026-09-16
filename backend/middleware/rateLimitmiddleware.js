import rateLimit from "express-rate-limit"

const generalLimiter = rateLimit({
    windowMs:15*60*1000,
    max:100,
    message:{
        message:"Too many requests.Please try again later."
    }
})

const loginLimiter = rateLimit({
    windowMs:15*60*1000,
    max:5,
    message:{
        message:"Too many login attempts. Please try again later."
    }
})

const registerLimiter = rateLimit({
    windowMs:15*60*1000,
    max:3,
    message:{
        message:"Too many registration attempts. Please try again later."
    }
})

const uploadLimiter = rateLimit({
    windowMs:60*60*1000,
    max:20,
    message:{
        message:"Upload limit reached. Please try again later."
    }
})

const downloadLimiter = rateLimit({
    windowMs:60*60*1000,
    max:100,
    message:{
        message:"Download limit reached . Please try again later."
    }
})
export {
    generalLimiter,
    loginLimiter,
    registerLimiter,
    uploadLimiter,
    downloadLimiter
}